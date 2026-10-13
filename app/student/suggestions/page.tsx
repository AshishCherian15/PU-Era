import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Lightbulb } from 'lucide-react'
import SuggestionsView from './SuggestionsView'

export const metadata: Metadata = {
  title: 'Suggestions | PU Era',
  robots: { index: false },
}

export default async function SuggestionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/suggestions')

  const { data: suggestions } = await supabase
    .from('suggestions')
    .select('id, title, body, category, status, upvotes, admin_reply, created_at, user_id')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          Platform Suggestions
        </h1>
        <p className="text-muted text-sm mt-1">
          Have an idea to make PU Era more useful for PUC students? Submit and discuss ideas with our team.
        </p>
      </div>

      <SuggestionsView
        userId={user.id}
        initialSuggestions={suggestions ?? []}
      />
    </div>
  )
}
