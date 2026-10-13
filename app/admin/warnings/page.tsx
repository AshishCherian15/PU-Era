export const instant = false

import { AlertTriangle } from 'lucide-react'

export default function AdminWarningsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">User Warnings</h1>
        <p className="text-slate-400 text-sm mt-1">Review and manage warnings issued to users</p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">No warnings issued yet.</p>
        <p className="text-slate-500 text-sm mt-1">Warnings issued to users from the Users section will appear here.</p>
      </div>
    </div>
  )
}
