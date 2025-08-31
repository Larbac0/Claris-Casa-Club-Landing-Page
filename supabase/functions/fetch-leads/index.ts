import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE')!
const ADMIN_TOKEN = Deno.env.get('ADMIN_TOKEN')!

serve(async (req) => {
  if (req.method !== 'GET') return new Response('Method Not Allowed', { status: 405 })

  const provided = req.headers.get('x-admin-token')
  if (!provided || provided !== ADMIN_TOKEN) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000)

  if (error) {
    console.error('fetch-leads error', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ leads: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})
