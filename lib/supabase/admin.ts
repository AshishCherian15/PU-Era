import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Service-role client — ONLY used in server-only files
// Never expose this to client components; never use in Server Components directly
// Use ONLY in: Route Handlers, Server Actions with admin operations, cron jobs
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
