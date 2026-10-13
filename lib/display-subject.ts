import type { Subject as DbSubject } from '@/lib/types'
import type { Subject as TaxonomySubject } from '@/lib/content/taxonomy'

export type DisplaySubject = DbSubject | TaxonomySubject

export function subjectName(subject: DisplaySubject): string {
  if ('name_en' in subject && subject.name_en) return subject.name_en
  return subject.name
}

export function subjectCode(subject: DisplaySubject): string {
  return 'code' in subject ? subject.code : 'GEN'
}
