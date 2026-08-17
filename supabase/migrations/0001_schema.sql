-- LUMINA — schema inicial
-- Rode este arquivo inteiro no SQL Editor do Supabase (Dashboard > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- =========================================
-- PERFIS E ADMINISTRADORES
-- =========================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Dados públicos do cliente, espelhando auth.users.';

-- Presença nesta tabela = é administrador. Sem cadastro público:
-- inserir manualmente via SQL Editor ou Table Editor depois que a pessoa
-- já tiver uma conta em auth.users.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is 'Contas autorizadas a acessar /admin. Provisionar manualmente.';

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- Cria automaticamente um profile quando um novo usuário se cadastra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================
-- CATÁLOGO
-- =========================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  image text,
  "order" int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  reference text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null check (price >= 0),
  promo_price numeric(10,2) check (promo_price is null or promo_price >= 0),
  description text,
  composition text,
  is_new boolean not null default false,
  is_featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(active);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  position int not null default 0
);

create index if not exists product_images_product_id_idx on public.product_images(product_id);

create table if not exists public.product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  hex text not null,
  position int not null default 0
);

create index if not exists product_colors_product_id_idx on public.product_colors(product_id);

create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  position int not null default 0
);

create index if not exists product_sizes_product_id_idx on public.product_sizes(product_id);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  color_id uuid not null references public.product_colors(id) on delete cascade,
  size_id uuid not null references public.product_sizes(id) on delete cascade,
  available boolean not null default true,
  stock int not null default 0,
  unique (color_id, size_id)
);

create index if not exists product_variants_product_id_idx on public.product_variants(product_id);

-- =========================================
-- FAVORITOS
-- =========================================

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists favorites_user_id_idx on public.favorites(user_id);

-- =========================================
-- CONFIGURAÇÕES DA LOJA (linha única)
-- =========================================

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  name text not null default 'LUMINA',
  tagline text not null default 'Vista sua essência.',
  whatsapp_number text not null default '5511999999999',
  whatsapp_default_message text not null default 'Olá! Gostaria de verificar a disponibilidade dessas peças.',
  instagram text not null default '@lumina.store',
  address text not null default '',
  hours text not null default '',
  hero_video_url text,
  hero_fallback_image text,
  hero_title text not null default 'Estilo que te representa.',
  hero_subtitle text not null default 'Mais que moda, uma experiência.',
  hero_button_label text not null default 'CONHEÇA A COLEÇÃO',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- =========================================
-- GUIA DE TAMANHOS
-- =========================================

create table if not exists public.size_guides (
  id uuid primary key default gen_random_uuid(),
  gender text not null check (gender in ('feminino', 'masculino')),
  size text not null,
  busto text,
  cintura text,
  quadril text,
  position int not null default 0
);
