'use client'
import { useState, useOptimistic, startTransition } from 'react'
import { Check } from 'lucide-react'

interface Props {
  chapterId: string
  title: string
  number: number
  isDone: boolean
  userId: string
}

export function ProgressChapter({ chapterId, title, number, isDone, userId }: Props) {
  const [optimisticDone, setOptimisticDone] = useOptimistic(isDone)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (loading) return
    setLoading(true)
    startTransition(() => setOptimisticDone(!optimisticDone))

    try {
      await fetch('/api/progress', {
        method: optimisticDone ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_id: chapterId }),
      })
    } catch {
      startTransition(() => setOptimisticDone(optimisticDone))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all border ${
        optimisticDone
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
          : 'bg-surface-alt border-border text-body hover:border-primary hover:text-primary'
      }`}
      aria-pressed={optimisticDone}
      aria-label={`Chapter ${number}: ${title}${optimisticDone ? ' (done)' : ''}`}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        optimisticDone ? 'bg-emerald-500 border-emerald-500' : 'border-current'
      }`}>
        {optimisticDone && <Check className="w-2.5 h-2.5 text-white" />}
      </div>
      <span className="truncate">Ch {number}. {title}</span>
    </button>
  )
}
