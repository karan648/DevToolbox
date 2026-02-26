# DevToolbox

Open-source SaaS-style developer productivity platform with a neobrutalism UI.

## Open Source

- License: MIT ([LICENSE](./LICENSE))
- GitHub: https://github.com/karannn/devtoolbox
- Support this project: https://buymeacoffee.com/karannn

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn-style component primitives
- Neobrutalism design system (custom component layer inspired by neobrutalism.dev)
- NextAuth (Credentials + Google + GitHub)
- PostgreSQL + Prisma ORM (Supabase / Neon compatible)
- OpenAI-compatible AI abstraction layer
- Zustand state (command palette + recent tools)
- React Hook Form + Zod validation
- Monaco Editor

## Features

- Landing page with hero, features, pricing preview, footer
- Pricing page with Free/Pro/Team tiers
- Auth pages (single login/register experience)
- Protected dashboard layout with sidebar + topbar
- Tools:
  - Env Manager
  - API Tester
  - JSON/Data Transformer
  - AI Error Debugger
  - Docker Command Builder
  - Repo Analyzer
  - Security Headers Audit
  - JWT Inspector
- Settings page with DB-backed profile fetch/save
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

3. Set your database and auth credentials in `.env`:

- Required: `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Optional OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`

4. Generate Prisma client and sync schema:

```bash
npm run prisma:generate
npm run prisma:push
```

5. Start dev server:

```bash
npm run dev
```

Open: `http://localhost:3000`

## Deployment (Vercel)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example`.
4. Use a managed PostgreSQL instance (Neon/Supabase).
5. Build command:

```bash
npm run prisma:generate && npm run build
```

6. After first deploy, run:

```bash
npm run prisma:push
```

## Contributing

- Fork the repo
- Create a feature branch
- Open a PR with a clear description and screenshots for UI changes

## Notes

- Theme defaults to dark mode.
- No purple color is used in the design system.
- AI provider can be swapped by changing `AI_PROVIDER` and compatible base URL/key.
