# DevToolbox

Production-ready SaaS web application for developer productivity with a neobrutalism UI.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn-style component primitives
- Neobrutalism design system (custom component layer inspired by neobrutalism.dev)
- NextAuth (Email + Google)
- PostgreSQL + Prisma ORM (Supabase / Neon compatible)
- OpenAI-compatible AI abstraction layer
- Zustand state (command palette + recent tools)
- React Hook Form + Zod validation
- Monaco Editor

## Features

- Landing page with hero, features, pricing preview, footer
- Pricing page with Free/Pro/Team tiers
- Auth pages (login + signup)
- Protected dashboard layout with sidebar + topbar
- Tools:
  - Env Manager
  - API Tester
  - JSON/Data Transformer
  - AI Error Debugger
  - Docker Command Builder
- Settings page (profile/theme/API key placeholder)
- Command palette (Cmd/Ctrl + K)
- Recent tools history
- Toast notifications, loading and error states, copy-to-clipboard actions
- Dark mode default + light mode support

## Folder Structure

```txt
app/
  api/
  auth/
  dashboard/
  pricing/
components/
  layout/
  neobrutal/
  providers/
  tools/
  ui/
hooks/
lib/
prisma/
server/
styles/
types/
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure env:

```bash
cp .env.example .env
```

3. Set your database URL and auth/provider keys in `.env`.

4. Generate Prisma client and push schema:

```bash
npm run prisma:generate
npm run prisma:push
```

5. Start development server:

```bash
npm run dev
```

Open: `http://localhost:3000`

## Deployment (Vercel)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example`.
4. Use a managed PostgreSQL instance (Neon/Supabase).
5. Run Prisma in build/deploy step:

```bash
npm run prisma:generate && npm run build
```

6. After first deploy, run:

```bash
npm run prisma:push
```

## Notes

- Theme defaults to dark mode.
- No purple color is used in the design system.
- AI provider can be swapped by changing `AI_PROVIDER` and compatible base URL/key.
