-- LUMINA — Row Level Security
-- Rode depois de 0001_schema.sql.

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_colors enable row level security;
alter table public.product_sizes enable row level security;
alter table public.product_variants enable row level security;
alter table public.favorites enable row level security;
alter table public.site_settings enable row level security;
alter table public.size_guides enable row level security;

-- ---------- profiles ----------
create policy "Usuário vê o próprio perfil" on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy "Usuário atualiza o próprio perfil" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- ---------- admin_users ----------
-- Nenhum acesso via API pública. Somente leitura pelo próprio admin,
-- para a UI conseguir checar `sou admin?` sem usar a service role key.
create policy "Admin confere o próprio acesso" on public.admin_users
  for select to authenticated using (auth.uid() = user_id);

-- ---------- categories ----------
create policy "Categorias ativas são públicas" on public.categories
  for select using (active = true or public.is_admin());

create policy "Admins gerenciam categorias" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- products ----------
create policy "Produtos ativos são públicos" on public.products
  for select using (active = true or public.is_admin());

create policy "Admins gerenciam produtos" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- product_images / colors / sizes / variants ----------
-- Visíveis se o produto pai for visível; escrita restrita a admins.
create policy "Imagens seguem visibilidade do produto" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id
        and (p.active = true or public.is_admin())
    )
  );
create policy "Admins gerenciam imagens" on public.product_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Cores seguem visibilidade do produto" on public.product_colors
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_colors.product_id
        and (p.active = true or public.is_admin())
    )
  );
create policy "Admins gerenciam cores" on public.product_colors
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Tamanhos seguem visibilidade do produto" on public.product_sizes
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_sizes.product_id
        and (p.active = true or public.is_admin())
    )
  );
create policy "Admins gerenciam tamanhos" on public.product_sizes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Variantes seguem visibilidade do produto" on public.product_variants
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_variants.product_id
        and (p.active = true or public.is_admin())
    )
  );
create policy "Admins gerenciam variantes" on public.product_variants
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- favorites ----------
create policy "Usuário vê os próprios favoritos" on public.favorites
  for select to authenticated using (auth.uid() = user_id);

create policy "Usuário adiciona os próprios favoritos" on public.favorites
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Usuário remove os próprios favoritos" on public.favorites
  for delete to authenticated using (auth.uid() = user_id);

-- ---------- site_settings ----------
create policy "Configurações são públicas para leitura" on public.site_settings
  for select using (true);

create policy "Admins atualizam configurações" on public.site_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- size_guides ----------
create policy "Guia de tamanhos é público" on public.size_guides
  for select using (true);

create policy "Admins gerenciam guia de tamanhos" on public.size_guides
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
