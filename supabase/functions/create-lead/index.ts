import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE')!

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  try {
    const body = await req.json()
    const {
      name = null,
      email = null,
      phone = null,
      message = null,
      whatsappConsent = false,
      source = 'website',
      page_url = null,
      page_title = null,
    } = body

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name,
        email,
        phone,
        message,
        whatsapp_consent: whatsappConsent,
        source,
        page_url,
        page_title,
      }])

    if (error) {
      console.error('create-lead error', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, lead: data?.[0] }), { status: 200 })
  } catch (err) {
    console.error('create-lead caught', err)
    return new Response(JSON.stringify({ error: 'invalid_request' }), { status: 400 })
  }
})
