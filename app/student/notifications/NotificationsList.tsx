'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Check, CheckCheck, ExternalLink, Info, AlertCircle, BookOpen } from 'lucide-react'

interface NotificationItem {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

export default function NotificationsList({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[]
}) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [loading, setLoading] = useState(false)

  const unreadCount = notifications.filter(n => !n.read_at).length

  async function markAllAsRead() {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      })
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
        )
      }
    } finally {
      setLoading(false)
    }
  }

  async function markSingleAsRead(id: string) {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
        )
      }
    } catch {
      // ignore
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="calling-card text-center py-16">
        <Bell className="w-12 h-12 text-muted mx-auto mb-3" />
        <p className="font-semibold text-heading mb-1">No notifications yet</p>
        <p className="text-muted text-sm">
          We'll notify you when your requests are fulfilled or when new study materials are published.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={markAllAsRead}
            disabled={loading}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read ({unreadCount})
          </button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map(item => {
          const isRead = !!item.read_at
          return (
            <div
              key={item.id}
              className={`calling-card p-4 transition-colors ${
                !isRead ? 'border-primary/40 bg-emerald-50/20' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  !isRead ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.type === 'announcement' ? (
                    <Info className="w-4 h-4" />
                  ) : item.type === 'alert' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <BookOpen className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-semibold truncate ${!isRead ? 'text-heading' : 'text-slate-700'}`}>
                      {item.title}
                    </h3>
                    <span className="text-xs text-muted whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {item.body && (
                    <p className="text-sm text-body mt-1 leading-relaxed">
                      {item.body}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => !isRead && markSingleAsRead(item.id)}
                        className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View resource <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}

                    {!isRead && (
                      <button
                        onClick={() => markSingleAsRead(item.id)}
                        className="text-xs text-muted hover:text-heading flex items-center gap-1 ml-auto"
                      >
                        <Check className="w-3 h-3" /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
