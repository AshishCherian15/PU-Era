export const instant = false

import { Shield } from 'lucide-react'

const ROLES = [
  { name: 'super_admin', label: 'Super Admin', description: 'Full access to all features and settings', color: 'text-red-400 bg-red-900/20 border-red-800' },
  { name: 'content_admin', label: 'Content Admin', description: 'Can manage resources, subjects, and announcements', color: 'text-amber-400 bg-amber-900/20 border-amber-800' },
  { name: 'moderator', label: 'Moderator', description: 'Can manage users, feedback, and requests', color: 'text-blue-400 bg-blue-900/20 border-blue-800' },
]

export default function AdminRolesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
        <p className="text-slate-400 text-sm mt-1">Overview of admin roles and their capabilities</p>
      </div>

      <div className="grid gap-4">
        {ROLES.map(role => (
          <div key={role.name} className="bg-slate-900 rounded-xl border border-slate-800 p-5 flex items-start gap-4">
            <div className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${role.color}`}>
              {role.label}
            </div>
            <div>
              <p className="text-sm text-slate-300">{role.description}</p>
              <p className="text-xs text-slate-600 mt-1 font-mono">{role.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-slate-900 rounded-xl border border-slate-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-semibold text-white">Role Assignment</h2>
        </div>
        <p className="text-sm text-slate-400">
          Admin roles are assigned via Supabase. To assign or change a role, update the <code className="text-emerald-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">admin_users</code> table in your Supabase dashboard.
        </p>
      </div>
    </div>
  )
}
