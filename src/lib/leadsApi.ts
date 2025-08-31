import { supabase } from './supabaseClient';

type CreateLeadPayload = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  whatsappConsent?: boolean;
  source?: string | null;
  page_url?: string | null;
  page_title?: string | null;
};

/**
 * Try to create a lead using a Supabase Edge Function (recommended).
 * Falls back to direct insert with anon key if function URL is not configured or fails.
 */
export async function createLead(payload: CreateLeadPayload) {
  const fnUrl = import.meta.env.VITE_SUPABASE_CREATE_LEAD_FUNCTION_URL as string | undefined;
  if (fnUrl) {
    try {
      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          message: payload.message,
          whatsappConsent: payload.whatsappConsent,
          source: payload.source,
          page_url: payload.page_url,
          page_title: payload.page_title,
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Function error ${res.status} ${txt}`);
      }
      return await res.json();
    } catch (err) {
      // fallback to direct insert below
      // eslint-disable-next-line no-console
      console.warn('[leadsApi] createLead via function failed, falling back to direct insert:', err);
    }
  }

  // Fallback: insert directly using the anon key client
  const { data, error } = await supabase.from('leads').insert({
    name: payload.name ?? null,
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
    whatsapp_consent: payload.whatsappConsent ?? false,
    source: payload.source ?? null,
    page_url: payload.page_url ?? null,
    page_title: payload.page_title ?? null,
  });

  if (error) throw error;
  return data;
}

/**
 * Fetch leads for admin. Prefers calling a secured Edge Function that returns leads.
 * If not configured, attempts direct read (may fail if RLS is enabled).
 */
export async function fetchLeadsAdmin() {
  const fnUrl = import.meta.env.VITE_SUPABASE_FETCH_LEADS_FUNCTION_URL as string | undefined;
  const adminToken = import.meta.env.VITE_SUPABASE_ADMIN_TOKEN as string | undefined;

  if (fnUrl) {
    const headers: Record<string, string> = {};
    if (adminToken) headers['x-admin-token'] = adminToken;
    const res = await fetch(fnUrl, { method: 'GET', headers });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`fetchLeads function error ${res.status} ${txt}`);
    }
    return await res.json();
  }

  // Fallback: attempt direct select (only works if allowed by RLS)
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) throw error;
  return { leads: data };
}

export default { createLead, fetchLeadsAdmin };
