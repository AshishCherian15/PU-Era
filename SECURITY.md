# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest (main branch) | ✅ Yes |
| Older branches | ❌ No |

Only the latest code on the `main` branch receives security fixes.

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in PU Era, report it privately:

**Email:** legal@puera.in  
**Subject line:** `[SECURITY] Brief description`

Include in your report:
- A clear description of the vulnerability
- Steps to reproduce it
- The potential impact (what an attacker could do)
- Your suggested fix (optional but appreciated)

### What happens next
| Timeframe | Action |
|---|---|
| Within 48 hours | We acknowledge receipt of your report |
| Within 7 days | We assess severity and confirm whether it is a valid vulnerability |
| Within 30 days | We release a fix (critical issues patched faster) |
| After fix is live | We credit you in the release notes (if you want) |

We do not currently run a bug bounty programme, but we genuinely appreciate responsible disclosure.

---

## Scope

### In scope
- Authentication bypass (student or admin)
- Privilege escalation (student accessing admin routes)
- SQL injection or RLS bypass in Supabase queries
- Exposure of `SUPABASE_SERVICE_ROLE_KEY` or other secrets
- Cross-site scripting (XSS) in user-generated content
- Insecure direct object references (accessing another user's data)
- CSRF on state-changing API routes
- Exposure of personally identifiable information (PII) of students

### Out of scope
- Bugs in third-party services (Supabase, Google Drive, Vercel)
- Denial of service attacks
- Social engineering attacks
- Issues that require physical access to a device
- Theoretical vulnerabilities with no practical exploit path

---

## Security Architecture

Key security decisions made in this project:

- **Row Level Security (RLS)** is enabled on all Supabase tables
- **Admin session** uses a separate httpOnly cookie — completely isolated from student Supabase Auth sessions
- **Service-role key** (`SUPABASE_SERVICE_ROLE_KEY`) is only used server-side in `lib/supabase/admin.ts` — never exposed to the browser
- **No tracking cookies** — only a single Supabase Auth session cookie is set
- **DPDP Act 2023 compliance** — guardian consent required for users under 18
- **Content provenance** — every resource records source type, licence, and permission reference before publishing
- **DMCA takedowns** — 48-hour response SLA enforced via admin queue

---

## Dependency Security

Dependencies are managed via `npm`. To audit for known vulnerabilities:

```bash
npm audit
```

We aim to keep all dependencies up to date. If you notice an outdated dependency with a known CVE, please report it via the email above.
