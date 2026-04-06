// src/lib/platform-context.tsx
// Platform-wide React Context — Team / ART / Sprint / PI / Year
// Stored in localStorage; syncs across sidebar + settings + tool iframe URLs
'use client'

import { createContext, useContext, useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlatformCtx {
  // ids
  teamId:     string | null
  artId:      string | null
  sprintId:   string | null
  piId:       string | null
  year:       string
  // display names (stored alongside ids for instant sidebar display)
  teamName:   string | null
  artName:    string | null
  sprintName: string | null
  piName:     string | null
  // setters
  setTeam:   (id: string, name: string) => void
  setART:    (id: string, name: string) => void
  setSprint: (id: string, name: string) => void
  setPI:     (id: string, name: string) => void
  setYear:   (year: string) => void
  clearTeam: () => void
  clearSprint: () => void
  clearPI:   () => void
  // URL builder for iframe tools
  buildToolURL: (baseUrl: string, wantParams?: string[]) => string
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function ls(key: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

function lss(key: string, val: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, val)
}

function lsdel(key: string) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

// ─── Context ──────────────────────────────────────────────────────────────────

const PCtx = createContext<PlatformCtx | null>(null)

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [teamId,     setTid] = useState<string | null>(() => ls('ap_teamId'))
  const [teamName,   setTnm] = useState<string | null>(() => ls('ap_teamName'))
  const [artId,      setAid] = useState<string | null>(() => ls('ap_artId'))
  const [artName,    setAnm] = useState<string | null>(() => ls('ap_artName'))
  const [sprintId,   setSid] = useState<string | null>(() => ls('ap_sprintId'))
  const [sprintName, setSnm] = useState<string | null>(() => ls('ap_sprintName'))
  const [piId,       setPid] = useState<string | null>(() => ls('ap_piId'))
  const [piName,     setPnm] = useState<string | null>(() => ls('ap_piName'))
  const [year,       setYr]  = useState<string>(() => ls('ap_year') ?? new Date().getFullYear().toString())

  const setTeam = useCallback((id: string, name: string) => {
    lss('ap_teamId', id); lss('ap_teamName', name)
    setTid(id); setTnm(name)
    // Changing team clears sprint (sprints are team-specific)
    lsdel('ap_sprintId'); lsdel('ap_sprintName')
    setSid(null); setSnm(null)
  }, [])

  const setART = useCallback((id: string, name: string) => {
    lss('ap_artId', id); lss('ap_artName', name)
    setAid(id); setAnm(name)
    // Changing ART clears PI
    lsdel('ap_piId'); lsdel('ap_piName')
    setPid(null); setPnm(null)
  }, [])

  const setSprint = useCallback((id: string, name: string) => {
    lss('ap_sprintId', id); lss('ap_sprintName', name)
    setSid(id); setSnm(name)
  }, [])

  const setPI = useCallback((id: string, name: string) => {
    lss('ap_piId', id); lss('ap_piName', name)
    setPid(id); setPnm(name)
  }, [])

  const setYear = useCallback((y: string) => {
    lss('ap_year', y); setYr(y)
  }, [])

  const clearTeam = useCallback(() => {
    lsdel('ap_teamId'); lsdel('ap_teamName')
    lsdel('ap_sprintId'); lsdel('ap_sprintName')
    setTid(null); setTnm(null); setSid(null); setSnm(null)
  }, [])

  const clearSprint = useCallback(() => {
    lsdel('ap_sprintId'); lsdel('ap_sprintName')
    setSid(null); setSnm(null)
  }, [])

  const clearPI = useCallback(() => {
    lsdel('ap_piId'); lsdel('ap_piName')
    setPid(null); setPnm(null)
  }, [])

  const buildToolURL = useCallback((baseUrl: string, wantParams?: string[]) => {
    if (!baseUrl) return baseUrl
    const p = new URLSearchParams()
    const want = (k: string) => !wantParams || wantParams.includes(k)
    if (want('teamId'))   { const v = ls('ap_teamId');   if (v) p.set('teamId', v) }
    if (want('artId'))    { const v = ls('ap_artId');    if (v) p.set('artId', v) }
    if (want('sprintId')) { const v = ls('ap_sprintId'); if (v) p.set('sprintId', v) }
    if (want('piId'))     { const v = ls('ap_piId');     if (v) p.set('piId', v) }
    const yr = ls('ap_year')
    if (yr) p.set('year', yr)
    const qs = p.toString()
    return qs ? `${baseUrl}?${qs}` : baseUrl
  }, [])

  return (
    <PCtx.Provider value={{
      teamId, teamName, artId, artName,
      sprintId, sprintName, piId, piName, year,
      setTeam, setART, setSprint, setPI, setYear,
      clearTeam, clearSprint, clearPI,
      buildToolURL,
    }}>
      {children}
    </PCtx.Provider>
  )
}

export function usePlatform(): PlatformCtx {
  const ctx = useContext(PCtx)
  if (!ctx) throw new Error('usePlatform must be used inside <PlatformProvider>')
  return ctx
}
