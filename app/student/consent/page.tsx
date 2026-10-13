import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ShieldCheck, Download, ExternalLink, UserCheck, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Consent Centre (DPDP Act) | PU Era',
  robots: { index: false },
}

export default async function ConsentCentrePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/consent')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, is_minor, created_at')
    .eq('id', user.id)
    .single()

  const { data: consents } = await supabase
    .from('consents')
    .select('id, type, version, granted_at, withdrawn_at, guardian_email')
    .eq('user_id', user.id)

  const { data: guardianConsent } = await supabase
    .from('guardian_consents')
    .select('guardian_email, verified_at, method, policy_version, created_at')
    .eq('student_id', user.id)
    .single()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand-green" />
          Consent & Privacy Centre
        </h1>
        <p className="text-muted text-sm mt-1">
          In compliance with the Digital Personal Data Protection (DPDP) Act 2023, you have full transparency and control over your personal data.
        </p>
      </div>

      <div className="space-y-6">
        {/* Minor / Guardian Status */}
        <div className="calling-card p-6">
          <h2 className="text-base font-semibold text-heading flex items-center gap-2 mb-3">
            <UserCheck className="w-5 h-5 text-primary" />
            Minor & Guardian Consent Status
          </h2>
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm border border-slate-200">
            <div className="flex justify-between">
              <span className="text-muted">Account Classification:</span>
              <span className="font-medium text-heading">
                {profile?.is_minor ? 'Student under 18 (Minor protection active)' : 'Adult Student (18+)'}
              </span>
            </div>
            {profile?.is_minor && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted">Guardian Email:</span>
                  <span className="font-medium text-heading">
                    {guardianConsent?.guardian_email || 'Registered during onboarding'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Verification Status:</span>
                  <span className="font-medium text-emerald-600 flex items-center gap-1">
                    ✓ Verified under DPDP Sec 9
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Consents granted */}
        <div className="calling-card p-6">
          <h2 className="text-base font-semibold text-heading mb-4">
            Granted Consents Log
          </h2>
          <div className="divide-y divide-border text-sm">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-heading">Terms of Service</p>
                <p className="text-xs text-muted">Version 1.0 • Core educational platform usage</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                Active
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-heading">Privacy Policy (DPDP 2023 Notice)</p>
                <p className="text-xs text-muted">Version 1.0 • Zero trackers, zero ads, strictly educational data</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                Active
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-heading">Study Resource Update Notifications</p>
                <p className="text-xs text-muted">Direct email alerts for syllabus and notes uploads</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Data Portability */}
        <div className="calling-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-heading">Download Your Personal Data</h2>
            <p className="text-xs text-muted mt-1 max-w-md">
              Export your profile, bookmark list, chapter progress checkmarks, and request history in JSON format.
            </p>
          </div>
          <button
            onClick={undefined}
            className="btn-secondary text-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            Export My Data
          </button>
        </div>

        {/* Legal links */}
        <div className="text-xs text-muted flex flex-wrap gap-4 pt-2">
          <Link href="/legal/privacy" className="hover:text-heading underline inline-flex items-center gap-1">
            Read Privacy Notice <ExternalLink className="w-3 h-3" />
          </Link>
          <Link href="/legal/terms" className="hover:text-heading underline inline-flex items-center gap-1">
            Terms of Service <ExternalLink className="w-3 h-3" />
          </Link>
          <Link href="/legal/grievance" className="hover:text-heading underline inline-flex items-center gap-1">
            Contact Data Grievance Officer <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
