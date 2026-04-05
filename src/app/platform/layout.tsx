// src/app/platform/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { TOOLS } from '@/lib/tools'
import clsx from 'clsx'

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent
                        rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  const toolsByCategory = {
    team:    TOOLS.filter(t => t.category === 'team'),
    pi:      TOOLS.filter(t => t.category === 'pi'),
    inspect: TOOLS.filter(t => t.category === 'inspect'),
  }

  return (
    <div className="flex min-h-screen bg-ink-50">

      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className={clsx(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-ink-900 text-white transition-all',
        sidebarOpen ? 'w-60' : 'w-16'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-ink-700">
          {sidebarOpen && (
            <Link href="/" className="font-display text-lg font-bold text-white">
              Hakan<span className="text-brand-400">.</span>
              <span className="text-xs text-ink-400 font-body font-normal ml-1">platform</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-ink-700 transition-colors text-ink-400"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Context strip (Team/ART picker) */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-ink-700">
            <Link
              href="/platform/settings"
              className="flex items-center gap-2 p-2 rounded-lg bg-ink-800
                         hover:bg-ink-700 transition-colors"
            >
              <div className="w-6 h-6 rounded bg-brand-500 flex items-center
                              justify-center text-xs font-bold shrink-0">
                T
              </div>
              <div className="min-w-0">
                <div className="text-xs text-ink-400">Active team</div>
                <div className="text-xs text-white truncate">Set up team →</div>
              </div>
            </Link>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          <NavGroup label="Team" open={sidebarOpen}>
            {toolsByCategory.team.map(t => (
              <NavItem key={t.id} tool={t} open={sidebarOpen} active={pathname === `/platform/${t.id}`} />
            ))}
          </NavGroup>
          <NavGroup label="PI / ART" open={sidebarOpen}>
            {toolsByCategory.pi.map(t => (
              <NavItem key={t.id} tool={t} open={sidebarOpen} active={pathname === `/platform/${t.id}`} />
            ))}
          </NavGroup>
          <NavGroup label="Learn" open={sidebarOpen}>
            {toolsByCategory.inspect.map(t => (
              <NavItem key={t.id} tool={t} open={sidebarOpen} active={pathname === `/platform/${t.id}`} />
            ))}
          </NavGroup>
        </nav>

        {/* User */}
        <div className="border-t border-ink-700 p-3">
          <div className={clsx('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center
                            justify-center text-xs font-bold shrink-0">
              {user.displayName?.[0] ?? user.email?.[0] ?? '?'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white truncate">
                  {user.displayName ?? user.email}
                </div>
                <button
                  onClick={() => signOut(auth)}
                  className="text-xs text-ink-400 hover:text-ink-200 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <main className={clsx(
        'flex-1 transition-all min-h-screen',
        sidebarOpen ? 'ml-60' : 'ml-16'
      )}>
        {children}
      </main>
    </div>
  )
}

function NavGroup({ label, open, children }: {
  label: string
  open: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      {open && (
        <div className="text-[10px] font-semibold uppercase tracking-wider
                        text-ink-500 px-2 mb-2">
          {label}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function NavItem({ tool, open, active }: {
  tool: (typeof TOOLS)[0]
  open: boolean
  active: boolean
}) {
  return (
    <Link
      href={`/platform/${tool.id}`}
      className={clsx(
        'flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors',
        active
          ? 'bg-brand-500 text-white'
          : 'text-ink-400 hover:bg-ink-800 hover:text-white',
        !open && 'justify-center'
      )}
      title={!open ? tool.name : undefined}
    >
      <span className="text-base shrink-0">{tool.icon}</span>
      {open && <span className="truncate">{tool.name}</span>}
    </Link>
  )
}

// ─── Auth Screen ─────────────────────────────────────────────────────────────
import AuthForm from '@/components/platform/AuthForm'

function AuthScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-bold text-ink-900">
            Hakan<span className="text-brand-500">.</span>
            <span className="text-sm text-ink-400 font-body font-normal ml-1">platform</span>
          </Link>
          <p className="text-ink-500 text-sm mt-2">Sign in to access your Agile tools</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
