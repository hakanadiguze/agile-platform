// src/app/platform/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { SharedContext } from '@/lib/data'

const ROLES = ['SM', 'PO', 'DEV', 'RTE', 'SA', 'COACH', 'OTHER']

export default function SettingsPage() {
  const [uid, setUid]         = useState('')
  const [teamName, setTeamName] = useState('')
  const [artName, setArtName] = useState('')
  const [teams, setTeams]     = useState<any[]>([])
  const [arts, setArts]       = useState<any[]>([])
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, async u => {
      if (!u) return
      setUid(u.uid)
      // Load existing teams/arts
      const tSnap = await getDocs(query(collection(db, 'teams'), where('ownerId', '==', u.uid)))
      const aSnap = await getDocs(query(collection(db, 'arts'),  where('ownerId', '==', u.uid)))
      setTeams(tSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setArts(aSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  async function createTeam() {
    if (!teamName.trim()) return
    setSaving(true)
    const ref = await addDoc(collection(db, 'teams'), {
      name: teamName.trim(), ownerId: uid, members: [], createdAt: Timestamp.now()
    })
    const newTeam = { id: ref.id, name: teamName.trim() }
    setTeams(t => [...t, newTeam])
    SharedContext.setTeam(ref.id)
    setTeamName('')
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function createART() {
    if (!artName.trim()) return
    setSaving(true)
    const ref = await addDoc(collection(db, 'arts'), {
      name: artName.trim(), ownerId: uid, teams: [], piLength: 10, createdAt: Timestamp.now()
    })
    const newART = { id: ref.id, name: artName.trim() }
    setArts(a => [...a, newART])
    SharedContext.setART(ref.id)
    setArtName('')
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-ink-900 mb-2">Settings</h1>
      <p className="text-ink-500 text-sm mb-10">
        Set up your Team and ART. This context is shared across all tools.
      </p>

      {saved && (
        <div className="mb-6 px-4 py-2 bg-brand-50 text-brand-700 rounded-xl text-sm">
          ✓ Saved and applied to all tools
        </div>
      )}

      {/* Teams */}
      <section className="mb-10">
        <h2 className="font-medium text-ink-800 mb-4">Teams</h2>

        {teams.length > 0 && (
          <div className="space-y-2 mb-4">
            {teams.map(t => (
              <div key={t.id}
                className="flex items-center justify-between p-3 bg-white
                           rounded-xl border border-ink-100">
                <span className="text-sm text-ink-800">{t.name}</span>
                <button
                  onClick={() => { SharedContext.setTeam(t.id); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  Set active
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createTeam()}
            placeholder="Team name (e.g. Team Phoenix)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
          <button
            onClick={createTeam}
            disabled={saving || !teamName.trim()}
            className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium
                       hover:bg-brand-600 transition-colors disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </section>

      {/* ARTs */}
      <section>
        <h2 className="font-medium text-ink-800 mb-4">Agile Release Trains (ART)</h2>

        {arts.length > 0 && (
          <div className="space-y-2 mb-4">
            {arts.map(a => (
              <div key={a.id}
                className="flex items-center justify-between p-3 bg-white
                           rounded-xl border border-ink-100">
                <span className="text-sm text-ink-800">{a.name}</span>
                <button
                  onClick={() => { SharedContext.setART(a.id); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  Set active
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={artName}
            onChange={e => setArtName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createART()}
            placeholder="ART name (e.g. Automotive ART)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
          <button
            onClick={createART}
            disabled={saving || !artName.trim()}
            className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium
                       hover:bg-brand-600 transition-colors disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </section>
    </div>
  )
}
