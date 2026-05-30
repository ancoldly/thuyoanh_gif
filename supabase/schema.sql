create extension if not exists pgcrypto;

-- ========= TABLES =========
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  attendance_status text not null,
  guest_count int default 0,
  note text,
  created_at timestamp default now()
);

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  message text not null,
  emoji text,
  created_at timestamp default now()
);

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  tag text,
  frame_type text,
  sticker_data jsonb,
  layout_order int,
  created_at timestamp default now()
);

-- ========= RLS =========
alter table public.rsvps enable row level security;
alter table public.wishes enable row level security;
alter table public.album_photos enable row level security;

drop policy if exists "public insert rsvps" on public.rsvps;
drop policy if exists "public insert wishes" on public.wishes;
drop policy if exists "public read wishes" on public.wishes;
drop policy if exists "public read album" on public.album_photos;
drop policy if exists "owner insert album" on public.album_photos;
drop policy if exists "owner update album" on public.album_photos;
drop policy if exists "owner delete album" on public.album_photos;

create policy "public insert rsvps"
on public.rsvps
for insert
to anon, authenticated
with check (true);

create policy "public insert wishes"
on public.wishes
for insert
to anon, authenticated
with check (true);

create policy "public read wishes"
on public.wishes
for select
using (true);

create policy "public read album"
on public.album_photos
for select
using (true);

-- Owner account email mapped from username thuyoanh204
-- Username: thuyoanh204
-- Password: thuyoanh204@
-- Login email used by app: thuyoanh204@gmail.com
create policy "owner insert album"
on public.album_photos
for insert
to authenticated
with check (auth.jwt() ->> 'email' = 'thuyoanh204@gmail.com');

create policy "owner update album"
on public.album_photos
for update
to authenticated
using (auth.jwt() ->> 'email' = 'thuyoanh204@gmail.com')
with check (auth.jwt() ->> 'email' = 'thuyoanh204@gmail.com');

create policy "owner delete album"
on public.album_photos
for delete
to authenticated
using (auth.jwt() ->> 'email' = 'thuyoanh204@gmail.com');

-- ========= STORAGE =========
insert into storage.buckets (id, name, public)
values ('graduation-album', 'graduation-album', true)
on conflict (id) do nothing;

drop policy if exists "public read graduation album" on storage.objects;
drop policy if exists "owner write graduation album" on storage.objects;
drop policy if exists "owner update graduation album" on storage.objects;
drop policy if exists "owner delete graduation album" on storage.objects;

create policy "public read graduation album"
on storage.objects
for select
using (bucket_id = 'graduation-album');

create policy "owner write graduation album"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'graduation-album'
  and auth.jwt() ->> 'email' = 'thuyoanh204@gmail.com'
);

create policy "owner update graduation album"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'graduation-album'
  and auth.jwt() ->> 'email' = 'thuyoanh204@gmail.com'
)
with check (
  bucket_id = 'graduation-album'
  and auth.jwt() ->> 'email' = 'thuyoanh204@gmail.com'
);

create policy "owner delete graduation album"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'graduation-album'
  and auth.jwt() ->> 'email' = 'thuyoanh204@gmail.com'
);

-- ========= OWNER AUTH USER (SQL) =========
-- Run in Supabase SQL Editor as project owner.
do $$
declare
  new_user_id uuid := gen_random_uuid();
begin
  if not exists (select 1 from auth.users where email = 'thuyoanh204@gmail.com') then
    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_sso_user,
      is_anonymous
    )
    values (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'thuyoanh204@gmail.com',
      crypt('thuyoanh204@', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"username":"thuyoanh204"}'::jsonb,
      false,
      false
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      created_at,
      updated_at
    )
    values (
      gen_random_uuid(),
      new_user_id,
      jsonb_build_object(
        'sub', new_user_id::text,
        'email', 'thuyoanh204@gmail.com'
      ),
      'email',
      new_user_id::text,
      now(),
      now()
    );
  end if;
end $$;

-- Allow owner to read RSVP list
-- Owner email: thuyoanh204@gmail.com
drop policy if exists "owner read rsvps" on public.rsvps;
create policy "owner read rsvps"
on public.rsvps
for select
to authenticated
using (auth.jwt() ->> 'email' = 'thuyoanh204@gmail.com');

