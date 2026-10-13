-- Add college_name and guardian_email columns to profiles table
alter table public.profiles
  add column if not exists college_name text,
  add column if not exists guardian_email text;

-- Add index for faster college-based queries
create index if not exists idx_profiles_college_name on public.profiles(college_name);
