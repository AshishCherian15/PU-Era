'use client'

export default function ArchiveButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="text-xs text-slate-500 hover:text-red-400 transition-colors"
      onClick={async () => {
        if (!confirm('Archive this announcement?')) return
        await fetch('/api/admin/announcements', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: 'archived' }),
        })
        window.location.reload()
      }}
    >
      Archive
    </button>
  )
}
