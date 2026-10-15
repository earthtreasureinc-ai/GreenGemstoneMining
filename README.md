# Green Gemstone Mining

Marketing and investor site for Green Gemstone Mining Company (Hargeisa, Somaliland). Vite 5, React 18, TypeScript, Supabase (optional), deployed on Vercel.

## Develop

```bash
npm ci
cp .env.example .env.local   # optional: enables enquiry form + owner media panel
npm run dev
```

Checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` (all run in CI).

## Supabase setup (one time)

1. Apply `supabase/migrations/*` in order, including `20261015000000_lock_down_media_and_add_leads.sql`.
2. Authentication → Users → add the owner account, then run:
   `insert into public.admin_users (user_id) select id from auth.users where email = 'OWNER_EMAIL';`
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel (Production and Preview).
4. Open the site, use **Owner login** in the footer to manage media. Enquiries land in the `leads` table (readable by admins only).
5. Enable GitHub secret scanning + push protection and branch protection on `main`.

`npm run sync:media` backfills database rows for files already in the bucket (service-role key, run locally only).

## Content to supply

- Real LinkedIn URL in `src/data/site.ts` (`SITE.linkedin`).
- Real project and field photos (current gallery images are exported presentation slides).
- Verified figures and licence/permit details before presenting to investors.
