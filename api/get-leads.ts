import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string | undefined;
const SERVICE_ROLE = (process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ADMIN_TOKEN) as string | undefined;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.SUPABASE_ADMIN_TOKEN || '';

if (!SUPABASE_URL) console.warn('ENV SUPABASE_URL ausente');
if (!SERVICE_ROLE) console.warn('ENV SUPABASE_SERVICE_ROLE (service role) ausente');

const supabase = SUPABASE_URL && SERVICE_ROLE
  ? createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } })
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validação opcional de header admin em dev
  if (ADMIN_TOKEN) {
    const headerToken = req.headers['x-admin-token'];
    if (headerToken !== ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not configured' });
  }

  try {
    // Filtros opcionais ?limit=&search=
    const limit = Math.min(parseInt((req.query.limit as string) || '1000', 10), 5000);
    const search = (req.query.search as string || '').trim();

    let query = supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(limit);

    // Se necessário buscar por nome/email/phone simples (ilike)
    if (search) {
      // Supabase não permite OR encadeado de forma simples com .ilike múltiplo, usar rpc ou construir manualmente.
      // Aqui exemplo simplificado: busca por nome (ilike) e depois filtra em memória para outros campos.
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    let leads = data || [];
    if (search) {
      const lc = search.toLowerCase();
      leads = leads.filter((l: any) =>
        (l.email || '').toLowerCase().includes(lc) ||
        (l.phone || '').includes(search) ||
        (l.name || '').toLowerCase().includes(lc)
      );
    }

    return res.status(200).json({
      count: leads.length,
      leads
    });
  } catch (e: any) {
    console.error('get-leads error', e);
    return res.status(500).json({ error: e?.message || 'Internal error' });
  }
}
