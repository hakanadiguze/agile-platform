// src/app/platform/[toolId]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { TOOL_BY_ID } from '@/lib/tools'
import { usePlatform } from '@/lib/platform-context'
import { useEffect, useState } from 'react'

export default function ToolPage() {
  const params  = useParams()
  const toolId  = params.toolId as string
  const tool    = TOOL_BY_ID[toolId]
  const ctx     = usePlatform()
  const [url, setUrl] = useState('')

  // Rebuild URL whenever context changes (team, sprint, PI, ART, year)
  useEffect(() => {
    if (tool?.liveUrl) {
      setUrl(ctx.buildToolURL(tool.liveUrl, tool.contextParams))
    }
  }, [tool, ctx.teamId, ctx.artId, ctx.sprintId, ctx.piId, ctx.year])

  if (!tool) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">🔧</div>
          <h2 className="font-medium text-ink-800 mb-2">Tool not found</h2>
          <p className="text-ink-400 text-sm">This tool doesn't exist or isn't configured yet.</p>
        </div>
      </div>
    )
  }

  if (!tool.liveUrl) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">{tool.icon}</div>
          <h2 className="font-medium text-ink-800 mb-2">{tool.name}</h2>
          <p className="text-ink-400 text-sm mb-4">
            This tool needs to be deployed to GitHub Pages first.
          </p>
          <a
            href={`https://github.com/hakanadiguzel/${tool.githubRepo}`}
            target="_blank"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    )
  }

  // Build context badge text for topbar
  const ctxParts: string[] = []
  if (tool.contextParams.includes('teamId')   && ctx.teamName)   ctxParts.push(ctx.teamName)
  if (tool.contextParams.includes('artId')    && ctx.artName)    ctxParts.push(ctx.artName)
  if (tool.contextParams.includes('piId')     && ctx.piName)     ctxParts.push(ctx.piName)
  if (tool.contextParams.includes('sprintId') && ctx.sprintName) ctxParts.push(ctx.sprintName)

  return (
    <div className="flex flex-col h-screen">

      {/* Tool topbar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-white
                      border-b border-ink-100 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">{tool.icon}</span>
          <div>
            <h1 className="font-medium text-ink-900 text-sm leading-tight">{tool.name}</h1>
            {ctxParts.length > 0 ? (
              <p className="text-[11px] text-brand-600 font-medium">
                {ctxParts.join(' · ')}
              </p>
            ) : (
              <p className="text-[11px] text-ink-400">{tool.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {ctxParts.length === 0 && tool.contextParams.length > 0 && (
            <a
              href="/platform/settings"
              className="text-[11px] text-amber-600 hover:text-amber-700 font-medium"
            >
              ⚙ Set context →
            </a>
          )}
          <a
            href={tool.liveUrl}
            target="_blank"
            className="text-xs text-ink-400 hover:text-brand-600 transition-colors"
          >
            Open standalone ↗
          </a>
          <a
            href={`https://github.com/hakanadiguzel/${tool.githubRepo}`}
            target="_blank"
            className="text-xs text-ink-400 hover:text-brand-600 transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* iframe */}
      {url && (
        <iframe
          src={url}
          className="flex-1 w-full border-0"
          title={tool.name}
          allow="clipboard-read; clipboard-write"
        />
      )}
    </div>
  )
}
