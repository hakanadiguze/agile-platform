// src/app/page.tsx
'use client'

import Link from 'next/link'
import { TOOLS } from '@/lib/tools'

const CERTS = [
  { code: 'RTE', label: 'SAFe 6 RTE', color: 'bg-brand-100 text-brand-800' },
  { code: 'SM',  label: 'Professional Scrum Master', color: 'bg-blue-100 text-blue-800' },
  { code: 'PO',  label: 'Product Owner', color: 'bg-purple-100 text-purple-800' },
  { code: 'SP',  label: 'SAFe Practitioner', color: 'bg-amber-100 text-amber-800' },
]

const STATS = [
  { value: '20+', label: 'Years experience' },
  { value: '7',   label: 'Certifications' },
  { value: '6',   label: 'Agile tools built' },
  { value: 'SAFe 6', label: 'Certified RTE' },
]

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                      px-6 md:px-12 py-4 bg-white/90 backdrop-blur border-b border-ink-100">
        <span className="font-display text-lg font-semibold tracking-tight text-ink-900">
          Hakan<span className="text-brand-500">.</span>
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm text-ink-600">
          <a href="#about"    className="hover:text-brand-600 transition-colors">About</a>
          <a href="#services" className="hover:text-brand-600 transition-colors">Services</a>
          <a href="#platform" className="hover:text-brand-600 transition-colors">Platform</a>
          <a href="#contact"  className="hover:text-brand-600 transition-colors">Contact</a>
        </div>
        <Link
          href="/platform"
          className="text-sm px-4 py-2 rounded-full bg-brand-500 text-white
                     hover:bg-brand-600 transition-colors font-medium"
        >
          Open Platform →
        </Link>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-brand-50 text-brand-700 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Available for consulting · Berlin
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold text-ink-900
                           leading-[1.1] mb-6">
              Hakan<br />
              <span className="text-brand-500">Adıgüzel</span>
            </h1>

            <p className="text-lg text-ink-600 leading-relaxed mb-4">
              Release Train Engineer · Scrum Master · Agile Coach
            </p>
            <p className="text-ink-500 leading-relaxed mb-8">
              20+ years driving organizational agility. Currently shaping automotive software
              at MBition GmbH in Berlin — building the Android Automotive OS with SAFe.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {CERTS.map(c => (
                <span key={c.code}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${c.color}`}>
                  {c.label}
                </span>
              ))}
            </div>

            <div className="flex gap-4 flex-wrap">
              <Link
                href="/platform"
                className="px-6 py-3 bg-brand-500 text-white rounded-full font-medium
                           hover:bg-brand-600 transition-all hover:shadow-lg hover:shadow-brand-200
                           hover:-translate-y-0.5"
              >
                Try the Agile Platform →
              </Link>
              <a
                href="#contact"
                className="px-6 py-3 border border-ink-200 text-ink-700 rounded-full font-medium
                           hover:border-brand-400 hover:text-brand-600 transition-colors"
              >
                Let's work together
              </a>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(s => (
              <div key={s.label}
                className="p-6 rounded-2xl bg-ink-50 border border-ink-100
                           hover:border-brand-200 hover:bg-brand-50 transition-colors">
                <div className="font-display text-3xl font-bold text-ink-900 mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-ink-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM SECTION ────────────────────────────────────────────── */}
      <section id="platform" className="py-20 px-6 md:px-12 bg-ink-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-brand-500/20 text-brand-300 text-xs font-medium mb-6">
              Agile Interaction Platform
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Tools built for<br />
              <span className="text-brand-400">real Agile teams</span>
            </h2>
            <p className="text-ink-400 max-w-xl mx-auto">
              7 tools that share your Team and ART context.
              Set up once, use everywhere — no copy-pasting data between apps.
            </p>
          </div>

          {/* Tool cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {TOOLS.filter(t => t.liveUrl).map((tool, i) => (
              <Link
                key={tool.id}
                href={`/platform?tool=${tool.id}`}
                className="group p-5 rounded-2xl bg-ink-800 border border-ink-700
                           hover:border-brand-500 hover:bg-ink-750 transition-all"
              >
                <div className="text-2xl mb-3">{tool.icon}</div>
                <div className="font-medium text-white text-sm mb-1">{tool.name}</div>
                <div className="text-xs text-ink-400 leading-relaxed line-clamp-2">
                  {tool.description}
                </div>
                <div className="mt-3 text-xs text-brand-400 opacity-0
                                group-hover:opacity-100 transition-opacity">
                  Open →
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 text-white
                         rounded-full font-medium hover:bg-brand-400 transition-all
                         hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5"
            >
              Open Platform — free to use
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-ink-900 mb-12">Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Agile Coaching',    desc: 'Team and organizational transformation. Scrum, Kanban, SAFe implementation.' },
              { title: 'RTE as a Service',  desc: 'Release Train Engineer for your ART. PI Planning facilitation and ART launch.' },
              { title: 'Training',          desc: 'Scrum Master, Product Owner, SAFe certification preparation workshops.' },
            ].map(s => (
              <div key={s.title}
                className="p-8 rounded-2xl border border-ink-100 hover:border-brand-200
                           hover:shadow-sm transition-all group">
                <div className="w-8 h-0.5 bg-brand-500 mb-6
                                group-hover:w-12 transition-all" />
                <h3 className="font-display text-xl font-semibold text-ink-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-ink-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 px-6 md:px-12 bg-ink-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-display text-4xl font-bold text-ink-900 mb-6">
              Agilist & Developer
            </h2>
            <p className="text-ink-600 leading-relaxed mb-4">
              I combine 20+ years of Agile practice with hands-on software development.
              Currently leading Agile transformation at MBition GmbH, where teams build
              the Android Automotive OS for Mercedes-Benz vehicles.
            </p>
            <p className="text-ink-600 leading-relaxed mb-6">
              I build the tools I wish existed — practical, no-bloat apps that teams
              can use during ceremonies without friction. Everything on this platform
              comes from real facilitation experience.
            </p>
            <a
              href="/hakan_adiguzel_cv.pdf"
              className="inline-flex items-center gap-2 text-brand-600 font-medium
                         hover:text-brand-700 transition-colors text-sm"
            >
              ↓ Download CV
            </a>
          </div>
          <div className="space-y-3">
            {[
              { year: '2022–now',  role: 'Release Train Engineer', org: 'MBition GmbH, Berlin' },
              { year: '2019–2022', role: 'Agile Coach / Scrum Master', org: 'Various enterprise clients' },
              { year: '2014–2019', role: 'Senior Scrum Master', org: 'Automotive & finance sector' },
              { year: '2004–2014', role: 'Software Developer → Team Lead', org: 'Istanbul tech scene' },
            ].map(e => (
              <div key={e.year}
                className="flex gap-6 p-4 rounded-xl bg-white border border-ink-100">
                <span className="text-xs text-ink-400 whitespace-nowrap pt-0.5 w-24 shrink-0">
                  {e.year}
                </span>
                <div>
                  <div className="text-sm font-medium text-ink-800">{e.role}</div>
                  <div className="text-xs text-ink-400">{e.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-ink-900 mb-4">
            Let's work together
          </h2>
          <p className="text-ink-500 mb-10">
            Open to freelance, consulting, and coaching engagements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.linkedin.com/in/hakan-adiguzel/"
              target="_blank"
              className="px-6 py-3 bg-[#0A66C2] text-white rounded-full font-medium
                         hover:bg-[#095ba8] transition-colors text-sm"
            >
              Connect on LinkedIn
            </a>
            <a
              href="mailto:hakan@hakanadiguzel.com"
              className="px-6 py-3 border border-ink-200 text-ink-700 rounded-full font-medium
                         hover:border-brand-400 hover:text-brand-600 transition-colors text-sm"
            >
              Send an email
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-ink-100 py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row
                        justify-between items-center gap-4 text-sm text-ink-400">
          <span>© 2025 Hakan Adıgüzel</span>
          <div className="flex gap-6">
            <Link href="/platform" className="hover:text-brand-600 transition-colors">
              Platform
            </Link>
            <a href="https://github.com/hakanadiguzel" target="_blank"
               className="hover:text-brand-600 transition-colors">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/hakan-adiguzel/" target="_blank"
               className="hover:text-brand-600 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

    </main>
  )
}
