-- Torres Contractor Solution — admin panel backend
-- Run once in Supabase → SQL Editor. Then add the admin email at the bottom.

-- Who can use /admin
create table if not exists public.admins (email text primary key);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'))
$$;

-- Site settings (one row): business info, editable texts, FAQ, minimum service
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Services & prices (data = Service object from src/data.ts)
create table if not exists public.services (
  id text primary key,
  data jsonb not null,
  sort int not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Portfolio "Trabajos realizados" (data = Project object from src/portfolio.ts)
create table if not exists public.projects (
  id text primary key,
  data jsonb not null,
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Requests sent from the website checkout
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'done')),
  data jsonb not null check (pg_column_size(data) < 20000)
);

alter table public.admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.service_requests enable row level security;

-- admins: a signed-in user can only see whether they themselves are an admin
drop policy if exists "admins see self" on public.admins;
create policy "admins see self" on public.admins for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- public read, admin write
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (true);
drop policy if exists "admin write settings" on public.site_settings;
create policy "admin write settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select using (active or public.is_admin());
drop policy if exists "admin write services" on public.services;
create policy "admin write services" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (published or public.is_admin());
drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- requests: anyone can send one, only admins can read / update / delete
drop policy if exists "anyone can send request" on public.service_requests;
create policy "anyone can send request" on public.service_requests for insert to anon, authenticated with check (status = 'new');
drop policy if exists "admin manage requests" on public.service_requests;
create policy "admin manage requests" on public.service_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Photo storage (public read, admin upload)
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ▼ Put the client's email here (the same one you create in Authentication → Users)
-- insert into public.admins (email) values ('cliente@ejemplo.com');
