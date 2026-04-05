# Agile Interaction Platform

> hakanadiguzel.com — personal brand + 7 agile tools under one roof.

**Live:** https://hakanadiguzel.com  
**Platform:** https://hakanadiguzel.com/platform  
**Author:** Hakan Adıgüzel — Release Train Engineer · Scrum Master · Agile Coach

---

## What this is

A Next.js monorepo that combines:
1. **hakanadiguzel.com** — personal branding site (Agile Leader profile)
2. **/platform** — authenticated dashboard with 7 agile tools

The 7 tools live in their own GitHub repos (unchanged), deployed to GitHub Pages.
The platform embeds them via `<iframe>` and injects shared Team/ART context
as URL parameters — so data flows without rewriting any tool.

---

## Tech stack

| Layer       | Choice            | Why                                      |
|-------------|-------------------|------------------------------------------|
| Framework   | Next.js 14 (App Router) | SSR for landing SEO, client for platform |
| Auth        | Firebase Auth     | Email+password + Google SSO, free tier   |
| Database    | Firestore         | Teams, ARTs, Sprints — 1 GB free         |
| Styling     | Tailwind CSS      | Fast, consistent, no runtime             |
| Deploy      | Vercel            | Auto-deploy on push, free hobby plan     |
| Tools       | GitHub Pages      | Each tool repo deploys independently     |

---

## Project structure

```
agile-platform/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # hakanadiguzel.com landing
│   │   ├── layout.tsx                # Root layout (fonts, metadata)
│   │   ├── globals.css
│   │   └── platform/
│   │       ├── layout.tsx            # Sidebar + Auth guard
│   │       ├── page.tsx              # Dashboard
│   │       ├── settings/page.tsx     # Team & ART setup
│   │       └── [toolId]/page.tsx     # Dynamic iframe wrapper
│   ├── components/
│   │   └── platform/
│   │       └── AuthForm.tsx          # Email + Google SSO
│   └── lib/
│       ├── firebase.ts               # Firebase init
│       ├── data.ts                   # Types + Firestore helpers + SharedContext
│       └── tools.ts                  # 7 tool registry (name, URL, icon, category)
├── .env.local.example                # Firebase config template
├── vercel.json
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## 7 Tools

| Tool | Repo | Category |
|------|------|----------|
| 🔁 Retro Board | retroboard | Team |
| ❤️ Team Health Check | health | Team |
| ☕ Lean Café | lean-cafe | Team |
| 📢 Feed Post | feedpost | Team |
| 🗳️ PI Confidence Vote | pi-confidence-vote | PI/ART |
| 📝 PSM Exam Simulator | psm-exam-simulator | Learn |
| 🔧 Tool 7 | (TBD from GitHub) | — |

---

## Setup — step by step

### 1. Clone this repo

```bash
git clone https://github.com/hakanadiguzel/agile-platform
cd agile-platform
npm install
```

### 2. Create Firebase project

1. Go to https://console.firebase.google.com
2. Create project: `agile-platform`
3. Enable **Authentication** → Sign-in methods → Email/Password ✓ + Google ✓
4. Enable **Firestore** → Start in production mode
5. Go to Project Settings → Your apps → Add Web app
6. Copy the config values

### 3. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local and paste your Firebase config values
```

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000         (landing page)
# → http://localhost:3000/platform (platform dashboard)
```

### 5. Enable GitHub Pages for each tool

For each tool repo (retroboard, health, lean-cafe, etc.):
- Settings → Pages → Source: GitHub Actions or main branch /root
- The live URL will be: `https://hakanadiguzel.github.io/<repo-name>`
- Update the `liveUrl` field in `src/lib/tools.ts` if needed

### 6. Deploy to Vercel

```bash
# Install Vercel CLI (optional, you can also use vercel.com dashboard)
npx vercel

# Then add env vars in Vercel Dashboard:
# Project → Settings → Environment Variables
# Add all NEXT_PUBLIC_FIREBASE_* values
```

After deploy, add your custom domain:
- Vercel → Project → Settings → Domains → Add `hakanadiguzel.com`
- Update your DNS: CNAME `@` → `cname.vercel-dns.com`

---

## How shared context works

1. User sets Team and ART in `/platform/settings`
2. These IDs are saved to `localStorage` (immediate) and Firestore (persistent)
3. When a tool opens, `SharedContext.buildToolURL(tool.liveUrl)` appends `?teamId=X&artId=Y`
4. Each tool can read these URL params and pre-fill its own UI

**To make a tool context-aware**, add this to its JS:
```javascript
const params  = new URLSearchParams(window.location.search)
const teamId  = params.get('teamId')
const artId   = params.get('artId')
const sprintId = params.get('sprintId')
// Use these to fetch or filter data
```

---

## Adding the 7th tool

1. Find the repo name from GitHub
2. Open `src/lib/tools.ts`
3. Update the last entry in the `TOOLS` array:
   ```ts
   {
     id:          'your-repo-name',
     name:        'Tool Name',
     description: 'What it does',
     icon:        '🔧',
     color:       'bg-ink-50',
     accent:      'text-ink-700',
     githubRepo:  'your-repo-name',
     liveUrl:     'https://hakanadiguzel.github.io/your-repo-name',
     category:    'team',
     contextParams: ['teamId'],
   }
   ```

---

## Firestore security rules

Add these in Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teams/{teamId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null;
    }
    match /arts/{artId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null;
    }
    match /sprints/{sprintId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Cost

Everything runs on free tiers:
- **Firebase:** Auth (unlimited), Firestore (1 GB, 50K reads/day)
- **Vercel:** Hobby plan (100 GB bandwidth/month)
- **GitHub Pages:** Unlimited for public repos

Estimated monthly cost: **$0**

---

## Roadmap

- [ ] Sprint management inside platform (not just context pass-through)
- [ ] Team member invitation via email
- [ ] Velocity chart aggregated from sprint data
- [ ] PI Planning board native (replace iframe)
- [ ] Mobile-responsive platform sidebar
- [ ] Dark mode
