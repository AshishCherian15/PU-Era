# PU Era — UNDERSTANDING.md
## Single source of truth for all AI agents and human contributors
**Last updated: Session 13 · by: Amazon Q**

---

## 🤖 MANDATORY AI HANDOVER RULE
> **Every AI agent that works on this project MUST update this file at the END of every session.**
> Add a new row to the Session Log (Part 7) with: session number, date, agent name, and a precise bullet-point list of every file created/modified/deleted.
> This file IS the chat history. The next AI reads this instead of a conversation transcript.
> **Failure to update = the next AI starts blind. Do not skip this.**

---

## PART 0 — Current State (read this first, every session)

| Item | Value |
|---|---|
| **Phase** | Phase 1 complete — all code done. Waiting on infrastructure + content. |
| **Brand** | PU Era |
| **Domain** | puera.in |
| **Stack** | Next.js 16 App Router + TypeScript + Tailwind v4 + Supabase (ap-south-1) |
| **TypeScript errors** | **0** (verified Session 13) |
| **Notes storage** | Google Drive ("Anyone with link" share) + Drive link stored in DB |

### What is DONE (code)
All Phase 1 code is complete and type-checked. See `docs/10-TODO.md` for full list.

### What is BLOCKED (needs owner action — not code)
1. Apply Supabase migrations: `0001` → `0002` → `0003` → `0004` → `0005`
2. Set auth redirect URL in Supabase dashboard → `https://puera.in/api/auth/callback`
3. Add production Supabase keys to `.env.local`
4. Upload PDFs to Google Drive → paste links in `/admin/resources/new`

### Resolved decisions (locked — do not re-open)
| Question | Answer | Date |
|---|---|---|
| Brand name | PU Era | 12 Oct 2026 |
| Domain | puera.in | 12 Oct 2026 |
| Fonts | Plus Jakarta Sans (display) + DM Sans (body) | 12 Oct 2026 |
| Notes/materials hosting | Google Drive public share links | 12 Oct 2026 |
| Admin | Separate login, httpOnly cookie, service-role client | 12 Oct 2026 |
| Discussion forum | NOT in scope | 12 Oct 2026 |
| NCERT/KTBS files | Direct-link only — NEVER host ourselves | 12 Oct 2026 |
| Video | Labs only, embed-only | 12 Oct 2026 |
| Grievance page | Redirects to /contact (no separate page) | 13 Oct 2026 |

---

## PART 1 — What this website is

**Free, ad-free Karnataka PUC + NCERT study-resource website.**

Organisation: **Class → Stream → Subject → Chapter → Resources**

### Users
- Primary: Karnataka 1st & 2nd PUC students (most under 18)
- Secondary: NCERT Class 11 & 12 students

### Public (no login required)
- Browse all subjects, chapters, resource lists
- Preview documents inline (Google Drive iframe)
- Browse official textbooks directory (links only)
- Browse lab guides, about, contact, legal pages

### Requires login (free account)
- Download materials
- Track chapter progress, bookmark resources
- Submit material requests, feedback, suggestions

### Admin only
- Add/edit/publish resources (with Drive link + licence)
- Manage users (warn, suspend, ban)
- Create announcements, handle takedowns, view audit logs

---

## PART 2 — Architecture

```
Next.js 16 App Router
├── /app
│   ├── page.tsx                    → HomeClient.tsx (client, announcement strip)
│   ├── layout.tsx                  → Root layout (no Header/Footer for /admin/*)
│   ├── globals.css                 → Full design system
│   ├── /subjects                   → Subject listing (SubjectsList.tsx)
│   ├── /subjects/[id]              → Subject detail + chapter list
│   ├── /subjects/[id]/[chapterId]  → Chapter + resource grid
│   ├── /resources/[slug]           → Resource viewer (Drive preview)
│   ├── /resources                  → All resources listing
│   ├── /lab-guides                 → Lab guides directory
│   ├── /lab-guides/[slug]          → Individual experiment
│   ├── /textbooks                  → Official textbook links
│   ├── /about, /contact            → Info pages
│   ├── /login, /register, /verify-email, /forgot-password
│   ├── /legal/terms, /privacy, /copyright
│   ├── /legal/grievance            → Redirects to /contact
│   ├── /student/*                  → Auth-protected (middleware guards)
│   └── /admin/*                    → Admin area (separate httpOnly cookie)
├── /lib
│   ├── supabase/server.ts, client.ts, admin.ts
│   ├── types.ts                    → All TypeScript types (matches DB schema)
│   ├── content/taxonomy.ts         → Static subject taxonomy (40+ subjects)
│   ├── data/subjects.ts, chapters.ts, resources.ts  → Supabase query helpers
│   ├── drive.ts                    → Google Drive URL parser
│   ├── subject-keys.ts             → Taxonomy ID → DB slug mapping
│   ├── display-subject.ts          → Unified name/code helpers
│   ├── colleges.ts                 → Karnataka PUC college list (~100 colleges)
│   └── utils.ts                    → cn() helper
└── /supabase/migrations
    ├── 0001_complete_schema.sql
    ├── 0002_functions.sql
    ├── 0003_seed_data.sql
    ├── 0004_add_profile_fields.sql
    └── 0005_seed_textbooks.sql
```

### Google Drive content flow
```
Admin → uploads PDF to PU Era Drive folder
      → "Anyone with the link can view"
      → copies share URL
      → pastes in /admin/resources/new
      → Drive file ID auto-extracted and validated
      → stored as external_url in resources table

Student → visits /resources/[slug]
        → sees inline Google Drive iframe preview (no login needed)
        → clicks "Download" → must log in
        → after login → redirected to Drive download URL
```

---

## PART 3 — Database schema (key tables)

All tables have RLS enabled. `is_admin()` helper function controls admin access.

| Table | Purpose |
|---|---|
| `profiles` | Student profiles, synced from auth.users |
| `admin_users` | Admin role assignments (separate from profiles) |
| `subjects` | Subject taxonomy (class+stream+board) |
| `chapters` | Chapters within subjects |
| `resources` | Study materials with Drive link + licence provenance |
| `textbooks` | Official KTBS/NCERT links directory |
| `lab_experiments` | Lab guide content |
| `bookmarks` | Student bookmarked resources |
| `progress` | Chapter completion tracking |
| `resource_downloads` | Download audit log |
| `announcements` | Site-wide announcements (banner/popup) |
| `announcement_dismissals` | Per-user popup dismissals |
| `notifications` | Student notification inbox |
| `requests` | Material request tickets |
| `suggestions` | Feature suggestions from students |
| `feedback` | Content/site feedback |
| `contact_messages` | Contact form submissions |
| `consents` | Consent records (TOS, privacy, guardian) |
| `guardian_consents` | Under-18 guardian verification tokens |
| `suspensions`, `warnings` | Moderation records |
| `pages` | CMS for legal pages |
| `settings` | Site-wide settings key-value store |
| `audit_logs` | Admin action audit trail |
| `search_logs` | Failed search tracking |
| `takedowns` | DMCA/copyright complaint queue |

---

## PART 4 — Project file structure (clean state after Session 13)

```
pu-era/
├── app/
│   ├── about/page.tsx
│   ├── admin/
│   │   ├── announcements/
│   │   │   ├── new/AddAnnouncementForm.tsx + page.tsx
│   │   │   ├── ArchiveButton.tsx          ← client component
│   │   │   └── page.tsx
│   │   ├── audit/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── feedback/AdminFeedbackTable.tsx + page.tsx
│   │   ├── lab-guides/page.tsx
│   │   ├── login/page.tsx
│   │   ├── pages/page.tsx
│   │   ├── provenance/page.tsx
│   │   ├── requests/AdminRequestsTable.tsx + page.tsx
│   │   ├── resources/[id]/EditResourceForm.tsx + page.tsx
│   │   ├── resources/new/page.tsx
│   │   ├── resources/AddResourceForm.tsx + page.tsx
│   │   ├── roles/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── subjects/SubjectsManager.tsx + page.tsx
│   │   ├── suggestions/AdminSuggestionsTable.tsx + page.tsx
│   │   ├── takedowns/page.tsx
│   │   ├── textbooks/AdminTextbooksView.tsx + page.tsx
│   │   ├── users/[id]/suspend/page.tsx + warn/page.tsx + page.tsx
│   │   ├── users/UserActionForm.tsx + page.tsx
│   │   ├── warnings/page.tsx
│   │   ├── admin.css
│   │   └── layout.tsx
│   ├── api/
│   │   ├── admin/announcements/route.ts   ← POST + PATCH
│   │   ├── admin/auth/login/route.ts + signout/route.ts
│   │   ├── admin/feedback/[id]/route.ts
│   │   ├── admin/requests/[id]/route.ts
│   │   ├── admin/resources/[id]/route.ts + route.ts
│   │   ├── admin/subjects/[id]/chapters/route.ts + route.ts
│   │   ├── admin/suggestions/[id]/route.ts
│   │   ├── admin/textbooks/route.ts
│   │   ├── admin/users/[id]/action/route.ts
│   │   ├── auth/callback/route.ts + signout/route.ts
│   │   ├── bookmarks/route.ts
│   │   ├── colleges/route.ts
│   │   ├── contact/route.ts
│   │   ├── feedback/route.ts
│   │   ├── notifications/route.ts
│   │   ├── profile/route.ts
│   │   ├── progress/route.ts
│   │   ├── requests/route.ts
│   │   ├── resources/[id]/download/route.ts
│   │   ├── search/route.ts
│   │   └── suggestions/route.ts
│   ├── components/
│   │   ├── common/Footer.tsx + Header.tsx + LanguageSwitcher.tsx + ShellWrapper.tsx
│   │   ├── EmptyState.tsx
│   │   ├── GoogleDriveViewer.tsx
│   │   ├── LabCard.tsx
│   │   ├── ProgressChapter.tsx
│   │   └── ResourceCard.tsx
│   ├── contact/page.tsx
│   ├── forgot-password/page.tsx
│   ├── lab-guides/[slug]/page.tsx + page.tsx
│   ├── legal/
│   │   ├── copyright/page.tsx
│   │   ├── grievance/page.tsx             ← redirect to /contact
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── _components.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── resources/[slug]/page.tsx + page.tsx
│   ├── student/
│   │   ├── bookmarks/page.tsx
│   │   ├── consent/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── delete-account/DeleteAccountForm.tsx + page.tsx
│   │   ├── downloads/page.tsx
│   │   ├── feedback/FeedbackForm.tsx + page.tsx
│   │   ├── notifications/NotificationsList.tsx + page.tsx
│   │   ├── profile/ProfileForm.tsx + page.tsx
│   │   ├── progress/page.tsx
│   │   ├── requests/new/RequestForm.tsx + page.tsx + page.tsx
│   │   ├── security/SecurityForm.tsx + page.tsx
│   │   ├── suggestions/SuggestionsView.tsx + page.tsx
│   │   └── layout.tsx
│   ├── subjects/[id]/[chapterId]/page.tsx
│   ├── subjects/[id]/page.tsx
│   ├── subjects/SubjectsList.tsx + page.tsx
│   ├── textbooks/page.tsx
│   ├── verify-email/page.tsx
│   ├── error.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── HomeClient.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── docs/
│   ├── 00-START-HERE.md
│   └── 10-TODO.md
├── lib/
│   ├── content/taxonomy.ts
│   ├── data/chapters.ts + resources.ts + subjects.ts
│   ├── supabase/admin.ts + client.ts + server.ts
│   ├── colleges.ts
│   ├── display-subject.ts
│   ├── drive.ts
│   ├── subject-keys.ts
│   ├── types.ts
│   └── utils.ts
├── public/
│   └── favicon.ico (only — default Next.js SVGs removed)
├── scripts/apply-migrations.md
├── supabase/
│   ├── migrations/0001–0005 .sql
│   └── schema.sql
├── .amazonq/rules/AutoMode.md
├── .env.example
├── .env.local
├── .gitignore
├── AGENTS.md
├── eslint.config.mjs
├── middleware.ts                          ← route protection (student + admin) — MUST exist at root
├── next-env.d.ts
├── next.config.ts
├── package.json
├── README.md
├── tsconfig.json
└── UNDERSTANDING.md
```

**Files that do NOT exist (removed as orphans):**
- `proxy.ts` — was a duplicate of middleware logic, deleted Session 13
- `lib/content-schema.ts` — old Zod schemas with wrong types, deleted Session 13
- `lib/tokens.ts` — old design tokens (wrong colors), deleted Session 13
- `lib/i18n.ts` — unused after LanguageSwitcher was inlined, deleted Session 13
- `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — Next.js defaults, deleted Session 13
- `List Of College.txt` — raw data file at root, data moved to `lib/colleges.ts`, deleted Session 13

---

## PART 5 — Admin access

**Admin Login URL**: `/admin/login`

**Creating an admin user** (after applying migrations):
```sql
INSERT INTO admin_users (user_id, role, status, created_by)
VALUES (
  '<auth.users.uuid>',
  'admin',
  'active',
  '<your_auth_user_uuid>'
);
```

---

## PART 6 — Google Drive URL formats supported

- `https://drive.google.com/file/d/{ID}/view?usp=sharing` ✓
- `https://drive.google.com/open?id={ID}` ✓
- `https://docs.google.com/document/d/{ID}/edit` ✓
- `https://docs.google.com/spreadsheets/d/{ID}` ✓

---

## PART 7 — Session Log (MANDATORY — every AI must add a row here)

> Format: | Session # | Date | Agent | Files changed (bullet list) |

| Session | Date | Agent | What was done |
|---|---|---|---|
| 1 | 12 Oct 2026 | Antigravity AI | Initial spec written, UNDERSTANDING.md created |
| 2 | 12 Oct 2026 | Antigravity AI | Full implementation: 50+ files created, full stack built. All supabase clients, types, middleware, migrations, all public pages, all student pages, all admin pages, all API routes, design system. |
| 3 | 13 Oct 2026 | Antigravity AI | Built all remaining Student & Admin pages (25+ files), fixed CSS tokens, created seed data migration `0003_seed_data.sql`, verified 0 TypeScript errors. |
| 4 | 13 Oct 2026 | Devin | Fixed Next.js 16 breaking changes (params Promise, usePathname Suspense). Updated CSS classes for Tailwind v4. Added `allowedDevOrigins` to `next.config.ts`. Added Sign Up button to `Header.tsx`. Documented admin access in README and UNDERSTANDING.md. |
| 5 | 13 Oct 2026 | Devin | `app/register/page.tsx` — guardian email optional, simplified consent, added college combobox. `app/student/profile/page.tsx` + `ProfileForm.tsx` — editable name/class/stream/college/guardian email. `app/student/delete-account/` — full account deletion. `supabase/migrations/0004_add_profile_fields.sql` — new profile columns. `lib/colleges.ts` — full Karnataka PUC college list. `app/api/colleges/route.ts` — created. |
| 6 | 13 Oct 2026 | Amazon Q | `app/subjects/[id]/page.tsx` + `app/subjects/[id]/[chapterId]/page.tsx` — replaced all old `neutral-*`/`primary-*` CSS classes with established design system classes. |
| 7 | 13 Oct 2026 | Amazon Q | `app/globals.css` — added all missing semantic utility classes (`text-primary`, `text-heading`, `text-muted`, `bg-surface`, `bg-surface-alt`, `bg-primary`, `border-border`, hover variants, `stream-pill.stream-*`, `.auth-bg`). Removed duplicate CSS. `app/not-found.tsx` + `app/error.tsx` — fixed broken CSS classes. `app/login/page.tsx`, `app/register/page.tsx`, `app/verify-email/page.tsx`, `app/forgot-password/page.tsx` — switched to `.auth-bg`. |
| 8 | 13 Oct 2026 | Amazon Q | `app/layout.tsx` — `/admin/*` routes no longer get public Header/Footer. `app/page.tsx` → `app/HomeClient.tsx` — announcement strip wired to real `announcements` DB table. `supabase/migrations/0005_seed_textbooks.sql` — 28 official KTBS/NCERT textbook links. `app/admin/takedowns/page.tsx` — SLA changed to 48h. `app/admin/feedback/AdminFeedbackTable.tsx` — type filter moved below status tabs. |
| 9 | 13 Oct 2026 | Amazon Q | `app/legal/grievance/page.tsx` — now redirects to `/contact`. `app/register/page.tsx` — college field rewritten as real combobox. `lib/colleges.ts` — replaced with full list from `List Of College.txt`. `app/api/colleges/route.ts` — created. `app/subjects/[id]/page.tsx` — removed `generateMockChapters` fallback. `app/legal/_components.tsx` — `LegalNavLink` component added, active-page underline. `app/subjects/page.tsx` — jump-nav anchors added. `app/HomeClient.tsx` — Platform Overview stats labelled "Targets". |
| 10 | 13 Oct 2026 | Amazon Q | `app/admin/users/[id]/page.tsx` + `warn/page.tsx` + `suspend/page.tsx`. `app/admin/resources/[id]/page.tsx` + `EditResourceForm.tsx`. `app/admin/subjects/SubjectsManager.tsx`. `app/admin/textbooks/AdminTextbooksView.tsx`. `app/admin/requests/AdminRequestsTable.tsx`. `app/admin/suggestions/AdminSuggestionsTable.tsx`. `app/admin/feedback/AdminFeedbackTable.tsx`. `app/admin/contact/page.tsx`. `app/admin/announcements/new/AddAnnouncementForm.tsx`. `app/student/requests/new/RequestForm.tsx`. `app/api/admin/subjects/[id]/chapters/route.ts`. `app/api/admin/subjects/route.ts`. `app/api/admin/announcements/route.ts`. `app/api/admin/textbooks/route.ts`. `app/api/admin/requests/[id]/route.ts`. `app/api/admin/suggestions/[id]/route.ts`. `app/api/admin/feedback/[id]/route.ts`. `app/api/admin/users/[id]/action/route.ts`. `app/api/requests/route.ts`. `app/api/notifications/route.ts`. `app/api/suggestions/route.ts`. `app/api/feedback/route.ts`. `app/api/profile/route.ts`. |
| 11 | 13 Oct 2026 | Amazon Q | `app/admin/pages/page.tsx` — removed `/legal/grievance` entry (page was deleted), added `/contact`. `app/admin/announcements/page.tsx` — replaced broken `[id]` links with `ArchiveButton`. `app/admin/announcements/ArchiveButton.tsx` — created (client component). `app/api/admin/announcements/route.ts` — added PATCH handler for archiving. |
| 12 | 13 Oct 2026 | Amazon Q | **Project cleanup & directory audit.** Deleted orphan files: `proxy.ts`, `lib/content-schema.ts`, `lib/tokens.ts`, `lib/i18n.ts`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, `List Of College.txt`. Fixed `app/components/common/LanguageSwitcher.tsx` — inlined Language types/data (was importing deleted `lib/i18n`). Created `docs/10-TODO.md`. Rewrote `UNDERSTANDING.md` with proper per-session log, accurate file tree, and enforced handover rule. **0 TypeScript errors verified.** |
| 13 | 13 Oct 2026 | Amazon Q | **Critical fix: `middleware.ts` was missing from root.** `proxy.ts` (deleted in S12) had the middleware logic but exported `proxy()` not `middleware()` — route protection was never active. Created `middleware.ts` at root with correct `middleware()` export and `config.matcher`. Added `public/.gitkeep` (public/ was empty after SVG cleanup). **0 TypeScript errors verified.** |
| 14 | 13 Oct 2026 | Amazon Q | **GitHub push prep.** Rewrote `README.md` — full detail: what the site is, features, tech stack, full project structure, DB schema table, Drive flow, admin setup, roadmap, legal. Created `LICENSE` (MIT + CC BY 4.0 content note). Created `SECURITY.md` (vulnerability reporting policy, scope, architecture notes). Updated `.gitignore` (airtight — all env variants, OS files, logs). |

---

## PART 8 — Instructions for the next AI agent

1. **Read this file fully before touching any code.**
2. Check `docs/10-TODO.md` for what's next.
3. Run `npx tsc --noEmit` first — should be 0 errors. If not, fix before doing anything else.
4. The owner still needs to apply Supabase migrations and add env keys before the site works end-to-end.
5. **At the end of your session, add a row to Part 7 Session Log above.** Include every file you created, modified, or deleted. This is not optional.
