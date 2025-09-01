import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const FN_URL = process.env.VITE_SUPABASE_FETCH_LEADS_FUNCTION_URL || process.env.SUPABASE_FETCH_LEADS_FUNCTION_URL;
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN; // must be set as server-only env in Vercel
  const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (!FN_URL) return res.status(500).json({ error: 'missing_fetch_function_url' });
  if (!ADMIN_TOKEN) return res.status(500).json({ error: 'missing_admin_token_on_server' });

  try {
    const r = await fetch(FN_URL, {
      method: 'GET',
      headers: {
        'x-admin-token': ADMIN_TOKEN,
        'apikey': ANON_KEY,
        'Authorization': ANON_KEY ? `Bearer ${ANON_KEY}` : '',
        'Content-Type': 'application/json'
      }
    });

    const text = await r.text();
    const contentType = r.headers.get('content-type') || 'application/json';
    res.status(r.status).setHeader('content-type', contentType).send(text);
  } catch (err) {
    console.error('api/get-leads proxy error:', err);
    res.status(500).json({ error: 'proxy_error', detail: String(err) });
  }
}