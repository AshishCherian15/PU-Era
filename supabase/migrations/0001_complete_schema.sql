-- PU Era Full Database Schema
-- Migration 0001: Core tables + RLS + indexes
-- Migration 0002: Auth, notifications, guardian consent, admin comms

-- ============================================
-- EXTENSIONS
-- ============================================
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

-- ============================================
-- ENUMS (as check constraints for Supabase compatibility)
-- ============================================

-- ============================================
-- ADMIN USERS (no student RLS — service-role only)
-- ============================================
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('owner','admin','editor','moderator','support')),
  status     text not null default 'active' check (status in ('active','suspended','removed')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);
-- No RLS policies — service-role only access

-- ============================================
-- PROFILES
-- ============================================
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text not null,
  email            text not null,
  class_level      text check (class_level in ('puc1','puc2','ncert11','ncert12')),
  stream           text check (stream in ('science','commerce','arts','common')),
  medium           text check (medium in ('en','kn')) default 'en',
  board_focus      text check (board_focus in ('ktbs','ncert')),
  college_name     text,
  guardian_email   text,
  status           text not null default 'active' check (status in ('active','warned','suspended','banned')),
  is_minor         boolean not null default true,
  email_verified   boolean not null default false,
  last_login_at    timestamptz,
  login_count      int not null default 0,
  created_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id and deleted_at is null);

create policy "Users can update limited own profile fields" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admin read via is_admin()
create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin(array['owner','admin','moderator','support']));

create policy "Admins can update profiles" on public.profiles
  for update using (public.is_admin(array['owner','admin']));

-- ============================================
-- CONSENTS
-- ============================================
create table if not exists public.consents (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  type                text not null check (type in ('tos','privacy','email_updates','push','guardian')),
  version             text not null,
  granted_at          timestamptz not null default now(),
  withdrawn_at        timestamptz,
  guardian_email      text,
  verification_method text check (verification_method in ('link','otp')),
  recorded_ip_hash    text
);

alter table public.consents enable row level security;

create policy "Users can insert own consents" on public.consents
  for insert with check (auth.uid() = user_id);

create policy "Users can read own consents" on public.consents
  for select using (auth.uid() = user_id);

create policy "Users can withdraw own consents" on public.consents
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================
-- GUARDIAN CONSENTS
-- ============================================
create table if not exists public.guardian_consents (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references public.profiles(id) on delete cascade,
  guardian_email  text not null,
  verified_at     timestamptz,
  method          text check (method in ('otp','link')),
  policy_version  text not null,
  token_hash      text,
  expires_at      timestamptz not null,
  consumed_at     timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.guardian_consents enable row level security;

create policy "Users can view own guardian consent" on public.guardian_consents
  for select using (auth.uid() = student_id);

create policy "Admins can view guardian consents" on public.guardian_consents
  for select using (public.is_admin(array['owner','admin']));

-- ============================================
-- SUSPENSIONS
-- ============================================
create table if not exists public.suspensions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  reason     text not null,
  starts_at  timestamptz not null default now(),
  ends_at    timestamptz,
  lifted_at  timestamptz,
  issued_by  uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.suspensions enable row level security;

create policy "Users can view own suspensions" on public.suspensions
  for select using (auth.uid() = user_id);

create policy "Admins can manage suspensions" on public.suspensions
  for all using (public.is_admin(array['owner','admin','moderator']));

-- ============================================
-- WARNINGS
-- ============================================
create table if not exists public.warnings (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  issued_by        uuid references auth.users(id),
  template         text,
  severity         text not null check (severity in ('notice','warning','final')),
  message          text not null,
  requires_ack     boolean not null default false,
  acknowledged_at  timestamptz,
  created_at       timestamptz not null default now()
);

alter table public.warnings enable row level security;

create policy "Users can view own warnings" on public.warnings
  for select using (auth.uid() = user_id);

create policy "Users can acknowledge own warning" on public.warnings
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can manage warnings" on public.warnings
  for all using (public.is_admin(array['owner','admin','moderator']));

-- ============================================
-- NOTIFICATION PREFERENCES
-- ============================================
create table if not exists public.notif_preferences (
  user_id          uuid primary key references public.profiles(id) on delete cascade,
  email_optin      boolean not null default true,
  push_optin       boolean not null default false,
  popup_mode       text not null default 'once' check (popup_mode in ('once','every_visit','never')),
  digest_frequency text not null default 'weekly' check (digest_frequency in ('daily','weekly','never')),
  quiet_hours      jsonb,
  updated_at       timestamptz not null default now()
);

alter table public.notif_preferences enable row level security;

create policy "Users can manage own notif prefs" on public.notif_preferences
  for all using (auth.uid() = user_id);

-- ============================================
-- SUBJECTS
-- ============================================
create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  name_kn     text,
  class_level text not null check (class_level in ('puc1','puc2','ncert11','ncert12')),
  stream      text not null check (stream in ('science','commerce','arts','common')),
  board       text not null check (board in ('ktbs','ncert')),
  has_lab     boolean not null default false,
  sort_order  int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.subjects enable row level security;

create policy "Anyone can read active subjects" on public.subjects
  for select using (active = true);

create policy "Admins can manage subjects" on public.subjects
  for all using (public.is_admin(array['owner','admin','editor']));

-- ============================================
-- CHAPTERS
-- ============================================
create table if not exists public.chapters (
  id               uuid primary key default gen_random_uuid(),
  subject_id       uuid not null references public.subjects(id) on delete cascade,
  number           int not null,
  slug             text not null,
  title            text not null,
  title_kn         text,
  syllabus_version text,
  description      text,
  keywords         text[],
  status           text not null default 'active' check (status in ('active','inactive')),
  created_at       timestamptz not null default now(),
  unique (subject_id, number),
  unique (subject_id, slug)
);

alter table public.chapters enable row level security;

create policy "Anyone can read active chapters" on public.chapters
  for select using (status = 'active');

create policy "Admins can manage chapters" on public.chapters
  for all using (public.is_admin(array['owner','admin','editor']));

-- ============================================
-- RESOURCES
-- ============================================
create table if not exists public.resources (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  title                text not null,
  description          text check (char_length(description) <= 400),
  type                 text not null check (type in ('chapter_notes','short_notes','summary','important_qa','formula_sheet','revision_pdf','project_guide','worked_examples','lab_guide','lab_video')),
  subject_id           uuid not null references public.subjects(id),
  chapter_id           uuid references public.chapters(id),
  medium               text not null check (medium in ('en','kn')) default 'en',
  academic_year        text,
  source_type          text not null check (source_type in ('own','external_link','permissioned')),
  licence              text not null check (licence in ('own','ncert_econtent','written_permission','ktbs_permission','cc_by','govt')),
  permission_ref       text,
  permission_proof_path text,
  file_path            text,
  external_url         text,
  allow_view           boolean not null default true,
  allow_download       boolean not null default false,
  status               text not null default 'draft' check (status in ('draft','published','scheduled','archived')),
  published_at         timestamptz,
  verified_at          timestamptz,
  verified_by          uuid references auth.users(id),
  views                int not null default 0,
  downloads            int not null default 0,
  created_by           uuid references auth.users(id),
  created_at           timestamptz not null default now(),
  deleted_at           timestamptz,
  search               tsvector generated always as (
    to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,''))
  ) stored,
  constraint file_or_url check (file_path is not null or external_url is not null),
  constraint provenance_required check (
    source_type = 'own'
    or permission_ref is not null
    or licence in ('ncert_econtent','govt','cc_by')
  ),
  constraint no_download_of_links check (not (source_type = 'external_link' and allow_download))
);

alter table public.resources enable row level security;

create policy "Anyone can read published resources" on public.resources
  for select using (status = 'published' and deleted_at is null);

create policy "Admins can manage resources" on public.resources
  for all using (public.is_admin(array['owner','admin','editor']));

-- ============================================
-- RESOURCE PROVENANCE
-- ============================================
create table if not exists public.resource_provenance (
  id          uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  source_type text not null,
  licence     text not null,
  reference   text,
  proof_path  text,
  added_by    uuid references auth.users(id),
  added_at    timestamptz not null default now()
);

alter table public.resource_provenance enable row level security;
-- No student policies — admin/service only

create policy "Admins can manage provenance" on public.resource_provenance
  for all using (public.is_admin(array['owner','admin']));

-- ============================================
-- TAKEDOWNS
-- ============================================
create table if not exists public.takedowns (
  id            uuid primary key default gen_random_uuid(),
  resource_id   uuid references public.resources(id),
  complainant   text not null,
  basis         text not null,
  received_at   timestamptz not null default now(),
  action_taken  text,
  taken_down_at timestamptz,
  handled_by    uuid references auth.users(id)
);

alter table public.takedowns enable row level security;

create policy "Admins can manage takedowns" on public.takedowns
  for all using (public.is_admin(array['owner','admin']));

-- ============================================
-- TEXTBOOKS (official links directory)
-- ============================================
create table if not exists public.textbooks (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid references public.subjects(id),
  board         text not null check (board in ('ktbs','ncert')),
  class_level   text not null check (class_level in ('puc1','puc2','ncert11','ncert12')),
  subject_name  text not null,
  medium        text not null check (medium in ('en','kn')),
  official_url  text not null,
  source_label  text not null default 'Official',
  last_checked  timestamptz,
  is_active     boolean not null default true,
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.textbooks enable row level security;

create policy "Anyone can read active textbooks" on public.textbooks
  for select using (is_active = true);

create policy "Admins can manage textbooks" on public.textbooks
  for all using (public.is_admin(array['owner','admin','editor']));

-- ============================================
-- LAB EXPERIMENTS
-- ============================================
create table if not exists public.lab_experiments (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid not null references public.subjects(id),
  slug          text not null unique,
  title         text not null,
  aim           text,
  apparatus     text,
  theory        text,
  procedure     text,
  observations  text,
  result        text,
  precautions   text,
  viva_qa       jsonb,
  related_chapter_id uuid references public.chapters(id),
  status        text not null default 'draft' check (status in ('draft','published','archived')),
  created_at    timestamptz not null default now()
);

alter table public.lab_experiments enable row level security;

create policy "Anyone can read published experiments" on public.lab_experiments
  for select using (status = 'published');

create policy "Admins can manage experiments" on public.lab_experiments
  for all using (public.is_admin(array['owner','admin','editor']));

-- ============================================
-- BOOKMARKS
-- ============================================
create table if not exists public.bookmarks (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  folder      text,
  created_at  timestamptz not null default now(),
  primary key (user_id, resource_id)
);

alter table public.bookmarks enable row level security;

create policy "Users can manage own bookmarks" on public.bookmarks
  for all using (auth.uid() = user_id);

-- ============================================
-- PROGRESS
-- ============================================
create table if not exists public.progress (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  done_at    timestamptz not null default now(),
  primary key (user_id, chapter_id)
);

alter table public.progress enable row level security;

create policy "Users can manage own progress" on public.progress
  for all using (auth.uid() = user_id);

-- ============================================
-- RESOURCE DOWNLOADS
-- ============================================
create table if not exists public.resource_downloads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id),
  resource_id uuid not null references public.resources(id),
  ip_hash     text,
  at          timestamptz not null default now()
);

alter table public.resource_downloads enable row level security;

create policy "Users can view own downloads" on public.resource_downloads
  for select using (auth.uid() = user_id);

create policy "Admins can view all downloads" on public.resource_downloads
  for select using (public.is_admin(array['owner','admin']));

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can manage own notifications" on public.notifications
  for all using (auth.uid() = user_id);

-- ============================================
-- REQUESTS
-- ============================================
create table if not exists public.requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  subject_id    uuid references public.subjects(id),
  chapter_id    uuid references public.chapters(id),
  resource_type text check (resource_type in ('chapter_notes','short_notes','summary','important_qa','formula_sheet','revision_pdf','project_guide','worked_examples','lab_guide','lab_video')),
  description   text not null check (char_length(description) between 20 and 500),
  status        text not null default 'submitted' check (status in ('submitted','in_review','approved','in_progress','completed','declined')),
  priority      text check (priority in ('low','medium','high')),
  admin_reply   text,
  internal_note text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.requests enable row level security;

create policy "Users can manage own requests" on public.requests
  for all using (auth.uid() = user_id);

create policy "Admins can manage all requests" on public.requests
  for all using (public.is_admin(array['owner','admin','moderator','support']));

-- ============================================
-- SUGGESTIONS
-- ============================================
create table if not exists public.suggestions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  body        text not null,
  category    text,
  status      text not null default 'new' check (status in ('new','reviewing','planned','in_progress','implemented','declined')),
  upvotes     int not null default 0,
  admin_reply text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.suggestions enable row level security;

create policy "Users can manage own suggestions" on public.suggestions
  for all using (auth.uid() = user_id);

create policy "Anyone can read suggestions" on public.suggestions
  for select using (true);

create policy "Admins can manage all suggestions" on public.suggestions
  for all using (public.is_admin(array['owner','admin','moderator']));

-- ============================================
-- FEEDBACK
-- ============================================
create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  type        text not null check (type in ('general','broken_link','wrong_chapter','content_error','suggestion')),
  rating      int check (rating between 1 and 5),
  message     text not null check (char_length(message) between 10 and 1000),
  page_url    text,
  status      text not null default 'new' check (status in ('new','acknowledged','investigating','resolved','closed')),
  handled_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy "Users can insert feedback" on public.feedback
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "Users can read own feedback" on public.feedback
  for select using (auth.uid() = user_id);

create policy "Admins can manage feedback" on public.feedback
  for all using (public.is_admin(array['owner','admin','moderator','support']));

-- ============================================
-- CONTACT MESSAGES
-- ============================================
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  status      text not null default 'new' check (status in ('new','acknowledged','replied','closed')),
  replied_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can insert contact messages" on public.contact_messages
  for insert with check (true);

create policy "Admins can manage contact messages" on public.contact_messages
  for all using (public.is_admin(array['owner','admin','support']));

-- ============================================
-- ANNOUNCEMENTS
-- ============================================
create table if not exists public.announcements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text not null,
  icon          text,
  accent        text,
  display_style text not null default 'banner' check (display_style in ('popup','banner','both','page_only')),
  audience      jsonb,
  priority      text not null default 'normal' check (priority in ('normal','important','urgent')),
  popup_policy  text not null default 'once' check (popup_policy in ('once','every_visit','never')),
  action_label  text,
  action_url    text,
  publish_at    timestamptz not null default now(),
  expires_at    timestamptz,
  status        text not null default 'draft' check (status in ('draft','scheduled','active','expired','archived')),
  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "Anyone can read live announcements" on public.announcements
  for select using (
    status = 'active'
    and publish_at <= now()
    and (expires_at is null or expires_at > now())
  );

create policy "Admins can manage announcements" on public.announcements
  for all using (public.is_admin(array['owner','admin','editor']));

-- ============================================
-- ANNOUNCEMENT DISMISSALS
-- ============================================
create table if not exists public.announcement_dismissals (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  dismissed_at    timestamptz not null default now(),
  primary key (announcement_id, user_id)
);

alter table public.announcement_dismissals enable row level security;

create policy "Users can manage own dismissals" on public.announcement_dismissals
  for all using (auth.uid() = user_id);

-- ============================================
-- PAGES (CMS for legal/about pages)
-- ============================================
create table if not exists public.pages (
  slug         text primary key,
  title        text not null,
  body         text not null,
  version      text not null default '1.0',
  published_at timestamptz not null default now(),
  updated_by   uuid references auth.users(id),
  change_note  text
);

alter table public.pages enable row level security;

create policy "Anyone can read pages" on public.pages
  for select using (true);

create policy "Admins can manage pages" on public.pages
  for all using (public.is_admin(array['owner','admin']));

-- ============================================
-- AUDIT LOGS
-- ============================================
create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_admin uuid references auth.users(id),
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  before      jsonb,
  after       jsonb,
  reason      text,
  ip_hash     text,
  at          timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

create policy "Admins can view audit logs" on public.audit_logs
  for select using (public.is_admin(array['owner','admin']));

-- ============================================
-- SEARCH LOGS
-- ============================================
create table if not exists public.search_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  query         text not null,
  results_count int not null default 0,
  at            timestamptz not null default now()
);

alter table public.search_logs enable row level security;

create policy "Admins can view search logs" on public.search_logs
  for select using (public.is_admin(array['owner','admin']));

-- ============================================
-- SETTINGS
-- ============================================
create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "Anyone can read safe settings" on public.settings
  for select using (key in ('site_name','site_description','registration_open','maintenance_mode','announcement_popup_enabled'));

create policy "Admins can manage settings" on public.settings
  for all using (public.is_admin(array['owner','admin']));

-- ============================================
-- BROKEN LINK CHECKS
-- ============================================
create table if not exists public.broken_link_checks (
  id                   uuid primary key default gen_random_uuid(),
  resource_id          uuid references public.resources(id) on delete cascade,
  url                  text not null,
  http_status          int,
  checked_at           timestamptz not null default now(),
  consecutive_failures int not null default 0
);

alter table public.broken_link_checks enable row level security;

create policy "Admins can view link checks" on public.broken_link_checks
  for select using (public.is_admin(array['owner','admin']));

-- ============================================
-- BACKUP LOGS
-- ============================================
create table if not exists public.backup_logs (
  id                uuid primary key default gen_random_uuid(),
  type              text not null check (type in ('full','incremental','restore_test')),
  started_at        timestamptz not null,
  finished_at       timestamptz,
  result            text check (result in ('success','failed','partial')),
  restore_tested_at timestamptz,
  notes             text
);

alter table public.backup_logs enable row level security;

create policy "Admins can view backup logs" on public.backup_logs
  for select using (public.is_admin(array['owner','admin']));

-- ============================================
-- HELPER FUNCTION: is_admin
-- ============================================
create or replace function public.is_admin(roles text[] default array['owner','admin'])
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid())
    and a.status = 'active'
    and a.role = any(roles)
  );
$$;

-- ============================================
-- FUNCTION: touch last login
-- ============================================
create or replace function public.fn_touch_last_login()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles
  set last_login_at = now(),
      login_count = login_count + 1
  where id = new.user_id;
  return new;
end;
$$;

-- ============================================
-- FUNCTION: update updated_at
-- ============================================
create or replace function public.fn_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_requests_updated_at
  before update on public.requests
  for each row execute function public.fn_set_updated_at();

create trigger set_suggestions_updated_at
  before update on public.suggestions
  for each row execute function public.fn_set_updated_at();

-- ============================================
-- INDEXES
-- ============================================

-- Resources discovery
create index if not exists resources_pub_idx on public.resources (subject_id, chapter_id)
  where status='published' and deleted_at is null;
create index if not exists resources_subject_medium_idx on public.resources (subject_id, medium)
  where status='published' and deleted_at is null;
create index if not exists resources_search_idx on public.resources using gin (search);
create index if not exists resources_title_trgm on public.resources using gin (title gin_trgm_ops);

-- Chapters
create index if not exists chapters_subject_idx on public.chapters (subject_id, number);

-- Student data
create index if not exists bookmarks_user_idx on public.bookmarks (user_id, created_at desc);
create index if not exists notifications_unread on public.notifications (user_id, read_at) where read_at is null;
create index if not exists downloads_user_idx on public.resource_downloads (user_id, at desc);
create index if not exists downloads_res_idx on public.resource_downloads (resource_id, at desc);

-- Admin & ops
create index if not exists profiles_lastlogin_idx on public.profiles (last_login_at desc nulls last);
create index if not exists profiles_status_idx on public.profiles (status) where deleted_at is null;
create index if not exists audit_at_idx on public.audit_logs (at desc);
create index if not exists announcements_live_idx on public.announcements (status, expires_at)
  where status in ('active','scheduled');
create index if not exists search_failed_idx on public.search_logs (at desc) where results_count = 0;
create index if not exists warnings_user_idx on public.warnings (user_id, created_at desc);

-- ============================================
-- DEFAULT SETTINGS SEED
-- ============================================
insert into public.settings (key, value) values
  ('site_name', '"PU Era"'),
  ('site_description', '"Free Karnataka PUC & NCERT study materials — notes, lab guides, textbooks"'),
  ('registration_open', 'true'),
  ('maintenance_mode', 'false'),
  ('announcement_popup_enabled', 'true')
on conflict (key) do nothing;
