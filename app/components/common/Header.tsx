'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import {
  BookOpen, Search, User, Menu, X, Globe,
  FileText, FlaskConical, Home, MessageCircle, Phone
} from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_LINKS = [
  { href: '/',          label: 'Home',        icon: Home },
  { href: '/subjects',  label: 'Subjects',    icon: BookOpen },
  { href: '/lab-guides',label: 'Lab Guides',  icon: FlaskConical },
  { href: '/textbooks', label: 'Textbooks',   icon: FileText },
  { href: '/contact',   label: 'Contact',     icon: Phone },
]

function HeaderContent() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <header className="header-root">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">

            {/* ── Logo / Wordmark ── */}
            <Link
              href="/"
              id="site-logo"
              className="group flex items-center gap-2.5 shrink-0
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-lg p-1"
            >
              <div className="header-logo-box group-hover:bg-brand-green-light">
                <BookOpen className="w-5 h-5 text-accent-amber" strokeWidth={2.5} />
              </div>
              <div>
                <span
                  className="text-xl font-bold tracking-tight whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-green)' }}
                >
                  PU Era
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Karnataka PUC &amp; NCERT Hub
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Desktop Actions ── */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher />
              <button
                id="header-search-btn"
                aria-label="Search"
                className="btn-icon"
              >
                <Search className="w-4 h-4" />
              </button>
              <Link
                href="/login"
                id="header-signin-btn"
                className="btn-secondary text-sm py-2 px-4"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </Link>
              <Link
                href="/register"
                id="header-signup-btn"
                className="btn-primary text-sm py-2 px-4"
              >
                Sign Up
              </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              id="mobile-menu-toggle"
              className="lg:hidden btn-icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-md fade-in-up">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href)
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-emerald-50 text-brand-green font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-brand-green'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-brand-green' : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                )
              })}

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-3 px-3">
                <LanguageSwitcher />
                <button className="btn-icon ml-auto" aria-label="Search">
                  <Search className="w-4 h-4" />
                </button>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderContent />
    </Suspense>
  )
}

function HeaderFallback() {
  return (
    <header className="header-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          <Link
            href="/"
            className="group flex items-center gap-2.5 shrink-0"
          >
            <div className="header-logo-box">
              <BookOpen className="w-5 h-5 text-accent-amber" strokeWidth={2.5} />
            </div>
            <div>
              <span
                className="text-xl font-bold tracking-tight whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-green)' }}
              >
                PU Era
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
