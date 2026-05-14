create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  profile_slug text unique,
  display_name text,
  bio text,
  avatar_url text,
  background_url text default 'linear-gradient(125deg, #000000 0%, #070707 46%, #111111 62%, #000000 100%)',
  background_type text default 'gradient',
  music_url text,
  music_autoplay boolean default false,
  music_volume numeric default 0.25,
  music_title text,
  music_artist text,
  theme_preset text default 'premium-black-glass',
  card_preset text default 'black-glass',
  button_preset text default 'black-glass',
  font_family text default 'Inter',
  accent_color text default '#d7b46a',
  text_color text default '#f5f5f0',
  card_color text default '#080808',
  button_color text default '#d7b46a',
  card_opacity numeric default 0.58,
  overlay_opacity numeric default 0.55,
  blur_amount int default 24,
  background_blur int default 0,
  background_brightness int default 80,
  background_saturation int default 100,
  glow_intensity int default 24,
  border_radius int default 28,
  animated_title boolean default false,
  show_views boolean default true,
  show_badges boolean default true,
  show_music_player boolean default true,
  show_discord_widget boolean default false,
  discord_mode text default 'lanyard',
  discord_user_id text,
  discord_username text,
  discord_display_name text,
  discord_avatar_url text,
  discord_status_text text,
  show_nitro_style_badge boolean default false,
  discord_badges jsonb default '[]'::jsonb,
  discord_use_manual_fallback boolean default true,
  discord_hide_if_empty boolean default true,
  cursor_enabled boolean default false,
  cursor_style text default 'soft-glow',
  cursor_color text default '#ffffff',
  cursor_size int default 22,
  cursor_opacity numeric default 0.55,
  cursor_trail_enabled boolean default true,
  cursor_trail_length int default 8,
  cursor_blur int default 18,
  cursor_blend_mode text default 'screen',
  card_mouse_parallax boolean default true,
  background_mouse_parallax boolean default false,
  particles_enabled boolean default false,
  glow_enabled boolean default true,
  seo_title text,
  seo_description text,
  og_image_url text,
  disabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,24}$'),
  constraint profiles_profile_slug_format check (profile_slug is null or profile_slug ~ '^[a-z0-9_-]{3,30}$'),
  constraint profiles_background_type check (background_type in ('gradient', 'image', 'gif', 'video')),
  constraint profiles_discord_mode check (discord_mode in ('manual', 'lanyard')),
  constraint profiles_cursor_style check (cursor_style in ('soft-glow', 'ring', 'dot-ring', 'spotlight', 'smoke', 'minimal')),
  constraint profiles_cursor_blend_mode check (cursor_blend_mode in ('normal', 'screen', 'lighten', 'difference'))
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  icon text,
  button_style text default 'inherit',
  sort_order int default 0,
  is_visible boolean default true,
  created_at timestamptz default now(),
  constraint links_safe_url check (url !~* '^\s*(javascript|data|vbscript):')
);

create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  platform text not null,
  url text not null,
  sort_order int default 0,
  is_visible boolean default true,
  constraint socials_safe_url check (url !~* '^\s*(javascript|data|vbscript):')
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon_url text,
  color text default '#ffffff',
  created_at timestamptz default now()
);

create table if not exists public.profile_badges (
  profile_id uuid references public.profiles(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  primary key (profile_id, badge_id)
);

create table if not exists public.profile_views (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  visitor_hash text,
  user_agent text,
  referrer text,
  device text,
  browser text,
  created_at timestamptz default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.reserved_usernames (
  username text primary key,
  reason text,
  created_at timestamptz default now()
);

create index if not exists profiles_username_idx on public.profiles(username);
create index if not exists profiles_profile_slug_idx on public.profiles(profile_slug);
create index if not exists links_profile_id_idx on public.links(profile_id);
create index if not exists socials_profile_id_idx on public.socials(profile_id);
create index if not exists profile_views_profile_id_idx on public.profile_views(profile_id);
create index if not exists profile_views_created_at_idx on public.profile_views(created_at);
create index if not exists admins_email_idx on public.admins(email);

insert into public.reserved_usernames (username, reason) values
  ('admin', 'system'), ('dashboard', 'system'), ('login', 'system'), ('register', 'system'),
  ('api', 'system'), ('settings', 'system'), ('support', 'system'), ('help', 'system'),
  ('terms', 'system'), ('privacy', 'system'), ('netlify', 'system'), ('voidbio', 'system'),
  ('assets', 'system'), ('static', 'system'), ('public', 'system'), ('u', 'system')
on conflict (username) do nothing;

create or replace function public.is_admin(check_user uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(select 1 from public.admins where user_id = check_user);
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.prevent_reserved_username()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.username = lower(new.username);
  if exists(select 1 from public.reserved_usernames where username = new.username) then
    raise exception 'username is reserved';
  end if;
  if new.profile_slug is not null then
    new.profile_slug = lower(new.profile_slug);
    if exists(select 1 from public.reserved_usernames where username = new.profile_slug) then
      raise exception 'profile slug is reserved';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_reserved_username on public.profiles;
create trigger profiles_prevent_reserved_username
before insert or update of username, profile_slug on public.profiles
for each row execute function public.prevent_reserved_username();

alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.socials enable row level security;
alter table public.badges enable row level security;
alter table public.profile_badges enable row level security;
alter table public.profile_views enable row level security;
alter table public.admins enable row level security;
alter table public.reserved_usernames enable row level security;

create policy "public can read enabled profiles"
on public.profiles for select
using (disabled = false or auth.uid() = id or public.is_admin());

create policy "users insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "users update own profile"
on public.profiles for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "users delete own profile"
on public.profiles for delete
using (auth.uid() = id or public.is_admin());

create policy "public can read visible links for enabled profiles"
on public.links for select
using (
  is_visible = true and exists (
    select 1 from public.profiles p where p.id = profile_id and p.disabled = false
  )
  or exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid())
  or public.is_admin()
);

create policy "owners manage links"
on public.links for all
using (exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid()) or public.is_admin())
with check (exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid()) or public.is_admin());

create policy "public can read visible socials for enabled profiles"
on public.socials for select
using (
  is_visible = true and exists (
    select 1 from public.profiles p where p.id = profile_id and p.disabled = false
  )
  or exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid())
  or public.is_admin()
);

create policy "owners manage socials"
on public.socials for all
using (exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid()) or public.is_admin())
with check (exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid()) or public.is_admin());

create policy "public can read badges for enabled profiles"
on public.badges for select
using (
  exists (
    select 1
    from public.profile_badges pb
    join public.profiles p on p.id = pb.profile_id
    where pb.badge_id = badges.id and p.disabled = false
  )
  or public.is_admin()
);

create policy "admins manage badges"
on public.badges for all
using (public.is_admin())
with check (public.is_admin());

create policy "public can read profile badges for enabled profiles"
on public.profile_badges for select
using (
  exists (select 1 from public.profiles p where p.id = profile_id and p.disabled = false)
  or public.is_admin()
);

create policy "admins manage profile badges"
on public.profile_badges for all
using (public.is_admin())
with check (public.is_admin());

create policy "public can insert profile views"
on public.profile_views for insert
with check (
  exists (select 1 from public.profiles p where p.id = profile_id and p.disabled = false)
);

create policy "profile owner can read own analytics"
on public.profile_views for select
using (
  exists (select 1 from public.profiles p where p.id = profile_id and p.id = auth.uid())
  or public.is_admin()
);

create policy "admins can delete profile views"
on public.profile_views for delete
using (public.is_admin());

create policy "admins can read admins"
on public.admins for select
using (public.is_admin() or auth.uid() = user_id);

create policy "admins manage admins"
on public.admins for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage reserved usernames"
on public.reserved_usernames for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']),
  ('backgrounds', 'backgrounds', true, 15728640, array['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']),
  ('music', 'music', true, 20971520, array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public can read profile media"
on storage.objects for select
using (bucket_id in ('avatars', 'backgrounds', 'music'));

create policy "users upload own profile media"
on storage.objects for insert
with check (
  bucket_id in ('avatars', 'backgrounds', 'music')
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "users update own profile media"
on storage.objects for update
using (
  bucket_id in ('avatars', 'backgrounds', 'music')
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id in ('avatars', 'backgrounds', 'music')
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "users delete own profile media"
on storage.objects for delete
using (
  bucket_id in ('avatars', 'backgrounds', 'music')
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);
