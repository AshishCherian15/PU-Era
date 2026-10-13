-- Migration 0005: Seed official textbook links
-- Run this in Supabase SQL Editor after 0004_add_profile_fields.sql

insert into public.textbooks (board, class_level, subject_name, medium, official_url, source_label, is_active) values
  -- 2nd PUC KTBS
  ('ktbs', 'puc2', 'Physics Part I & II',          'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc2', 'Chemistry Part I & II',         'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc2', 'Mathematics',                   'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc2', 'Biology',                       'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc2', 'Accountancy',                   'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc2', 'Business Studies',              'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc2', 'Economics',                     'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  -- 1st PUC KTBS
  ('ktbs', 'puc1', 'Physics',                       'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc1', 'Chemistry',                     'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc1', 'Mathematics',                   'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc1', 'Biology',                       'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc1', 'Accountancy',                   'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc1', 'Business Studies',              'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  ('ktbs', 'puc1', 'Economics',                     'en', 'https://ktbs.kar.nic.in', 'KTBS Official Portal', true),
  -- NCERT Class 12
  ('ncert', 'ncert12', 'Physics Part I & II',       'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert12', 'Chemistry Part I & II',     'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert12', 'Mathematics',               'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert12', 'Biology',                   'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert12', 'Accountancy Part I & II',   'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert12', 'Business Studies',          'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert12', 'Economics',                 'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  -- NCERT Class 11
  ('ncert', 'ncert11', 'Physics Part I & II',       'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert11', 'Chemistry Part I & II',     'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert11', 'Mathematics',               'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert11', 'Biology',                   'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert11', 'Accountancy',               'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert11', 'Business Studies',          'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true),
  ('ncert', 'ncert11', 'Economics',                 'en', 'https://ncert.nic.in/textbook.php', 'NCERT Official', true)
on conflict do nothing;
