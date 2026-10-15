create extension if not exists pgcrypto;

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  email text,
  phone text,
  staff_number text not null unique,
  department text,
  photo_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.skyline_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;
alter table public.skyline_admins enable row level security;

drop policy if exists "Admins can verify their own access" on public.skyline_admins;
create policy "Admins can verify their own access"
  on public.skyline_admins for select to authenticated
  using (user_id = (select auth.uid()));

do $$
declare
  configured_admin_id uuid;
begin
  select id into configured_admin_id
  from auth.users
  where lower(email) = lower('fkunzy@gmail.com');

  if configured_admin_id is null then
    raise exception 'No Supabase Auth user found for fkunzy@gmail.com. Update the admin email in this SQL to match supabase-config.js.';
  end if;

  insert into public.skyline_admins (user_id)
  values (configured_admin_id)
  on conflict (user_id) do nothing;
end
$$;

drop policy if exists "Authenticated admins can read staff" on public.staff;
drop policy if exists "Authenticated admins can add staff" on public.staff;
drop policy if exists "Authenticated admins can update staff" on public.staff;
drop policy if exists "Authenticated admins can remove staff" on public.staff;

create policy "Authenticated admins can read staff"
  on public.staff for select to authenticated
  using (exists (select 1 from public.skyline_admins where user_id = (select auth.uid())));
create policy "Authenticated admins can add staff"
  on public.staff for insert to authenticated
  with check (exists (select 1 from public.skyline_admins where user_id = (select auth.uid())));
create policy "Authenticated admins can update staff"
  on public.staff for update to authenticated
  using (exists (select 1 from public.skyline_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.skyline_admins where user_id = (select auth.uid())));
create policy "Authenticated admins can remove staff"
  on public.staff for delete to authenticated
  using (exists (select 1 from public.skyline_admins where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('staff-photos', 'staff-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated admins can read staff photos" on storage.objects;
drop policy if exists "Authenticated admins can upload staff photos" on storage.objects;
drop policy if exists "Authenticated admins can update staff photos" on storage.objects;
drop policy if exists "Authenticated admins can remove staff photos" on storage.objects;

create policy "Authenticated admins can read staff photos"
  on storage.objects for select to authenticated
  using (bucket_id = 'staff-photos' and exists (select 1 from public.skyline_admins where user_id = (select auth.uid())));
create policy "Authenticated admins can upload staff photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'staff-photos' and exists (select 1 from public.skyline_admins where user_id = (select auth.uid())));
create policy "Authenticated admins can update staff photos"
  on storage.objects for update to authenticated
  using (bucket_id = 'staff-photos' and exists (select 1 from public.skyline_admins where user_id = (select auth.uid())))
  with check (bucket_id = 'staff-photos' and exists (select 1 from public.skyline_admins where user_id = (select auth.uid())));
create policy "Authenticated admins can remove staff photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'staff-photos' and exists (select 1 from public.skyline_admins where user_id = (select auth.uid())));
