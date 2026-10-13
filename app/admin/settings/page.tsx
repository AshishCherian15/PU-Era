export const instant = false

import { Settings, Globe, Mail, Shield } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Site-wide configuration and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Site Info */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-white">Site Information</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Site Name</p>
              <p className="text-white font-medium">PU Era</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Domain</p>
              <p className="text-white font-medium">puera.in</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Target Audience</p>
              <p className="text-white font-medium">Karnataka PUC Students</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Content Scope</p>
              <p className="text-white font-medium">PUC 1 & PUC 2</p>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-white">Email & Notifications</h2>
          </div>
          <p className="text-sm text-slate-400">
            Email notifications are handled via Supabase Auth. Configure email templates in your{' '}
            <span className="text-emerald-400">Supabase dashboard → Authentication → Email Templates</span>.
          </p>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-white">Security</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Admin session cookie</span>
              <span className="text-emerald-400 text-xs">Enabled</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Supabase RLS</span>
              <span className="text-emerald-400 text-xs">Enabled</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Content DMCA takedowns</span>
              <span className="text-emerald-400 text-xs">Supported</span>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-white">Environment</h2>
          </div>
          <p className="text-sm text-slate-400">
            Environment variables are managed via <code className="text-emerald-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">.env.local</code>.
            Required variables: <code className="text-xs bg-slate-800 px-1 py-0.5 rounded text-slate-300">NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
            <code className="text-xs bg-slate-800 px-1 py-0.5 rounded text-slate-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,{' '}
            <code className="text-xs bg-slate-800 px-1 py-0.5 rounded text-slate-300">SUPABASE_SERVICE_ROLE_KEY</code>.
          </p>
        </div>
      </div>
    </div>
  )
}
