# GreenGemstoneMining

This repository is a Vite + React + TypeScript site for Green Gemstone Mining Company. The ux/quick-fixes-reduced-motion branch contains recent UX, accessibility, and investor-focused changes.

This README covers local setup, environment variables, Supabase migration, and Vercel preview deployment steps.

---

## Quick start (local)

1. Clone and checkout the working branch:

   git clone https://github.com/earthtreasureinc-ai/GreenGemstoneMining.git
   cd GreenGemstoneMining
   git fetch origin
   git checkout ux/quick-fixes-reduced-motion

2. Install dependencies:

   npm ci

3. Create a local `.env` file (see `.env.example`) and add these values (you can use the real values from Supabase or empty strings to preview visuals):

   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

4. Start dev server:

   npm run dev

Open the URL printed by Vite (usually http://localhost:5173).

Notes:
- If you want the media panel and uploads to work you must provide real Supabase keys (see Supabase setup below).

---

## Environment variables

The app expects the following client environment variables at build time (Vite):

- VITE_SUPABASE_URL — your Supabase project URL (e.g. https://xyz.supabase.co)
- VITE_SUPABASE_ANON_KEY — Supabase anon (public) key used by the client

Security notes:
- The `VITE_` prefix causes Vite to embed these variables into the client bundle. This is acceptable for the Supabase anon key (it is intentionally a public key with limited permissions). Do NOT place your SUPABASE_SERVICE_ROLE or other secret keys in `VITE_` vars.
- If you need truly private server-only secrets, add them to your hosting project as server-only vars (no `VITE_` prefix) and call Supabase from server-side code.

A `.env.example` file is included with the variable names.

---

## Supabase setup (basic)

1. Create a Supabase project at https://app.supabase.com if you don't have one.
2. In the Supabase dashboard:
   - Go to the SQL editor and run the migration in `supabase/migrations/20261013_create_media_uploads.sql` (this file is in the repo on the branch).
   - Go to Storage → Create a new bucket (e.g. `media`) and configure permissions (public if you want simple public URLs).
   - In Settings → API copy the Project URL and anon key and add them to Vercel and to your local `.env`.
3. Confirm the `media_uploads` table exists and that row-level security (RLS) and the sample policies are applied.

The migration creates a `media_uploads` table and RLS policies for safe public reads and authenticated writes.

---

## Vercel (preview + production)

1. In your Vercel dashboard, create/import a project and connect the GitHub repo `earthtreasureinc-ai/GreenGemstoneMining`.
2. Configure the build settings:
   - Framework: Vite (or "Other" with build command below)
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add Environment Variables (Preview and Production):
   - VITE_SUPABASE_URL = https://your-project.supabase.co
   - VITE_SUPABASE_ANON_KEY = your-anon-key
4. Enable Preview Deployments for branches/PRs. After you push a branch (like `ux/quick-fixes-reduced-motion`) Vercel will build a preview and provide a public preview URL.

If you prefer CI-triggered deploys using GitHub Actions, add a Vercel token and project/org IDs to GitHub Secrets (VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID) and add a deploy workflow; a sample workflow can be added if you want that flow.

---

## What I changed on branch `ux/quick-fixes-reduced-motion`
- Accessibility and reduced-motion support
- Removed the global `cursor: none` and made the custom cursor opt-in
- Responsive hero height and clearer investor-first messaging
- Gallery images lazy-loaded and gallery filtering improved
- Supabase migration scaffold added (media_uploads)
- `.env.example` and `.gitignore` added

---

## Troubleshooting
- Build errors on Vercel: ensure env vars are present and Node 18 is chosen in the project settings
- Supabase errors: ensure the anon key and project URL are correct and that storage bucket permissions match your usage
- Local dev TypeScript errors: run `npm run typecheck` and fix reported issues (or run `npm run dev` which may still work with type errors depending on your setup)

---

If you want, I can open a PR from `ux/quick-fixes-reduced-motion` → `main` with a short description and checklist. I can also add a dev-only Supabase mock so that the media panel works with no external keys — say “add dev mock” to request that.
