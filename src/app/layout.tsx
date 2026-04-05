// src/app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hakan Adıgüzel — Agile Leader & Platform',
  description: 'Release Train Engineer · Scrum Master · Agile Coach. 20+ years of experience. Agile tools platform for teams and ARTs.',
  openGraph: {
    title: 'Hakan Adıgüzel — Agile Leader',
    description: 'Agile tools platform for teams working with Scrum and SAFe.',
    url: 'https://hakanadiguzel.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-white text-ink-900 antialiased">
        {children}
      </body>
    </html>
  )
}
