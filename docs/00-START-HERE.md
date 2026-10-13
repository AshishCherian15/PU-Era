# 00 — START HERE
**Project:** PU Era · **Brand:** PU Era · **Domain:** puera.in · **Phase:** 1 — Content skeleton + public SEO

---

## 1. Intent contract (read before anything else)

> **Build a free, legally-compliant Karnataka PUC + NCERT study-resource website that shows OUR OWN student-written works (notes, lab guides, worked examples) to real students, organised as Class → Stream → Subject → Chapter. Public pages are indexable and show original summaries + official textbook links; students must log in to download and use the material. A private, separate admin dashboard lets the owner manage users, resources, announcements and moderation without touching code. Nothing is ever hosted without recorded provenance. Video guides exist only for laboratory/practical demonstrations.**

This paragraph is the **contract**. Any work that does not serve it is out of scope.

---

## 2. Resolved decisions (locked — see 11-PROGRESS.md decision log)

| Question | Answer | Date locked |
|---|---|---|
| Brand name | **PU Era** | 12 Oct 2026 |
| Domain | **puera.in** | 12 Oct 2026 |
| Account email | owner's email | 12 Oct 2026 |
| Model | Free · no ads · no paid tiers | 12 Oct 2026 |
| Fonts | Plus Jakarta Sans (display) + DM Sans (body) | 12 Oct 2026 |
| Video | Labs only, embed-only | 12 Oct 2026 |
| Admin | Separate login, MFA, own session | 12 Oct 2026 |
| Discussion forum | NOT in scope (safeguarding + moderation) | 12 Oct 2026 |

## 3. Source-of-truth hierarchy

1. User's explicit instruction in current conversation (highest)
2. `docs/11-PROGRESS.md` → Decision log
3. `docs/01-PRD.md` (scope) and `docs/07-RULES.md` (constraints)
4. `docs/02-TRD.md`, `docs/03-DATABASE.md`, `docs/04-FRONTEND.md`
5. Anything else (never authoritative)

## 4. Quick facts

| Item | Value |
|---|---|
| Brand | PU Era |
| Users | Karnataka 1st & 2nd PUC + NCERT 11/12 students (under 18) |
| Content | Notes · Textbooks (official links) · Lab guides · Lab videos (labs only) |
| Access | Public chapter pages; login required for downloads |
| Stack | Next.js 16 App Router + TypeScript + Tailwind v4 + Supabase |
| Region | Supabase ap-south-1 (Mumbai) |
| Current phase | **Phase 1 — Content skeleton + public SEO** |

## 5. How to work here

1. Read `docs/11-PROGRESS.md` fully first.
2. Pick next task from `docs/10-TODO.md` (status: TODO, dependencies DONE).
3. Implement → verify → update `docs/11-PROGRESS.md` in the same session.
4. If blocked → stop and ask the owner.

## 6. Open questions (not blocking — for future sessions)
- Q1: Who is the Grievance Officer (name to publish)? Needed for `/legal/grievance`.
- Q2: Weekly content hours? Determines 100 vs 400 chapters by Day 90.
- Q3: Teacher/senior contributors or solo?
