// src/app/platform/layout.tsx
'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { TOOLS } from '@/lib/tools'
import { PlatformProvider, usePlatform } from '@/lib/platform-context'
import clsx from 'clsx'

// ─── Root layout — wraps everything in the platform provider ──────────────────

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformProvider>
      <PlatformShell>{children}</PlatformShell>
    </PlatformProvider>
  )
}

// ─── Shell (needs PlatformProvider above) ────────────────────────────────────

function PlatformShell({ children }: { children: React.ReactNode }) {
  const [user, setUser]         = useState<User | null>(null)
  const [loading, setLoading]   = useState(true)
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

  if (!user) return <AuthScreen />

  const toolsByCategory = {
    team:    TOOLS.filter(t => t.category === 'team'),
    pi:      TOOLS.filter(t => t.category === 'pi'),
    inspect: TOOLS.filter(t => t.category === 'inspect'),
  }

  return (
    <div className="flex min-h-screen bg-ink-50">

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className={clsx(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-ink-900 text-white transition-all duration-200',
        sidebarOpen ? 'w-64' : 'w-16'
      )}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-ink-700 shrink-0">
          {sidebarOpen && (
            <Link href="/" className="font-display text-lg font-bold text-white leading-none">
              Hakan<span className="text-brand-400">.</span>
              <span className="text-[11px] text-ink-400 font-body font-normal ml-1 align-middle">
                platform
              </span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-ink-700 transition-colors text-ink-400 shrink-0"
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Context strip */}
        <ContextStrip open={sidebarOpen} />

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          <NavGroup label="Team Tools" open={sidebarOpen}>
            {toolsByCategory.team.map(t => (
              <NavItem key={t.id} tool={t} open={sidebarOpen}
                       active={pathname === `/platform/${t.id}`} />
            ))}
          </NavGroup>
          <NavGroup label="PI / ART" open={sidebarOpen}>
            {toolsByCategory.pi.map(t => (
              <NavItem key={t.id} tool={t} open={sidebarOpen}
                       active={pathname === `/platform/${t.id}`} />
            ))}
          </NavGroup>
          <NavGroup label="Learn" open={sidebarOpen}>
            {toolsByCategory.inspect.map(t => (
              <NavItem key={t.id} tool={t} open={sidebarOpen}
                       active={pathname === `/platform/${t.id}`} />
            ))}
          </NavGroup>
        </nav>

        {/* User */}
        <div className="border-t border-ink-700 p-3 shrink-0">
          <div className={clsx('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center
                            justify-center text-xs font-bold shrink-0">
              {user.displayName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
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

      {/* ── MAIN ──────────────────────────────────────────────────────────── */}
      <main className={clsx(
        'flex-1 transition-all duration-200 min-h-screen',
        sidebarOpen ? 'ml-64' : 'ml-16'
      )}>
        {children}
      </main>
    </div>
  )
}

// ─── Context strip (shows active Team / ART / Sprint / PI) ───────────────────

function ContextStrip({ open }: { open: boolean }) {
  const ctx = usePlatform()

  if (!open) {
    // Collapsed: just show a small dot indicator if any context set
    const hasCtx = !!(ctx.teamId || ctx.artId)
    return (
      <div className="border-b border-ink-700 flex justify-center py-3">
        <Link href="/platform/settings"
              className="w-8 h-8 rounded-lg bg-ink-800 hover:bg-ink-700 transition-colors
                         flex items-center justify-center text-sm"
              title="Settings">
          ⚙️
        </Link>
      </div>
    )
  }

  return (
    <Link
      href="/platform/settings"
      className="border-b border-ink-700 px-4 py-3 block
                 hover:bg-ink-800 transition-colors group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-ink-500 font-semibold">
          Active Context
        </span>
        <span className="text-[10px] text-ink-500 group-hover:text-brand-400 transition-colors">
          Edit ›
        </span>
      </div>

      <div className="space-y-1.5">
        <CtxRow icon="👥" label="Team"   value={ctx.teamName}   />
        <CtxRow icon="🚂" label="ART"    value={ctx.artName}    />
        <CtxRow icon="🎯" label="PI"     value={ctx.piName}     />
        <CtxRow icon="🏃" label="Sprint" value={ctx.sprintName} />
        <CtxRow icon="📅" label="Year"   value={ctx.year}       />
      </div>
    </Link>
  )
}

function CtxRow({ icon, label, value }: { icon: string; label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] shrink-0">{icon}</span>
      <span className="text-[10px] text-ink-500 w-10 shrink-0">{label}</span>
      <span className={clsx(
        'text-[11px] truncate',
        value ? 'text-white font-medium' : 'text-ink-600 italic'
      )}>
        {value ?? 'Not set'}
      </span>
    </div>
  )
}

// ─── Nav helpers ──────────────────────────────────────────────────────────────

function NavGroup({ label, open, children }: {
  label: string; open: boolean; children: React.ReactNode
}) {
  return (
    <div>
      {open && (
        <div className="text-[10px] font-semibold uppercase tracking-wider
                        text-ink-500 px-2 mb-1.5">
          {label}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function NavItem({ tool, open, active }: {
  tool: (typeof TOOLS)[0]; open: boolean; active: boolean
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

// ─── Auth screen ──────────────────────────────────────────────────────────────

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
          <p className="text-ink-500 text-sm mt-2">
            Sign in to access your Agile tools
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
