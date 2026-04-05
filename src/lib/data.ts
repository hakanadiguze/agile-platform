// src/lib/data.ts
// Tüm araçların okuduğu/yazdığı ortak veri modeli

import {
  collection, doc, getDoc, setDoc, updateDoc,
  query, where, getDocs, onSnapshot, Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = 'SM' | 'PO' | 'DEV' | 'RTE' | 'SA' | 'COACH' | 'OTHER'

export interface TeamMember {
  uid:   string
  name:  string
  email: string
  role:  Role
  avatar?: string
}

export interface Team {
  id:          string
  name:        string
  ownerId:     string          // Firebase UID
  artId?:      string
  members:     TeamMember[]
  createdAt:   Timestamp
}

export interface ART {
  id:          string
  name:        string
  ownerId:     string
  teams:       string[]        // Team IDs
  piLength:    number          // weeks, typically 10-12
  createdAt:   Timestamp
}

export interface Sprint {
  id:          string
  teamId:      string
  artId?:      string
  number:      number
  goal:        string
  startDate:   Timestamp
  endDate:     Timestamp
  capacity:    number          // story points
  velocity?:   number          // completed story points
}

export interface PI {
  id:          string
  artId:       string
  number:      number
  name:        string
  startDate:   Timestamp
  endDate:     Timestamp
  objectives:  PIObjective[]
  risks:       PIRisk[]
}

export interface PIObjective {
  id:          string
  teamId:      string
  description: string
  businessValue: number        // 1-10
  committed:   boolean
}

export interface PIRisk {
  id:          string
  description: string
  roam:        'Resolved' | 'Owned' | 'Accepted' | 'Mitigated'
  owner:       string
}

// ─── Shared Context (in-memory, cross-tool) ───────────────────────────────────
// Platform'daki her araç bu context'i okuyabilir (localStorage + Firestore sync)

export const SharedContext = {
  getTeamId: () => localStorage.getItem('ap_teamId') || null,
  getARTId:  () => localStorage.getItem('ap_artId')  || null,
  getSprintId: () => localStorage.getItem('ap_sprintId') || null,

  setTeam: (teamId: string) => localStorage.setItem('ap_teamId', teamId),
  setART:  (artId:  string) => localStorage.setItem('ap_artId',  artId),
  setSprint: (sprintId: string) => localStorage.setItem('ap_sprintId', sprintId),

  // iframe içindeki araçların context'i alması için URL parametresi oluşturur
  buildToolURL: (baseUrl: string) => {
    const teamId   = SharedContext.getTeamId()
    const artId    = SharedContext.getARTId()
    const sprintId = SharedContext.getSprintId()
    const params   = new URLSearchParams()
    if (teamId)   params.set('teamId',   teamId)
    if (artId)    params.set('artId',    artId)
    if (sprintId) params.set('sprintId', sprintId)
    return `${baseUrl}?${params.toString()}`
  }
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
  const ref = doc(collection(db, 'sprints'))
  await setDoc(ref, sprint)
  return ref.id
}

export function subscribeToTeam(teamId: string, cb: (team: Team) => void) {
  return onSnapshot(doc(db, 'teams', teamId), snap => {
    if (snap.exists()) cb({ id: snap.id, ...snap.data() } as Team)
  })
}
