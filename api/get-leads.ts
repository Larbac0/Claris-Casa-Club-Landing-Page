import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') return res.status(405).end();

    const FN_URL = process.env.VITE_SUPABASE_FETCH_LEADS_FUNCTION_URL || process.env.SUPABASE_FETCH_LEADS_FUNCTION_URL;
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
    const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

    if (!FN_URL) {
      console.error('api/get-leads: missing FN_URL env');
      return res.status(500).json({ error: 'missing_fetch_function_url' });
    }
    if (!ADMIN_TOKEN) {
      console.error('api/get-leads: missing ADMIN_TOKEN env (server-only)');
      return res.status(500).json({ error: 'missing_admin_token_on_server' });
    }

    // timeout for downstream call
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let r;
    try {
      r = await fetch(FN_URL, {
        method: 'GET',
        headers: {
          'x-admin-token': ADMIN_TOKEN,
          'apikey': ANON_KEY,
          'Authorization': ANON_KEY ? `Bearer ${ANON_KEY}` : '',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
    } catch (err: any) {
      clearTimeout(timeout);
      console.error('api/get-leads: fetch to FN_URL failed', err && (err.stack || err.message || err));
      return res.status(502).json({ error: 'upstream_fetch_failed', detail: String(err?.message || err) });
    }
    clearTimeout(timeout);

    const text = await r.text().catch((e) => {
      console.error('api/get-leads: reading response text failed', e);
      return '';
    });
    const contentType = r.headers?.get?.('content-type') || 'application/json';
    res.status(r.status).setHeader('content-type', contentType).send(text);
  } catch (err: any) {
    console.error('api/get-leads: unhandled error', err && (err.stack || err.message || err));
    res.status(500).json({ error: 'proxy_error', detail: String(err?.message || err) });
  }
}