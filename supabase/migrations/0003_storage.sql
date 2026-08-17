-- LUMINA — Storage (imagens de produto e mídia do hero)
-- Rode depois de 0001_schema.sql e 0002_rls.sql.

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('site-media', 'site-media', true)
on conflict (id) do nothing;

-- Leitura pública (as imagens da loja precisam carregar para qualquer visitante).
create policy "Leitura pública de imagens de produto"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Leitura pública de mídia do site"
  on storage.objects for select
  using (bucket_id = 'site-media');

-- Escrita restrita a administradores autenticados.
create policy "Admins enviam imagens de produto"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins atualizam imagens de produto"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins removem imagens de produto"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "Admins enviam mídia do site"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and public.is_admin());

create policy "Admins atualizam mídia do site"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

create policy "Admins removem mídia do site"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and public.is_admin());
