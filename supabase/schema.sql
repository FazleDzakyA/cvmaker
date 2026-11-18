-- ========================================================
-- CVGENIE SUPABASE DATABASE SCHEMA
-- Profiles & Resumes Table with Row Level Security (RLS)
-- ========================================================

-- 1. Create Profiles Table (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default 'Student User',
  email text not null,
  avatar_url text,
  job_title text default 'Software Developer',
  institution text default 'SMK Negeri 7 Semarang',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- 2. Create Resumes / CVs Table
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null default 'Professional Student CV',
  template_id text not null default 'minimalist',
  accent_color text not null default '#6685FF',
  ats_score integer default 98,
  content jsonb not null,
  is_public boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on resumes
alter table public.resumes enable row level security;

-- Resumes Policies
create policy "Users can view own resumes" 
  on public.resumes for select 
  using (auth.uid() = user_id or is_public = true);

create policy "Users can create own resumes" 
  on public.resumes for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own resumes" 
  on public.resumes for update 
  using (auth.uid() = user_id);

create policy "Users can delete own resumes" 
  on public.resumes for delete 
  using (auth.uid() = user_id);

-- 3. Automatic Profile Creation Trigger on Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student User'),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Index for fast user query
create index if not exists resumes_user_id_idx on public.resumes (user_id);
create index if not exists resumes_updated_at_idx on public.resumes (updated_at desc);
