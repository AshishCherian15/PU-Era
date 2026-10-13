import Link from 'next/link'
import { BookOpen, Heart, ExternalLink, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* ── Main 4-Column Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">

          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#14532D' }}
              >
                <BookOpen className="w-4 h-4" style={{ color: '#FCD34D' }} />
              </div>
              <span
                className="text-xl font-bold tracking-tight text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                PU Era
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-xs">
              An independent, non-commercial educational portal for Karnataka 1st &amp; 2nd PUC
              and NCERT students. Free, syllabus-aligned notes, lab records, and official textbook
              links — no ads, no spam.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
              <span>Made with care for Karnataka students</span>
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            </div>
          </div>

          {/* Column 2: Study Hubs */}
          <div>
            <h3>Study Hubs &amp; Streams</h3>
            <ul className="space-y-2">
              {[
                { href: '/subjects?class=PUC2', label: 'Karnataka 2nd PUC Hub' },
                { href: '/subjects?class=PUC1', label: 'Karnataka 1st PUC Hub' },
                { href: '/subjects?class=NCERT12', label: 'NCERT Class 12 Hub' },
                { href: '/subjects?class=NCERT11', label: 'NCERT Class 11 Hub' },
                { href: '/subjects?stream=Science', label: 'Science Stream' },
                { href: '/subjects?stream=Commerce', label: 'Commerce Stream' },
                { href: '/subjects?stream=Arts', label: 'Arts Stream' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3>Resources</h3>
            <ul className="space-y-2">
              {[
                { href: '/lab-guides',  label: 'Lab Guides & Records' },
                { href: '/textbooks',   label: 'Official Textbooks Directory' },
                { href: '/resources',   label: 'Notes & Study Materials' },
                { href: '/about',       label: 'About PU Era' },
                { href: '/contact',     label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-6">Legal</h3>
            <ul className="space-y-2">
              {[
                { href: '/legal/terms',      label: 'Terms of Service' },
                { href: '/legal/privacy',    label: 'Privacy Policy' },
                { href: '/legal/disclaimer', label: 'Disclaimer' },
                { href: '/legal/copyright',  label: 'Copyright & Takedown' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & External */}
          <div>
            <h3>Contact &amp; Official Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@puera.in"
                  className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  contact@puera.in
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  Karnataka, India
                </div>
              </li>
            </ul>

            <h3 className="mt-6">Official Sources</h3>
            <ul className="space-y-2">
              {[
                { href: 'https://pue.karnataka.gov.in', label: 'Karnataka PUE Board' },
                { href: 'https://ktbs.kar.nic.in',       label: 'KTBS Textbooks' },
                { href: 'https://ncert.nic.in',           label: 'NCERT Official' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link flex items-center gap-1.5"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © 2026 PU Era. All rights reserved.
          </p>
          <p className="text-xs text-slate-700 text-center sm:text-right max-w-sm">
            Educational resources for reference only. Always refer to official textbooks and your institution&apos;s curriculum.
          </p>
        </div>
      </div>
    </footer>
  )
}
