# PU Era

Free study resources for PUC and NCERT students across India. Quality notes, lab guides, and worked examples available in English, Kannada, and Hindi.

## Project Overview

PU Era is an educational platform providing:
- PUC (Pre-University Course) study materials
- NCERT curriculum resources
- Student-written notes and guides
- Lab guides and practical materials
- Worked examples and practice problems
- Multi-language support (English, Kannada, Hindi)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project with credentials

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Setup

Apply migrations in order (see `scripts/apply-migrations.md`):

1. `supabase/migrations/0001_complete_schema.sql`
2. `supabase/migrations/0002_functions.sql`
3. `supabase/migrations/0003_seed_data.sql`

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
pu-era/
├── app/                      # Next.js app directory
│   ├── components/          # React components
│   │   └── common/         # Shared components (Header, Footer, etc.)
│   ├── subjects/           # Subject-related pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── lib/                     # Utility libraries
│   ├── content/            # Content-related utilities
│   │   ├── schema.ts       # Zod schemas
│   │   └── taxonomy.ts     # Subject taxonomy
│   ├── supabase/           # Supabase clients
│   │   ├── server.ts       # Server client (RLS-bound)
│   │   └── admin.ts        # Admin client (service-role)
│   ├── i18n.ts             # Internationalization
│   ├── tokens.ts           # Design tokens
│   └── utils.ts            # General utilities
├── supabase/               # Database schema
│   └── schema.sql          # SQL schema definition
└── public/                 # Static assets
```

## Features

### Current Features
- ✅ Responsive header with navigation
- ✅ Home page with hero section
- ✅ Subject listing page
- ✅ Subject detail page
- ✅ Chapter detail page
- ✅ Multi-language support (English, Kannada, Hindi)
- ✅ Taxonomy with 40+ subjects
- ✅ Content schema with translations
- ✅ Database schema with RLS policies

### Planned Features
- ⏳ User authentication with Supabase Auth
- ⏳ Admin dashboard with CRUD operations
- ⏳ Real database integration for subjects/chapters/resources
- ⏳ File upload for study materials
- ⏳ User bookmarks and progress tracking
- ⏳ Search functionality
- ⏳ Legal pages (Terms, Privacy, etc.)

## License

MIT License - See LICENSE file for details
