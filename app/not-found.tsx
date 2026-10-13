import Link from 'next/link'
import { Home, BookOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ background: '#D1FAE5' }}
      >
        <BookOpen className="w-10 h-10" style={{ color: 'var(--brand-green)' }} />
      </div>
      <h1
        className="text-7xl font-extrabold mb-3"
        style={{ color: 'var(--brand-green)', fontFamily: 'var(--font-display)' }}
      >
        404
      </h1>
      <h2
        className="text-2xl font-bold text-[#111827] mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Page Not Found
      </h2>
      <p className="text-slate-500 mb-8 max-w-md text-sm leading-relaxed">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary">
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link href="/subjects" className="btn-ghost">
          <BookOpen className="w-4 h-4" />
          Browse Subjects
        </Link>
      </div>
    </div>
  )
}
