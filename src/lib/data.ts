// src/lib/data.ts
// Tüm araçların okuduğu/yazdığı ortak veri modeli

import {
  collection, doc, setDoc, addDoc,
  query, where, getDocs, onSnapshot, Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = 'SM' | 'PO' | 'DEV' | 'RTE' | 'SA' | 'COACH' | 'OTHER'

export interface TeamMember {
  uid:     string
  name:    string
  email:   string
  role:    Role
  avatar?: string
}

export interface Team {
  id:        string
  name:      string
  ownerId:   string          // Firebase UID
  artId?:    string
  members:   TeamMember[]
  createdAt: Timestamp
}

export interface ART {
  id:        string
  name:      string
  ownerId:   string
  teams:     string[]        // Team IDs
  piLength:  number          // weeks, typically 10-12
  createdAt: Timestamp
}

export interface Sprint {
  id:        string
  teamId:    string
  artId?:    string
  ownerId:   string
  number:    number
  name:      string          // e.g. "Sprint 12"
  goal:      string
  startDate: Timestamp
  endDate:   Timestamp
  year:      number
  capacity?: number
  velocity?: number
}

export interface PI {
  id:        string
  artId:     string
  ownerId:   string
  number:    number
  name:      string          // e.g. "PI 2026.1"
  startDate: Timestamp
  endDate:   Timestamp
  year:      number
  objectives?: PIObjective[]
  risks?:      PIRisk[]
}

export interface PIObjective {
  id:            string
  teamId:        string
  description:   string
  businessValue: number       // 1-10
  committed:     boolean
}

export interface PIRisk {
  id:          string
  description: string
  roam:        'Resolved' | 'Owned' | 'Accepted' | 'Mitigated'
  owner:       string
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

export async function getUserTeams(uid: string): Promise<Team[]> {
  const q = query(collection(db, 'teams'), where('ownerId', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Team))
}

export async function getUserARTs(uid: string): Promise<ART[]> {
  const q = query(collection(db, 'arts'), where('ownerId', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ART))
}

export async function getUserSprints(uid: string, teamId: string): Promise<Sprint[]> {
  const q = query(
    collection(db, 'sprints'),
    where('ownerId', '==', uid),
    where('teamId', '==', teamId)
  )
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Sprint))
    .sort((a, b) => b.number - a.number)
}

export async function getUserPIs(uid: string, artId: string): Promise<PI[]> {
  const q = query(
    collection(db, 'pis'),
    where('ownerId', '==', uid),
    where('artId', '==', artId)
  )
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as PI))
    .sort((a, b) => b.number - a.number)
}

export async function createTeam(team: Omit<Team, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'teams'))
  await setDoc(ref, { ...team, createdAt: Timestamp.now() })
  return ref.id
}

export async function createART(art: Omit<ART, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'arts'))
  await setDoc(ref, { ...art, createdAt: Timestamp.now() })
  return ref.id
}

export async function createSprint(sprint: Omit<Sprint, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'sprints'), sprint)
  return ref.id
}

export async function createPI(pi: Omit<PI, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'pis'), pi)
  return ref.id
}

export function subscribeToTeam(teamId: string, cb: (team: Team) => void) {
  return onSnapshot(doc(db, 'teams', teamId), snap => {
    if (snap.exists()) cb({ id: snap.id, ...snap.data() } as Team)
  })
}

// ─── SharedContext (legacy — prefer usePlatform() hook instead) ───────────────
// Kept for backward compatibility; new code should use platform-context.tsx

export const SharedContext = {
  getTeamId:    () => typeof window !== 'undefined' ? localStorage.getItem('ap_teamId')   || null : null,
  getARTId:     () => typeof window !== 'undefined' ? localStorage.getItem('ap_artId')    || null : null,
  getSprintId:  () => typeof window !== 'undefined' ? localStorage.getItem('ap_sprintId') || null : null,
  getPIId:      () => typeof window !== 'undefined' ? localStorage.getItem('ap_piId')     || null : null,
  getYear:      () => typeof window !== 'undefined' ? localStorage.getItem('ap_year')     || new Date().getFullYear().toString() : new Date().getFullYear().toString(),

  buildToolURL: (baseUrl: string) => {
    if (typeof window === 'undefined') return baseUrl
    const p = new URLSearchParams()
    const teamId   = localStorage.getItem('ap_teamId')
    const artId    = localStorage.getItem('ap_artId')
    const sprintId = localStorage.getItem('ap_sprintId')
    const piId     = localStorage.getItem('ap_piId')
    const year     = localStorage.getItem('ap_year')
    if (teamId)   p.set('teamId',   teamId)
    if (artId)    p.set('artId',    artId)
    if (sprintId) p.set('sprintId', sprintId)
    if (piId)     p.set('piId',     piId)
    if (year)     p.set('year',     year)
    const qs = p.toString()
    return qs ? `${baseUrl}?${qs}` : baseUrl
  }
}
