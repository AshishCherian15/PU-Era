# 10 — TODO

## Status key: TODO | IN_PROGRESS | DONE | BLOCKED

---

## Infrastructure (BLOCKED — needs owner action)
- [ ] Apply Supabase migrations in order: `0001` → `0002` → `0003` → `0004` → `0005`
- [ ] Set auth redirect URL in Supabase dashboard → `https://puera.in/api/auth/callback`
- [ ] Add production Supabase keys to `.env.local`
- [ ] Deploy to Vercel / production host

## Content (TODO — needs owner action)
- [ ] Upload first batch of notes PDFs to Google Drive (PU Era folder, "Anyone with link" share)
- [ ] Add Drive links as resources via `/admin/resources/new`
- [ ] Seed chapters for 1st PUC subjects (Physics, Chemistry, Math, Biology)
- [ ] Seed chapters for NCERT 11 & 12 subjects

## Code — Phase 2 (TODO)
- [ ] Admin lab-guides CRUD UI (currently shows empty state, add via Supabase directly for now)
- [ ] Announcement detail/edit page (`/admin/announcements/[id]`)
- [ ] Search page UI (`/search`) — API exists at `/api/search`, no public page yet
- [ ] Popup announcement display on public pages (banner strip done, popup modal not yet)
- [ ] Guardian consent email flow (schema exists, email sending not wired)

## DONE (all Phase 1 code)
- [x] Full DB schema + migrations (0001–0005)
- [x] All public pages (home, subjects, chapters, resources, lab-guides, textbooks, about, contact, legal)
- [x] All student pages (dashboard, bookmarks, progress, downloads, notifications, requests, suggestions, feedback, profile, security, consent, delete-account)
- [x] Full admin panel (dashboard, resources, subjects, textbooks, lab-guides, announcements, users, requests, suggestions, feedback, contact, provenance, takedowns, audit, settings, roles, warnings, pages)
- [x] All API routes
- [x] Auth (student login/register/verify-email/forgot-password + admin separate session)
- [x] Google Drive integration (preview + download)
- [x] Design system (globals.css, all components)
- [x] Middleware (student + admin route protection)
- [x] Sitemap + robots.txt
- [x] College combobox with full Karnataka PUC college list
