# PU Era

> Free, ad-free study resources for Karnataka PUC 1st & 2nd Year and NCERT Class 11 & 12 students.
> Notes · Lab Guides · Official Textbook Links · Worked Examples — 100% free, forever.

**Live site:** [puera.in](https://puera.in) &nbsp;|&nbsp; **Target audience:** Karnataka PUC students (under 18) &nbsp;|&nbsp; **Language:** English · ಕನ್ನಡ · हिंदी

---

## What is PU Era?

PU Era is a free educational platform built specifically for Karnataka Pre-University Course (PUC) students and NCERT Class 11 & 12 students. Every resource on the site is either written by students/educators or links directly to official government sources (KTBS, NCERT). There are no ads, no paywalls, and no paid tiers — ever.

### The problem it solves
Karnataka PUC students currently rely on scattered WhatsApp PDFs, paid coaching apps, and unofficial notes of questionable accuracy. PU Era provides a single, organised, syllabus-aligned destination with verified content.

### What's on the platform
| Content type | Description |
|---|---|
| Chapter Notes | Verified notes aligned to Karnataka DPUE & NCERT syllabus 2026-27 |
| Lab Guides | Complete practical guides — aim, apparatus, procedure, observations, viva Q&A |
| Official Textbooks | Direct links to KTBS and NCERT official PDF portals (never hosted ourselves) |
| Worked Examples | Step-by-step solved problems for Science and Commerce subjects |
| Formula Sheets | Quick-reference formula cards for Physics, Chemistry, Mathematics |

### Who it's for
- **Primary:** Karnataka 1st & 2nd PUC students (Science, Commerce, Arts streams)
- **Secondary:** NCERT Class 11 & 12 students across India

---

## Features

### Public (no account needed)
- Browse 40+ subjects organised by Class → Stream → Subject → Chapter
- Read chapter summaries and resource listings
- Preview study materials inline via Google Drive iframe
- Browse the official textbooks directory (KTBS + NCERT links)
- Browse lab guides and practical experiment guides
- Multi-language UI (English, Kannada, Hindi)

### Student account (free)
- Download all study materials
- Track chapter completion progress
- Bookmark resources for later
- Submit material requests (ask for specific notes)
- Submit feedback and feature suggestions
- Receive site announcements and notifications

### Admin panel (owner only)
- Full content management: add/edit/publish resources with Google Drive links
- Subject and chapter management
- User management: warn, suspend, or ban accounts
- Announcement system (banner + modal popup)
- Material request queue with reply system
- Feedback and suggestion review
- DMCA / copyright takedown queue (48-hour SLA)
- Content provenance tracking (source + licence for every resource)
- Audit log of all admin actions
- Separate authentication from student accounts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL, ap-south-1 Mumbai) |
| Authentication | Supabase Auth (student) + httpOnly cookie (admin) |
| File storage | Google Drive (public share links, never self-hosted) |
| Validation | Zod v4 |
| Icons | Lucide React |
| Fonts | Plus Jakarta Sans (display) + DM Sans (body) |
| Deployment | Vercel (planned) |

---

## Project Structure

```
pu-era/
├── app/                          # Next.js App Router
│   ├── (public pages)
│   │   ├── page.tsx              # Home — subject picker + announcement strip
│   │   ├── subjects/             # Subject listing + detail + chapter detail
│   │   ├── resources/            # Resource viewer (Google Drive preview)
│   │   ├── lab-guides/           # Lab guides directory + individual experiment
│   │   ├── textbooks/            # Official textbook links directory
│   │   ├── about/                # About page
│   │   ├── contact/              # Contact form
│   │   └── legal/                # Terms, Privacy, Copyright (+ grievance redirect)
│   ├── (auth pages)
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   └── forgot-password/
│   ├── student/                  # Auth-protected student area
│   │   ├── dashboard/
│   │   ├── bookmarks/
│   │   ├── progress/
│   │   ├── downloads/
│   │   ├── notifications/
│   │   ├── requests/             # Material request submission
│   │   ├── suggestions/
│   │   ├── feedback/
│   │   ├── profile/
│   │   ├── security/             # Password change
│   │   ├── consent/              # DPDP Act consent centre
│   │   └── delete-account/       # DPDP Act account erasure
│   ├── admin/                    # Separate admin area
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── resources/            # Add / edit resources
│   │   ├── subjects/             # Manage subjects & chapters
│   │   ├── textbooks/            # Manage official textbook links
│   │   ├── lab-guides/
│   │   ├── announcements/        # Create & archive announcements
│   │   ├── users/                # User list + warn/suspend actions
│   │   ├── warnings/
│   │   ├── requests/             # Review student material requests
│   │   ├── suggestions/          # Review feature suggestions
│   │   ├── feedback/             # Review content feedback
│   │   ├── contact/              # Review contact form submissions
│   │   ├── provenance/           # Content origin & licence tracking
│   │   ├── takedowns/            # DMCA / copyright queue
│   │   ├── audit/                # Admin action audit log
│   │   ├── roles/                # Role overview
│   │   ├── pages/                # Static page directory
│   │   └── settings/
│   └── api/                      # API route handlers
│       ├── auth/                  # Student auth callbacks
│       ├── admin/auth/            # Admin login/signout
│       ├── admin/resources/       # Resource CRUD
│       ├── admin/subjects/        # Subject + chapter management
│       ├── admin/announcements/   # Announcement management
│       ├── admin/textbooks/       # Textbook link management
│       ├── admin/users/           # User moderation actions
│       ├── admin/requests/        # Request status updates
│       ├── admin/suggestions/     # Suggestion status updates
│       ├── admin/feedback/        # Feedback status updates
│       ├── bookmarks/             # Student bookmark toggle
│       ├── progress/              # Chapter progress tracking
│       ├── resources/[id]/download/  # Authenticated download redirect
│       ├── search/                # Full-text search
│       ├── colleges/              # Karnataka PUC college list
│       ├── contact/               # Contact form submission
│       ├── feedback/              # Student feedback submission
│       ├── notifications/         # Mark notifications read
│       ├── profile/               # Profile update + soft delete
│       ├── requests/              # Material request submission
│       └── suggestions/           # Feature suggestion submission
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # Server-side client (RLS-bound)
│   │   ├── client.ts             # Browser client
│   │   └── admin.ts              # Service-role client (server-only)
│   ├── content/
│   │   └── taxonomy.ts           # Static subject taxonomy (40+ subjects)
│   ├── data/
│   │   ├── subjects.ts           # Supabase subject query helpers
│   │   ├── chapters.ts           # Supabase chapter query helpers
│   │   └── resources.ts          # Supabase resource query helpers
│   ├── types.ts                  # All TypeScript types (matches DB schema)
│   ├── drive.ts                  # Google Drive URL parser & link builder
│   ├── subject-keys.ts           # Taxonomy ID → DB slug mapping
│   ├── display-subject.ts        # Unified subject name/code helpers
│   ├── colleges.ts               # Karnataka PUC college list (~100 colleges)
│   └── utils.ts                  # cn() utility
├── supabase/
│   └── migrations/
│       ├── 0001_complete_schema.sql   # Full DB schema + RLS policies
│       ├── 0002_functions.sql         # DB helper functions (is_admin, etc.)
│       ├── 0003_seed_data.sql         # Seed subjects (40+ Karnataka PUC subjects)
│       ├── 0004_add_profile_fields.sql # Profile: college, guardian email, etc.
│       └── 0005_seed_textbooks.sql    # Seed 28 official KTBS/NCERT textbook links
├── docs/
│   ├── 00-START-HERE.md          # AI agent orientation guide
│   └── 10-TODO.md                # Task tracker
├── scripts/
│   └── apply-migrations.md       # Migration application guide
├── middleware.ts                  # Route protection (student + admin)
├── next.config.ts
├── UNDERSTANDING.md              # AI handover document (session log)
├── SECURITY.md
└── LICENSE
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/AshishCherian15/pu-era.git
cd pu-era
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Never commit `.env.local`** — it is in `.gitignore`.

### 3. Apply database migrations

Go to your Supabase project → SQL Editor and run each file in order:

```
supabase/migrations/0001_complete_schema.sql
supabase/migrations/0002_functions.sql
supabase/migrations/0003_seed_data.sql
supabase/migrations/0004_add_profile_fields.sql
supabase/migrations/0005_seed_textbooks.sql
```

See `scripts/apply-migrations.md` for detailed instructions.

### 4. Configure Supabase Auth

In your Supabase dashboard → Authentication → URL Configuration:
- **Site URL:** `https://puera.in` (or `http://localhost:3000` for dev)
- **Redirect URLs:** add `https://puera.in/api/auth/callback`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Build for production

```bash
npm run build
npm start
```

---

## Database Schema Overview

All tables have Row Level Security (RLS) enabled. The `is_admin()` PostgreSQL function controls admin-level access.

| Table | Purpose |
|---|---|
| `profiles` | Student profiles (synced from `auth.users`) |
| `admin_users` | Admin role assignments (separate from student profiles) |
| `subjects` | Subject taxonomy (class + stream + board) |
| `chapters` | Chapters within subjects |
| `resources` | Study materials with Google Drive link + licence provenance |
| `textbooks` | Official KTBS/NCERT textbook links |
| `lab_experiments` | Lab guide content |
| `bookmarks` | Student bookmarked resources |
| `progress` | Chapter completion tracking |
| `resource_downloads` | Download audit log |
| `announcements` | Site-wide announcements (banner + popup) |
| `notifications` | Student notification inbox |
| `requests` | Material request tickets |
| `suggestions` | Feature suggestions |
| `feedback` | Content/site feedback |
| `contact_messages` | Contact form submissions |
| `consents` | DPDP Act consent records |
| `guardian_consents` | Under-18 guardian verification tokens |
| `suspensions` / `warnings` | User moderation records |
| `takedowns` | DMCA / copyright complaint queue |
| `audit_logs` | Admin action audit trail |
| `pages` | CMS for legal pages |
| `settings` | Site-wide key-value settings |

---

## Google Drive Content Flow

PU Era uses Google Drive as a zero-cost file host. Files are never stored on the server.

```
Admin workflow:
1. Upload PDF to PU Era Google Drive folder
2. Right-click → Share → "Anyone with the link" → Viewer
3. Copy the share URL
4. Go to /admin/resources/new → paste URL
5. System auto-extracts the Drive file ID
6. Stored as external_url in the resources table

Student workflow:
1. Visit /subjects → pick subject → pick chapter
2. See resource cards (no login needed to preview)
3. Click resource → Google Drive iframe preview loads
4. Click "Download" → must be logged in
5. After login → redirected to Drive direct download URL
```

Supported Drive URL formats:
- `https://drive.google.com/file/d/{ID}/view`
- `https://drive.google.com/open?id={ID}`
- `https://docs.google.com/document/d/{ID}/edit`

---

## Admin Panel

The admin panel is completely separate from the student area — different login, different session cookie, different Supabase client (service-role).

**URL:** `/admin/login`

**Creating your first admin user** (after applying migrations):

```sql
-- Run in Supabase SQL Editor
-- First create the user via Supabase Auth dashboard, then:
INSERT INTO admin_users (user_id, role, status, created_by)
VALUES (
  'paste-auth-user-uuid-here',
  'admin',
  'active',
  'paste-auth-user-uuid-here'
);
```

**Admin roles:**
| Role | Access |
|---|---|
| `super_admin` | Full access to all features and settings |
| `content_admin` | Manage resources, subjects, announcements |
| `moderator` | Manage users, feedback, requests |

---

## Legal & Compliance

- **Original content** (notes, lab guides, worked examples) is licensed under **CC BY 4.0**
- **NCERT content** — linked directly to [ncert.nic.in](https://ncert.nic.in), never hosted
- **KTBS content** — linked directly to [ktbs.kar.nic.in](https://ktbs.kar.nic.in), never hosted
- **DPDP Act 2023** — guardian consent flow for users under 18, consent centre at `/student/consent`, account erasure at `/student/delete-account`
- **DMCA takedowns** — 48-hour response SLA, queue at `/admin/takedowns`
- **No tracking cookies** — single Supabase Auth session cookie only

---

## Roadmap

### Phase 1 — Content skeleton + public SEO ✅ (code complete)
- [x] Full Next.js 16 App Router setup
- [x] Complete database schema with RLS
- [x] All public pages (subjects, chapters, resources, lab guides, textbooks)
- [x] Student auth + full student area
- [x] Complete admin panel
- [x] Google Drive integration
- [x] Design system (Plus Jakarta Sans + DM Sans, emerald brand)
- [x] Sitemap + robots.txt
- [x] Legal pages (Terms, Privacy, Copyright)
- [x] DPDP Act compliance (consent, guardian flow, account deletion)

### Phase 2 — Content population (in progress)
- [ ] Apply Supabase migrations to production
- [ ] Upload first batch of notes PDFs to Google Drive
- [ ] Add resources via admin panel
- [ ] Seed chapters for all 40+ subjects

### Phase 3 — Growth features (planned)
- [ ] Full-text search page (`/search` — API exists, UI pending)
- [ ] Announcement popup modal on public pages
- [ ] Lab guides CRUD in admin panel
- [ ] Email notifications (Supabase email templates)
- [ ] Guardian consent email verification flow
- [ ] PWA / offline support

### Phase 4 — Scale (future)
- [ ] Hindi content
- [ ] NCERT 11 & 12 full content coverage
- [ ] Student-contributed notes (with moderation)
- [ ] Blueprint / marks scheme per subject
- [ ] Previous year question paper archive

---

## Contributing

This is a private project. If you have found a bug or security issue, please see [SECURITY.md](./SECURITY.md).

---

## License

Copyright © 2026 PU Era / Ashish Cherian

Original code in this repository is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

Study materials and notes published on the platform are licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

NCERT and KTBS materials are the property of their respective rights holders and are accessed via their official websites only.
