import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const HUBSPOT_KEY = process.env.HUBSPOT_PRIVATE_APP_TOKEN || process.env.HUBSPOT_TOKEN || '';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.SUPABASE_ADMIN_TOKEN || '';

async function upsertContact(lead: any) {
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
  // Usa email como chave principal
  const body = {
    properties: {
      email: lead.email,
      firstname: lead.name?.split(' ')?.[0] || lead.name || '',
      lastname: lead.name?.split(' ')?.slice(1).join(' ') || 'Lead',
      phone: lead.phone || '',
      message: lead.message || '',
      whatsapp_consent: lead.whatsappConsent ? 'true' : 'false',
      source_claris: lead.source || 'landing'
    }
  };

  // Tenta pesquisar contato existente por email
  const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HUBSPOT_KEY}`
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            { propertyName: 'email', operator: 'EQ', value: lead.email }
          ]
        }
      ],
      properties: ['email']
    })
  });
  if (!searchRes.ok) {
    const txt = await searchRes.text();
    throw new Error(`HubSpot search error ${searchRes.status} ${txt}`);
  }
  const searchJson: any = await searchRes.json();
  const existingId = searchJson?.results?.[0]?.id;

  if (existingId) {
    // Update
    const updateRes = await fetch(`${url}/${existingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HUBSPOT_KEY}`
      },
      body: JSON.stringify(body)
    });
    if (!updateRes.ok) {
      const txt = await updateRes.text();
      throw new Error(`HubSpot update error ${updateRes.status} ${txt}`);
    }
    return { id: existingId, updated: true };
  }

  // Create
  const createRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HUBSPOT_KEY}`
    },
    body: JSON.stringify(body)
  });
  if (!createRes.ok) {
    const txt = await createRes.text();
    throw new Error(`HubSpot create error ${createRes.status} ${txt}`);
  }
  const created: any = await createRes.json();
  return { id: created.id, created: true };
}

async function addNote(contactId: string, lead: any) {
  if (!lead.message) return;
  const noteRes = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HUBSPOT_KEY}`
    },
    body: JSON.stringify({
      properties: {
        hs_note_body: `Mensagem do lead (Claris Landing)\n${lead.message}`
      },
      associations: [
        {
          to: { id: contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }]
        }
      ]
    })
  });
  if (!noteRes.ok) {
    const txt = await noteRes.text();
    console.warn('Falha ao criar nota HubSpot', noteRes.status, txt);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!HUBSPOT_KEY) return res.status(500).json({ error: 'HubSpot token ausente no servidor' });
  if (ADMIN_TOKEN) {
    const headerToken = req.headers['x-admin-token'];
    if (headerToken !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { lead, leads } = req.body || {};
    if (!lead && !leads) return res.status(400).json({ error: 'Body deve conter lead ou leads' });

    if (lead) {
      if (!lead.email) return res.status(400).json({ error: 'Lead sem email' });
      const r = await upsertContact(lead);
      await addNote(r.id, lead);
      return res.status(200).json({ hubspotId: r.id });
    }
    if (Array.isArray(leads)) {
      const results: any[] = [];
      for (const l of leads) {
        if (!l?.email) continue;
        try {
          const r = await upsertContact(l);
          await addNote(r.id, l);
          results.push({ id: l.id, hubspotId: r.id, ok: true });
        } catch (e: any) {
          results.push({ id: l.id, ok: false, error: e?.message });
        }
      }
      return res.status(200).json({ results });
    }
  } catch (e: any) {
    console.error('hubspot-sync error', e);
    return res.status(500).json({ error: e?.message || 'Internal error' });
  }
}
