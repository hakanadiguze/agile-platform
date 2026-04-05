// src/components/platform/AuthForm.tsx
'use client'

import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

export default function AuthForm() {
  const [mode,  setMode]  = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [error, setError] = useState('')
  const [busy,  setBusy]  = useState(false)

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, pass)
      } else {
        await createUserWithEmailAndPassword(auth, email, pass)
      }
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') ?? 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setBusy(true)
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') ?? 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-ink-100 p-8 shadow-sm">
      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={busy}
        className="w-full flex items-center justify-center gap-3 px-4 py-3
                   border border-ink-200 rounded-xl text-sm font-medium text-ink-700
                   hover:bg-ink-50 transition-colors disabled:opacity-50 mb-6"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-ink-100" />
        <span className="text-xs text-ink-400">or</span>
        <div className="flex-1 h-px bg-ink-100" />
      </div>

      {/* Email form */}
      <form onSubmit={handleEmail} className="space-y-4">
        <div>
          <label className="block text-xs text-ink-600 mb-1.5 font-medium">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-400
                       focus:border-transparent transition-all"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs text-ink-600 mb-1.5 font-medium">
            Password
          </label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-400
                       focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 bg-brand-500 text-white rounded-xl text-sm font-medium
                     hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-xs text-ink-400 mt-6">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError('') }}
          className="text-brand-600 hover:text-brand-700 font-medium"
        >
          {mode === 'signin' ? 'Sign up free' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
