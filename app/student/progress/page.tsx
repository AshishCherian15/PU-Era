import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CheckSquare, BookOpen, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'My Progress | PU Era',
  robots: { index: false },
}

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/progress')

  const { data: profile } = await supabase
    .from('profiles')
    .select('class_level, stream')
    .eq('id', user.id)
    .single()

  // Get all done chapters for this user
  const { data: done } = await supabase
    .from('progress')
    .select('chapter_id, done_at')
    .eq('user_id', user.id)

  const doneSet = new Set((done ?? []).map(d => d.chapter_id))

  // Get all chapters for their class/stream
  let chaptersQuery = supabase
    .from('chapters')
    .select('id, title, number, subject_id, subjects!inner(id, name, slug, class_level, stream)')
    .eq('status', 'active')

  if (profile?.class_level) {
    chaptersQuery = chaptersQuery.eq('subjects.class_level', profile.class_level)
  }
  if (profile?.stream) {
    chaptersQuery = chaptersQuery.eq('subjects.stream', profile.stream)
  }

  const { data: chapters } = await chaptersQuery.order('number')

  const bySubject = (chapters ?? []).reduce((acc: Record<string, typeof chapters>, ch) => {
    const sub = (ch as unknown as { subjects: { id: string; name: string; slug: string } }).subjects
    const key = sub.id
    if (!acc[key]) acc[key] = []
    acc[key]!.push(ch)
    return acc
  }, {})

  const totalChapters = (chapters ?? []).length
  const totalDone = (done ?? []).length
  const pct = totalChapters > 0 ? Math.round((totalDone / totalChapters) * 100) : 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-2 flex items-center gap-2">
        <CheckSquare className="w-6 h-6 text-primary" />
        My Progress
      </h1>
      <p className="text-muted mb-6">Tick off chapters as you study them</p>

      {/* Overall progress */}
      {totalChapters > 0 && (
        <div className="calling-card mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-heading">Overall: {pct}%</span>
            </div>
            <span className="text-sm text-muted">{totalDone} / {totalChapters} chapters</span>
          </div>
          <div className="h-2 bg-surface-alt rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${pct}% of syllabus completed`}>
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {Object.keys(bySubject).length === 0 ? (
        <div className="calling-card text-center py-12">
          <CheckSquare className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="font-semibold text-heading mb-1">No chapters to track yet</p>
          <p className="text-muted text-sm mb-4">Set your class and stream in your profile to see your syllabus here.</p>
          <Link href="/student/profile" className="btn-primary">Update profile</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(bySubject).map(([subId, chs]) => {
            const subject = (chs?.[0] as unknown as { subjects: { name: string; slug: string } }).subjects
            const subDone = (chs ?? []).filter(c => doneSet.has(c.id)).length
            const subPct = (chs ?? []).length > 0 ? Math.round((subDone / (chs ?? []).length) * 100) : 0

            return (
              <div key={subId} className="calling-card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-heading flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <Link href={`/subjects/${subject.slug}`} className="hover:text-primary transition-colors">
                      {subject.name}
                    </Link>
                  </h2>
                  <span className="text-sm text-muted">{subDone}/{(chs ?? []).length} · {subPct}%</span>
                </div>
                <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${subPct}%` }} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(chs ?? []).map(ch => (
                    <ProgressChapter
                      key={ch.id}
                      chapterId={ch.id}
                      title={ch.title}
                      number={ch.number}
                      isDone={doneSet.has(ch.id)}
                      userId={user.id}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Client component for individual chapter toggle
import { ProgressChapter } from '@/app/components/ProgressChapter'
