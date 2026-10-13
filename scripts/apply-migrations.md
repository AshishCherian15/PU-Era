# Apply Supabase migrations (PU Era)

Run these **in order** in the Supabase Dashboard → **SQL Editor** (project region: ap-south-1):

1. `supabase/migrations/0001_complete_schema.sql`
2. `supabase/migrations/0002_functions.sql`
3. `supabase/migrations/0003_seed_data.sql`

Then in **Authentication → URL configuration**:

- Site URL: `http://localhost:3000` (dev) or `https://puera.in` (prod)
- Redirect URLs: add `http://localhost:3000/api/auth/callback` and `https://puera.in/api/auth/callback`

Copy `.env.example` to `.env.local` and paste your project URL and keys.

Create at least one admin row in `admin_users` linked to an Auth user before using `/admin/login`.
