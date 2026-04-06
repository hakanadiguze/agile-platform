// src/app/platform/settings/page.tsx
'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection, query, where, getDocs, addDoc, Timestamp
} from 'firebase/firestore'
import { usePlatform } from '@/lib/platform-context'
import { getUserSprints, getUserPIs } from '@/lib/data'
import type { Sprint, PI } from '@/lib/data'

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (ts: Timestamp) =>
  ts?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) ?? '—'

const currentYear = new Date().getFullYear()
const YEARS = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-semibold text-ink-800 text-sm mb-4 flex items-center gap-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

function ActiveBadge() {
  return (
    <span className="text-[10px] font-bold uppercase tracking-wide
                     bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
      Active
    </span>
  )
}

function SetBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs text-brand-600 hover:text-brand-700 font-medium"
    >
      Set active
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const ctx = usePlatform()

  const [uid, setUid] = useState('')
  const [toast, setToast] = useState('')

  // Teams
  const [teams, setTeams]   = useState<any[]>([])
  const [teamName, setTeamName] = useState('')

  // ARTs
  const [arts, setArts]   = useState<any[]>([])
  const [artName, setArtName] = useState('')

  // Sprints
  const [sprints, setSprints]     = useState<Sprint[]>([])
  const [sprintNum, setSprintNum] = useState('')
  const [sprintGoal, setSprintGoal] = useState('')
  const [sprintStart, setSprintStart] = useState('')
  const [sprintEnd, setSprintEnd]     = useState('')

  // PIs
  const [pis, setPis]         = useState<PI[]>([])
  const [piNum, setPiNum]     = useState('')
  const [piName2, setPiName2] = useState('')
  const [piStart, setPiStart] = useState('')
  const [piEnd, setPiEnd]     = useState('')

  // Year
  const [yearSel, setYearSel] = useState(ctx.year)

  const [saving, setSaving] = useState(false)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // ── Load data on auth ──────────────────────────────────────────────────────

  useEffect(() => {
    return onAuthStateChanged(auth, async u => {
      if (!u) return
      setUid(u.uid)

      const [tSnap, aSnap] = await Promise.all([
        getDocs(query(collection(db, 'teams'), where('ownerId', '==', u.uid))),
        getDocs(query(collection(db, 'arts'),  where('ownerId', '==', u.uid))),
      ])
      setTeams(tSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setArts(aSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  // ── Reload sprints when active team changes ───────────────────────────────

  useEffect(() => {
    if (!uid || !ctx.teamId) { setSprints([]); return }
    getUserSprints(uid, ctx.teamId).then(setSprints)
  }, [uid, ctx.teamId])

  // ── Reload PIs when active ART changes ───────────────────────────────────

  useEffect(() => {
    if (!uid || !ctx.artId) { setPis([]); return }
    getUserPIs(uid, ctx.artId).then(setPis)
  }, [uid, ctx.artId])

  // ── CRUD handlers ─────────────────────────────────────────────────────────

  async function handleCreateTeam() {
    if (!teamName.trim() || !uid) return
    setSaving(true)
    const ref = await addDoc(collection(db, 'teams'), {
      name: teamName.trim(), ownerId: uid, members: [], createdAt: Timestamp.now()
    })
    const created = { id: ref.id, name: teamName.trim() }
    setTeams(t => [...t, created])
    ctx.setTeam(ref.id, teamName.trim())
    setTeamName('')
    setSaving(false)
    showToast('✓ Team created and set as active')
  }

  async function handleCreateART() {
    if (!artName.trim() || !uid) return
    setSaving(true)
    const ref = await addDoc(collection(db, 'arts'), {
      name: artName.trim(), ownerId: uid, teams: [], piLength: 10, createdAt: Timestamp.now()
    })
    const created = { id: ref.id, name: artName.trim() }
    setArts(a => [...a, created])
    ctx.setART(ref.id, artName.trim())
    setArtName('')
    setSaving(false)
    showToast('✓ ART created and set as active')
  }

  async function handleCreateSprint() {
    if (!sprintNum.trim() || !sprintStart || !sprintEnd || !ctx.teamId || !uid) return
    setSaving(true)
    const num  = parseInt(sprintNum, 10)
    const name = `Sprint ${num}`
    const data: Omit<Sprint, 'id'> = {
      teamId:    ctx.teamId,
      ownerId:   uid,
      number:    num,
      name,
      goal:      sprintGoal.trim(),
      startDate: Timestamp.fromDate(new Date(sprintStart)),
      endDate:   Timestamp.fromDate(new Date(sprintEnd)),
      year:      new Date(sprintStart).getFullYear(),
    }
    if (ctx.artId) data.artId = ctx.artId
    const id = await addDoc(collection(db, 'sprints'), data).then(r => r.id)
    const created: Sprint = { id, ...data }
    setSprints(s => [created, ...s])
    ctx.setSprint(id, name)
    setSprintNum(''); setSprintGoal(''); setSprintStart(''); setSprintEnd('')
    setSaving(false)
    showToast('✓ Sprint created and set as active')
  }

  async function handleCreatePI() {
    if (!piNum.trim() || !piStart || !piEnd || !ctx.artId || !uid) return
    setSaving(true)
    const num  = parseInt(piNum, 10)
    const name = piName2.trim() || `PI ${new Date(piStart).getFullYear()}.${num}`
    const data: Omit<PI, 'id'> = {
      artId:     ctx.artId,
      ownerId:   uid,
      number:    num,
      name,
      startDate: Timestamp.fromDate(new Date(piStart)),
      endDate:   Timestamp.fromDate(new Date(piEnd)),
      year:      new Date(piStart).getFullYear(),
    }
    const id = await addDoc(collection(db, 'pis'), data).then(r => r.id)
    const created: PI = { id, ...data }
    setPis(p => [created, ...p])
    ctx.setPI(id, name)
    setPiNum(''); setPiName2(''); setPiStart(''); setPiEnd('')
    setSaving(false)
    showToast('✓ PI created and set as active')
  }

  function handleYearChange(y: string) {
    setYearSel(y)
    ctx.setYear(y)
    showToast(`✓ Year set to ${y}`)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-2xl">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-ink-900 mb-1">Context Settings</h1>
        <p className="text-ink-500 text-sm">
          Configure your Team, ART, Sprint, PI and Year. This context is shared across all tools automatically.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                        px-5 py-3 bg-ink-900 text-white text-sm rounded-full shadow-lg
                        animate-fade-up">
          {toast}
        </div>
      )}

      {/* ── Year ── */}
      <Section title="📅 Year">
        <div className="flex gap-2 flex-wrap">
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => handleYearChange(String(y))}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                String(y) === yearSel
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-ink-700 border-ink-200 hover:border-brand-300'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Teams ── */}
      <Section title="👥 Teams">
        {teams.length > 0 && (
          <div className="space-y-2 mb-4">
            {teams.map(t => (
              <div key={t.id}
                   className="flex items-center justify-between p-3 bg-white
                              rounded-xl border border-ink-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-800 font-medium">{t.name}</span>
                  {ctx.teamId === t.id && <ActiveBadge />}
                </div>
                {ctx.teamId !== t.id && (
                  <SetBtn onClick={() => { ctx.setTeam(t.id, t.name); showToast(`✓ Active team: ${t.name}`) }} />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateTeam()}
            placeholder="New team name (e.g. Team Phoenix)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
          <button onClick={handleCreateTeam} disabled={saving || !teamName.trim()}
            className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium
                       hover:bg-brand-600 transition-colors disabled:opacity-40">
            Create
          </button>
        </div>
      </Section>

      {/* ── ARTs ── */}
      <Section title="🚂 Agile Release Trains (ART)">
        {arts.length > 0 && (
          <div className="space-y-2 mb-4">
            {arts.map(a => (
              <div key={a.id}
                   className="flex items-center justify-between p-3 bg-white
                              rounded-xl border border-ink-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-800 font-medium">{a.name}</span>
                  {ctx.artId === a.id && <ActiveBadge />}
                </div>
                {ctx.artId !== a.id && (
                  <SetBtn onClick={() => { ctx.setART(a.id, a.name); showToast(`✓ Active ART: ${a.name}`) }} />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={artName}
            onChange={e => setArtName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateART()}
            placeholder="ART name (e.g. Automotive ART)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
          <button onClick={handleCreateART} disabled={saving || !artName.trim()}
            className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium
                       hover:bg-brand-600 transition-colors disabled:opacity-40">
            Create
          </button>
        </div>
      </Section>

      {/* ── Sprints ── */}
      <Section title="🏃 Sprints">
        {!ctx.teamId ? (
          <p className="text-xs text-ink-400 mb-3">Select an active team above to manage sprints.</p>
        ) : (
          <>
            {sprints.length > 0 && (
              <div className="space-y-2 mb-4">
                {sprints.map(s => (
                  <div key={s.id}
                       className="flex items-center justify-between p-3 bg-white
                                  rounded-xl border border-ink-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-ink-800 font-medium">{s.name}</span>
                      {ctx.sprintId === s.id && <ActiveBadge />}
                      <span className="text-xs text-ink-400">
                        {fmtDate(s.startDate)} – {fmtDate(s.endDate)}
                      </span>
                      {s.goal && (
                        <span className="text-xs text-ink-400 truncate max-w-[200px]">
                          · {s.goal}
                        </span>
                      )}
                    </div>
                    {ctx.sprintId !== s.id && (
                      <SetBtn onClick={() => { ctx.setSprint(s.id, s.name); showToast(`✓ Active: ${s.name}`) }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Create sprint form */}
            <div className="bg-ink-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-medium text-ink-600">Create Sprint for {ctx.teamName}</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-ink-500 mb-1 uppercase tracking-wide">
                    Sprint #
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={sprintNum}
                    onChange={e => setSprintNum(e.target.value)}
                    placeholder="12"
                    className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-ink-500 mb-1 uppercase tracking-wide">
                    Start
                  </label>
                  <input
                    type="date"
                    value={sprintStart}
                    onChange={e => setSprintStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-ink-500 mb-1 uppercase tracking-wide">
                    End
                  </label>
                  <input
                    type="date"
                    value={sprintEnd}
                    onChange={e => setSprintEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-ink-500 mb-1 uppercase tracking-wide">
                  Sprint Goal (optional)
                </label>
                <input
                  type="text"
                  value={sprintGoal}
                  onChange={e => setSprintGoal(e.target.value)}
                  placeholder="e.g. Complete login flow and onboarding"
                  className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleCreateSprint}
                disabled={saving || !sprintNum.trim() || !sprintStart || !sprintEnd}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium
                           hover:bg-brand-600 transition-colors disabled:opacity-40">
                Create Sprint
              </button>
            </div>
          </>
        )}
      </Section>

      {/* ── PIs ── */}
      <Section title="🎯 Program Increments (PI)">
        {!ctx.artId ? (
          <p className="text-xs text-ink-400 mb-3">Select an active ART above to manage PIs.</p>
        ) : (
          <>
            {pis.length > 0 && (
              <div className="space-y-2 mb-4">
                {pis.map(p => (
                  <div key={p.id}
                       className="flex items-center justify-between px-3 py-2.5 bg-white
                                  rounded-xl border border-ink-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-ink-800 font-medium">{p.name}</span>
                      {ctx.piId === p.id && <ActiveBadge />}
                      <span className="text-xs text-ink-400">
                        {fmtDate(p.startDate)} – {fmtDate(p.endDate)}
                      </span>
                    </div>
                    {ctx.piId !== p.id && (
                      <SetBtn onClick={() => { ctx.setPI(p.id, p.name); showToast(`✓ Active PI: ${p.name}`) }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Create PI form */}
            <div className="bg-ink-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-medium text-ink-600">Create PI for {ctx.artName}</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-ink-500 mb-1 uppercase tracking-wide">
                    PI #
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={piNum}
                    onChange={e => setPiNum(e.target.value)}
                    placeholder="1"
                    className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-ink-500 mb-1 uppercase tracking-wide">
                    Start
                  </label>
                  <input
                    type="date"
                    value={piStart}
                    onChange={e => setPiStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-ink-500 mb-1 uppercase tracking-wide">
                    End
                  </label>
                  <input
                    type="date"
                    value={piEnd}
                    onChange={e => setPiEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-ink-500 mb-1 uppercase tracking-wide">
                  PI Name (optional — auto: "PI 2026.1")
                </label>
                <input
                  type="text"
                  value={piName2}
                  onChange={e => setPiName2(e.target.value)}
                  placeholder={`PI ${yearSel}.${piNum || '1'}`}
                  className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleCreatePI}
                disabled={saving || !piNum.trim() || !piStart || !piEnd}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium
                           hover:bg-brand-600 transition-colors disabled:opacity-40">
                Create PI
              </button>
            </div>
          </>
        )}
      </Section>

    </div>
  )
}
