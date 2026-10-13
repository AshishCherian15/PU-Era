export const instant = false

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ArrowLeft, BookMarked } from 'lucide-react'
import EditResourceForm from './EditResourceForm'

export const metadata: Metadata = {
  title: 'Edit Resource | Admin PU Era',
  robots: { index: false },
}

export default async function AdminEditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: resource } = await supabase
    .from('resources')
    .select('*, subjects(id, name, class_level), chapters(id, title, number)')
    .eq('id', id)
    .single()

  if (!resource) notFound()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/resources"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Resources
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-emerald-400" />
          Edit Resource
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Update metadata, publishing status, or Google Drive link for this study material.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <EditResourceForm resource={resource} />
      </div>
    </div>
  )
}
