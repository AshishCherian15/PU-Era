import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function getLegalPage(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('pages').select('title, body, version, published_at').eq('slug', slug).single()
  return data
}

// ===== Terms of Service =====
export async function generateMetadataTerms(): Promise<Metadata> {
  return { title: 'Terms of Service | PU Era', robots: { index: true } }
}

export async function TermsPage() {
  const page = await getLegalPage('terms')

  return (
    <LegalLayout title={page?.title ?? 'Terms of Service'} version={page?.version} updatedAt={page?.published_at}>
      {page?.body ? (
        <div className="prose prose-sm max-w-none text-body" dangerouslySetInnerHTML={{ __html: page.body }} />
      ) : (
        <FallbackTerms />
      )}
    </LegalLayout>
  )
}

function FallbackTerms() {
  return (
    <div className="space-y-6 text-body text-sm">
      <Section title="1. Acceptance">
        <p>By accessing PU Era (puera.in) you agree to these Terms. If you disagree, do not use the site.</p>
      </Section>
      <Section title="2. Eligibility">
        <p>The site is intended for students enrolled in Karnataka PUC or NCERT Class 11/12 programmes. Users under 18 must have guardian consent to register and download materials.</p>
      </Section>
      <Section title="3. Account responsibilities">
        <p>You are responsible for maintaining your account credentials and any activity that occurs under your account. Do not share your password.</p>
      </Section>
      <Section title="4. Acceptable use">
        <p>You may use PU Era materials for personal study only. You may not redistribute, sell, or republish content without written permission. You must not attempt to extract, scrape, or copy the site systematically.</p>
      </Section>
      <Section title="5. Intellectual property">
        <p>Original content on PU Era (notes, lab guides, worked examples) is © PU Era and is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). NCERT and KTBS materials linked on this site remain the property of their respective rights holders and are accessed via their official websites.</p>
      </Section>
      <Section title="6. Disclaimers">
        <p>PU Era is an independent educational resource and is not affiliated with, endorsed by, or officially connected to KTBS, NCERT, or the Karnataka state government. We make no guarantees of accuracy; always verify important information with official sources before exams.</p>
      </Section>
      <Section title="7. Termination">
        <p>We may suspend or terminate accounts that violate these terms without prior notice.</p>
      </Section>
      <Section title="8. Changes">
        <p>We may update these Terms. Continued use after 14 days of notification constitutes acceptance.</p>
      </Section>
      <Section title="9. Governing law">
        <p>These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Karnataka, India.</p>
      </Section>
      <Section title="10. Contact">
        <p>For questions about these Terms, write to <a href="mailto:legal@puera.in" className="text-primary hover:underline">legal@puera.in</a>.</p>
      </Section>
    </div>
  )
}

// ===== Privacy Policy =====
export async function PrivacyPage() {
  const page = await getLegalPage('privacy')

  return (
    <LegalLayout title={page?.title ?? 'Privacy Policy'} version={page?.version} updatedAt={page?.published_at}>
      {page?.body ? (
        <div className="prose prose-sm max-w-none text-body" dangerouslySetInnerHTML={{ __html: page.body }} />
      ) : (
        <FallbackPrivacy />
      )}
    </LegalLayout>
  )
}

function FallbackPrivacy() {
  return (
    <div className="space-y-6 text-body text-sm">
      <Section title="1. Who we are">
        <p>PU Era (puera.in) is operated from Karnataka, India. Contact: <a href="mailto:legal@puera.in" className="text-primary hover:underline">legal@puera.in</a>.</p>
      </Section>
      <Section title="2. Data we collect">
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Name and email address (registration)</li>
          <li>Class level, stream, and preferred medium (personalisation)</li>
          <li>Age band (to determine if guardian consent is required)</li>
          <li>Download and progress history (to power your dashboard)</li>
          <li>Contact messages and feedback you submit voluntarily</li>
        </ul>
      </Section>
      <Section title="3. What we do NOT collect">
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Tracking or analytics cookies</li>
          <li>Advertising data or device fingerprinting</li>
          <li>Location beyond country (India) implied by language</li>
          <li>Any data we don't need for the study platform</li>
        </ul>
      </Section>
      <Section title="4. Minors (under 18)">
        <p>If you indicate you are under 18, we require a parent or guardian email and send a consent verification. We apply additional restrictions to accounts of users under 18. Under the DPDP Act 2023, we obtain verifiable parental consent before processing data of minors.</p>
      </Section>
      <Section title="5. Data processor">
        <p>Your data is stored on Supabase (ap-south-1, Mumbai). Supabase is ISO 27001 certified and SOC 2 Type II compliant. We do not sell or share your data with third parties for advertising.</p>
      </Section>
      <Section title="6. Your rights">
        <p>You may access, correct, or delete your account data at any time from your account settings. To request full data deletion, email <a href="mailto:legal@puera.in" className="text-primary hover:underline">legal@puera.in</a>. We will respond within 30 days.</p>
      </Section>
      <Section title="7. Cookies">
        <p>We use a single session cookie (set by Supabase Auth) to keep you logged in. No tracking cookies. No third-party cookies.</p>
      </Section>
      <Section title="8. Changes">
        <p>We will notify registered users by email of any material changes to this Policy at least 14 days before they take effect.</p>
      </Section>
    </div>
  )
}

// ===== Copyright Notice =====
export async function CopyrightPage() {
  return (
    <LegalLayout title="Copyright Notice">
      <div className="space-y-6 text-sm text-body">
        <Section title="Original content">
          <p>All original study materials on PU Era (notes, lab guides, worked examples, summaries) are © PU Era and licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). You may use, adapt, and redistribute this content for non-commercial purposes provided you credit PU Era with a link to puera.in.</p>
        </Section>
        <Section title="NCERT content">
          <p>NCERT makes its e-content freely available at <a href="https://ncert.nic.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ncert.nic.in</a> for educational purposes. PU Era links directly to NCERT's official site and does not host or reproduce NCERT files. Copyright in NCERT materials remains with NCERT.</p>
        </Section>
        <Section title="KTBS content">
          <p>KTBS textbooks are available at <a href="https://ktbs.kar.nic.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ktbs.kar.nic.in</a>. PU Era links directly to KTBS's official portal and does not host KTBS files. Copyright remains with the Karnataka Textbook Society.</p>
        </Section>
        <Section title="DMCA / Takedowns">
          <p>If you believe any content on PU Era infringes your copyright, please email <a href="mailto:legal@puera.in" className="text-primary hover:underline">legal@puera.in</a> with: your name, a description of the copyrighted work, a link to the infringing content, and a statement that you believe the use is unauthorised. We will investigate and respond within 48 hours.</p>
        </Section>
      </div>
    </LegalLayout>
  )
}

// ===== Shared components =====
function LegalLayout({ title, version, updatedAt, children }: {
  title: string; version?: string; updatedAt?: string; children: React.ReactNode
}) {
  return (
    <main className="page-container py-12">
      <div className="max-w-3xl mx-auto">
        <nav className="flex items-center gap-1 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <Link href="/legal/terms" className="hover:text-primary transition-colors">Legal</Link>
          <span>›</span>
          <span className="text-heading">{title}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading mb-2" style={{ fontFamily: 'var(--font-body)', letterSpacing: '-0.01em' }}>{title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            {version && <span>Version {version}</span>}
            {updatedAt && (
              <span>Last updated: {new Date(updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            )}
          </div>
        </div>

        <div className="calling-card p-6">
          {children}
        </div>

        <div className="flex flex-wrap gap-3 mt-6 text-sm">
          <LegalNavLink href="/legal/terms" title={title}>Terms</LegalNavLink>
          <span className="text-muted">·</span>
          <LegalNavLink href="/legal/privacy" title={title}>Privacy</LegalNavLink>
          <span className="text-muted">·</span>
          <LegalNavLink href="/legal/copyright" title={title}>Copyright</LegalNavLink>
          <span className="text-muted">·</span>
          <Link href="/contact" className="text-muted hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </main>
  )
}

function LegalNavLink({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  const pageTitle = title.toLowerCase()
  const linkText = (children as string).toLowerCase()
  const isActive = pageTitle.includes(linkText) || (linkText === 'terms' && pageTitle.includes('terms')) ||
    (linkText === 'privacy' && pageTitle.includes('privacy')) ||
    (linkText === 'copyright' && pageTitle.includes('copyright')) ||
    (linkText === 'grievance' && pageTitle.includes('grievance'))
  return (
    <Link
      href={href}
      className={isActive ? 'text-primary font-semibold border-b border-primary pb-0.5' : 'text-muted hover:text-primary transition-colors'}
    >
      {children}
    </Link>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold text-heading mb-2">{title}</h2>
      {children}
    </div>
  )
}
