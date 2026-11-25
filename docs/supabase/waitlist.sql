-- App Store launch waitlist for the website (mochiii.app).
-- Run once in the Supabase SQL editor of the project whose URL and key go into
-- WAITLIST_SUPABASE_URL / WAITLIST_SUPABASE_KEY on Vercel.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  constraint waitlist_email_format check (email = lower(email) and char_length(email) <= 254 and position('@' in email) > 1)
);

-- One row per address; the API inserts with ON CONFLICT (email) DO NOTHING.
create unique index if not exists waitlist_email_key on public.waitlist (email);

-- The website key may only INSERT. No SELECT, UPDATE or DELETE policy exists, so the list
-- can't be read or changed with the public key; read it from the dashboard or with the
-- service role.
alter table public.waitlist enable row level security;

drop policy if exists "Website can join the waitlist" on public.waitlist;
create policy "Website can join the waitlist"
  on public.waitlist
  for insert
  to anon
  with check (source = 'website');
