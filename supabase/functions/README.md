Supabase Functions for leads handling

Files:
- create-lead/index.ts -> receives POST requests and inserts into `leads` using SERVICE_ROLE.
- fetch-leads/index.ts -> requires x-admin-token header and returns the latest leads.

Deploy with Supabase CLI:

1. Install and login:
   supabase login

2. From repo root, deploy each function:
   supabase functions deploy create-lead --project-ref <your-project-ref>
   supabase functions deploy fetch-leads --project-ref <your-project-ref>

3. Set environment variables for each function in Supabase Console (Functions -> Settings):
   SUPABASE_URL = https://<your-project>.supabase.co
   SUPABASE_SERVICE_ROLE = <your-service-role-key>
   ADMIN_TOKEN = <a-strong-random-secret-for-admin-requests>

Notes:
- Never commit your SERVICE_ROLE key to the repo.
- Use the function URLs in your frontend via the VITE_* env vars.
