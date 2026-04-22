# FlowLift — CLAUDE.md

## What we're building
A lightweight SaaS onboarding personalization tool. Cheaper, simpler Appcues alternative.
Target customer: early-stage SaaS founders who can't afford $300/mo.

## Monorepo structure
- apps/dashboard — Next.js 14 dashboard (TypeScript, Tailwind, Supabase Auth)
- apps/snippet — Vanilla TypeScript embeddable script, bundled to <10KB
- supabase/ — DB migrations and Edge Functions

## Commands
- `pnpm dev` — starts dashboard on localhost:3000
- `pnpm build:snippet` — bundles snippet to apps/snippet/dist/flowlift.min.js
- `pnpm db:push` — pushes supabase migrations
- `pnpm lint` — ESLint across all workspaces

## Critical rules Claude must follow
1. NEVER add external JS libraries to the snippet package. Vanilla TS only. Bundle size <10KB gzipped.
2. NEVER use document.cookie in the snippet. Use localStorage only.
3. All Supabase queries use Row-Level Security — never bypass with service role key on frontend.
4. Snippet must load async and never block host app rendering.
5. Every new DB column needs a migration file in supabase/migrations/.
6. Keep the flow builder UI to 3 element types: modal, tooltip, banner. No scope creep.

## Architecture decisions (final, don't relitigate)
- Snippet fetches flows from Supabase Edge Function (not a separate Express server)
- Targeting rules evaluated CLIENT-SIDE in snippet (no server round trip for matching)
- Analytics events batched and sent every 5 seconds or on page unload
- No React in snippet — it must work inside any framework (Vue, Angular, vanilla, etc.)

## Env vars (never commit these)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (edge functions only)
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY
