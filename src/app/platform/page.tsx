// src/app/platform/page.tsx
'use client'

export const dynamic = 'force-dynamic'

import { TOOLS } from '@/lib/tools'
import { usePlatform } from '@/lib/platform-context'
import Link from 'next/link'

const CATEGORIES = [
  { key: 'team',    label: 'Team Ceremonies', desc: 'Retro, health, estimation, feedback' },
  { key: 'pi',      label: 'PI / ART',        desc: 'SAFe planning tools' },
  { key: 'inspect', label: 'Learn & Certify', desc: 'Exam simulators' },
]

export default function PlatformDashboard() {
  const ctx = usePlatform()

  // Build context summary items for the banner
  const ctxItems = [
    ctx.teamName   && { icon: '👥', label: 'Team',   value: ctx.teamName   },
    ctx.artName    && { icon: '🚂', label: 'ART',    value: ctx.artName    },
    ctx.piName     && { icon: '🎯', label: 'PI',     value: ctx.piName     },
    ctx.sprintName && { icon: '🏃', label: 'Sprint', value: ctx.sprintName },
    ctx.year       && { icon: '📅', label: 'Year',   value: ctx.year       },
  ].filter(Boolean) as { icon: string; label: string; value: string }[]

  const noCtx = !ctx.teamId && !ctx.artId

  return (
    <div className="p-8">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink-900 mb-1">
          Good to have you here 👋
        </h1>
        <p className="text-ink-500 text-sm">
          Set up your context once — all tools share Team, ART, Sprint, PI and Year automatically.
        </p>
      </div>

      {/* Context banner */}
      {noCtx ? (
        /* No context set → prompt to configure */
        <div className="mb-8 p-5 rounded-2xl bg-brand-50 border border-brand-200
                        flex items-center justify-between gap-4">
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
      ) : (
        /* Context set → show summary */
        <div className="mb-8 p-5 rounded-2xl bg-white border border-ink-100
                        flex flex-wrap items-center gap-x-6 gap-y-3">
          {ctxItems.map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs text-ink-400">{item.label}:</span>
              <span className="text-xs font-semibold text-ink-800">{item.value}</span>
            </div>
          ))}
          <Link
            href="/platform/settings"
            className="ml-auto text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            Edit context →
          </Link>
        </div>
      )}

      {/* Tool grid by category */}
      {CATEGORIES.map(cat => {
        const catTools = TOOLS.filter(t => t.category === cat.key)
        return (
          <div key={cat.key} className="mb-10">
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="font-medium text-ink-800">{cat.label}</h2>
              <span className="text-xs text-ink-400">{cat.desc}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {catTools.map(tool => {
                // Highlight tools with matching context
                const hasCtx = tool.contextParams.some(p =>
                  (p === 'teamId'   && ctx.teamId)   ||
                  (p === 'artId'    && ctx.artId)     ||
                  (p === 'sprintId' && ctx.sprintId)  ||
                  (p === 'piId'     && ctx.piId)
                ) || tool.contextParams.length === 0

                return (
                  <Link
                    key={tool.id}
                    href={`/platform/${tool.id}`}
                    className={`group p-5 bg-white rounded-2xl border transition-all
                                hover:border-brand-300 hover:shadow-sm
                                ${hasCtx ? 'border-ink-100' : 'border-ink-100 opacity-75'}`}
                  >
                    <div className="text-2xl mb-3">{tool.icon}</div>
                    <div className="font-medium text-ink-900 text-sm mb-1">{tool.name}</div>
                    <div className="text-ink-400 text-xs leading-relaxed line-clamp-2">
                      {tool.description}
                    </div>
                    <div className="mt-3 text-xs text-brand-500 opacity-0
                                    group-hover:opacity-100 transition-opacity font-medium">
                      Open →
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
