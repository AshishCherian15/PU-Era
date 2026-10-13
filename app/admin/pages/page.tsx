export const instant = false

import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'

export default function AdminPagesPage() {
  const PAGES = [
    { slug: 'privacy-policy', label: 'Privacy Policy', href: '/legal/privacy' },
    { slug: 'terms-of-service', label: 'Terms of Service', href: '/legal/terms' },
    { slug: 'copyright', label: 'Copyright Policy', href: '/legal/copyright' },
    { slug: 'about', label: 'About Us', href: '/about' },
    { slug: 'contact', label: 'Contact', href: '/contact' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pages / Legal</h1>
          <p className="text-slate-400 text-sm mt-1">Manage static pages and legal documents</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">Static Pages</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {PAGES.map(page => (
            <div key={page.slug} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-white">{page.label}</p>
                  <p className="text-xs text-slate-500 font-mono">{page.href}</p>
                </div>
              </div>
              <Link
                href={page.href}
                target="_blank"
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-4">
        Static pages are managed via code in the <code className="text-slate-500">app/legal/</code> directory. 
        Edit the corresponding TSX files to update page content.
      </p>
    </div>
  )
}
