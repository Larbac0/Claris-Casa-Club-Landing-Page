import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.warn('Supabase env ausentes (SUPABASE_URL / SUPABASE_SERVICE_ROLE)');
}

const supabase = SUPABASE_URL && SERVICE_ROLE
  ? createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } })
  : null;

// (Opcional) simples proteção por cabeçalho se quiser:
// const API_KEY = process.env.ADMIN_TOKEN;
// if (API_KEY && req.headers['x-admin-token'] !== API_KEY) return res.status(401).json({ error: 'Unauthorized' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type,x-admin-token');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not configured' });
  }

  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '1000', 10), 5000);
    const search = (req.query.search as string || '').trim();

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (search) {
      // Simples OR - refine conforme índices
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ leads: data });
  } catch (e: any) {
    return res.status(500).json({ error: 'fetch_failed', detail: e?.message || String(e) });
  }
}