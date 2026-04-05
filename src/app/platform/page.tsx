// src/app/platform/page.tsx
'use client'

import { TOOLS } from '@/lib/tools'
import Link from 'next/link'

const CATEGORIES = [
  { key: 'team',    label: 'Team Ceremonies',    desc: 'Retro, health check, meetings' },
  { key: 'pi',      label: 'PI / ART',           desc: 'SAFe planning tools' },
  { key: 'inspect', label: 'Learn & Certify',    desc: 'Exam simulators' },
]

export default function PlatformDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-ink-900 mb-1">
          Good to have you here 👋
        </h1>
        <p className="text-ink-500 text-sm">
          Set up your Team and ART once — all tools below will share that context automatically.
        </p>
      </div>

      {/* Context setup banner */}
      <div className="mb-10 p-5 rounded-2xl bg-brand-50 border border-brand-200 flex
                      items-center justify-between gap-4">
        <div>
          <div className="font-medium text-brand-800 text-sm mb-1">
            Start here: set up your Team & ART
          </div>
          <div className="text-brand-600 text-xs">
            Tools use this context to pre-fill team members, sprint data, and more.
          </div>
        </div>
        <Link
          href="/platform/settings"
          className="px-4 py-2 bg-brand-500 text-white text-sm rounded-full
                     hover:bg-brand-600 transition-colors whitespace-nowrap shrink-0"
        >
          Configure →
        </Link>
      </div>

      {/* Tool categories */}
      {CATEGORIES.map(cat => {
        const catTools = TOOLS.filter(t => t.category === cat.key)
        return (
          <div key={cat.key} className="mb-10">
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="font-medium text-ink-800">{cat.label}</h2>
              <span className="text-xs text-ink-400">{cat.desc}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {catTools.map(tool => (
                <Link
                  key={tool.id}
                  href={`/platform/${tool.id}`}
                  className="group p-5 bg-white rounded-2xl border border-ink-100
                             hover:border-brand-300 hover:shadow-sm transition-all"
                >
                  <div className="text-2xl mb-3">{tool.icon}</div>
                  <div className="font-medium text-ink-900 text-sm mb-1">
                    {tool.name}
                  </div>
                  <div className="text-ink-400 text-xs leading-relaxed line-clamp-2">
                    {tool.description}
                  </div>
                  <div className="mt-3 text-xs text-brand-500 opacity-0
                                  group-hover:opacity-100 transition-opacity font-medium">
                    Open →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
