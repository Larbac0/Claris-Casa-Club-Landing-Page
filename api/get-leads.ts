import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') return res.status(405).end();

    const FN_URL = process.env.VITE_SUPABASE_FETCH_LEADS_FUNCTION_URL || process.env.SUPABASE_FETCH_LEADS_FUNCTION_URL;
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
    const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

    // quick checks (log presence & lengths, never full values)
    console.log('api/get-leads: FN_URL defined:', !!FN_URL);
    console.log('api/get-leads: ADMIN_TOKEN defined:', !!ADMIN_TOKEN);
    console.log('api/get-leads: ANON_KEY length:', ANON_KEY ? ANON_KEY.length : 0);

    if (!FN_URL) {
      console.error('api/get-leads: missing FN_URL env');
      return res.status(500).json({ error: 'missing_fetch_function_url' });
    }
    if (!ADMIN_TOKEN) {
      console.error('api/get-leads: missing ADMIN_TOKEN env (server-only)');
      return res.status(500).json({ error: 'missing_admin_token_on_server' });
    }

    // call Supabase Edge Function with a timeout and capture problems
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let upstream;
    try {
      upstream = await fetch(FN_URL, {
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
      console.error('api/get-leads: fetch to FN_URL failed:', err && (err.message || err));
      return res.status(502).json({ error: 'upstream_fetch_failed', detail: String(err?.message || err) });
    }
    clearTimeout(timeout);

    // read body safely and forward
    let text = '';
    try {
      text = await upstream.text();
    } catch (err: any) {
      console.error('api/get-leads: reading upstream response failed', err && (err.message || err));
      return res.status(502).json({ error: 'upstream_read_failed', detail: String(err?.message || err) });
    }

    const contentType = upstream.headers?.get?.('content-type') || 'application/json';
    // forward only content-type + status + body (avoid forwarding Set-Cookie)
    res.status(upstream.status).setHeader('content-type', contentType).send(text);
  } catch (err: any) {
    console.error('api/get-leads: unhandled error', err && (err.stack || err.message || err));
    res.status(500).json({ error: 'proxy_error', detail: String(err?.message || err) });
  }
}