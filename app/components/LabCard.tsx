import Link from 'next/link'
import { FlaskConical, ChevronRight } from 'lucide-react'
import type { LabExperiment } from '@/lib/types'

interface Props {
  experiment: LabExperiment
}

export function LabCard({ experiment }: Props) {
  return (
    <Link
      href={`/lab-guides/${experiment.slug}`}
      className="calling-card group flex flex-col hover:border-primary transition-all hover:-translate-y-0.5 duration-200"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
          <FlaskConical className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-heading text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {experiment.title}
          </h3>
        </div>
      </div>

      {experiment.aim && (
        <p className="text-xs text-muted line-clamp-2 mb-3 flex-1">{experiment.aim}</p>
      )}

      {Array.isArray(experiment.viva_qa) && experiment.viva_qa.length > 0 && (
        <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-3">
          ❓ {experiment.viva_qa.length} viva questions
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
          Lab Guide
        </span>
        <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
      </div>
    </Link>
  )
}
