-- =====================================================================
--  CADERNO DE CAMPO: tabelas, arquivos e regras de segurança
--  Cole TUDO no Supabase em: SQL Editor > New query > Run
--
--  ANTES de rodar, troque o e-mail na última parte do arquivo
--  (procure por EMAIL-DELA) pelo e-mail da conta que vai editar o site.
-- =====================================================================

-- ---------- Quem pode editar ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;
-- (sem regras: ninguém lê nem altera esta tabela pelo site)

create or replace function public.e_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Experiências (posts) ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  data date not null default current_date,
  local text not null default '',
  lat double precision,
  lon double precision,
  categoria text not null default 'campo',
  resumo text not null default '',
  texto text not null default '',
  diario jsonb,
  fotos jsonb not null default '[]'::jsonb,
  publicado boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create or replace function public.marcar_atualizacao()
returns trigger language plpgsql as $$
begin new.atualizado_em = now(); return new; end; $$;

drop trigger if exists posts_atualizado on public.posts;
create trigger posts_atualizado before update on public.posts
  for each row execute function public.marcar_atualizacao();

alter table public.posts enable row level security;

drop policy if exists "visitantes leem publicados" on public.posts;
create policy "visitantes leem publicados" on public.posts
  for select using (publicado or public.e_admin());

drop policy if exists "admin cria" on public.posts;
create policy "admin cria" on public.posts
  for insert to authenticated with check (public.e_admin());

drop policy if exists "admin altera" on public.posts;
create policy "admin altera" on public.posts
  for update to authenticated using (public.e_admin()) with check (public.e_admin());

drop policy if exists "admin apaga" on public.posts;
create policy "admin apaga" on public.posts
  for delete to authenticated using (public.e_admin());

-- ---------- Página "Sobre" (uma linha só) ----------
create table if not exists public.perfil (
  id int primary key default 1 check (id = 1),
  dados jsonb not null
);
alter table public.perfil enable row level security;

drop policy if exists "todos leem perfil" on public.perfil;
create policy "todos leem perfil" on public.perfil for select using (true);

drop policy if exists "admin cria perfil" on public.perfil;
create policy "admin cria perfil" on public.perfil
  for insert to authenticated with check (public.e_admin());

drop policy if exists "admin altera perfil" on public.perfil;
create policy "admin altera perfil" on public.perfil
  for update to authenticated using (public.e_admin()) with check (public.e_admin());

-- ---------- Arquivos (fotos e currículo) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin envia arquivos" on storage.objects;
create policy "admin envia arquivos" on storage.objects
  for insert to authenticated with check (bucket_id = 'fotos' and public.e_admin());

drop policy if exists "admin altera arquivos" on storage.objects;
create policy "admin altera arquivos" on storage.objects
  for update to authenticated using (bucket_id = 'fotos' and public.e_admin());

drop policy if exists "admin apaga arquivos" on storage.objects;
create policy "admin apaga arquivos" on storage.objects
  for delete to authenticated using (bucket_id = 'fotos' and public.e_admin());

-- ---------- Acesso pela API do site ----------
-- (as regras acima continuam valendo; isto só deixa o site "enxergar" as tabelas)
grant usage on schema public to anon, authenticated;
grant select on public.posts, public.perfil to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant insert, update on public.perfil to authenticated;
grant execute on function public.e_admin() to anon, authenticated;

-- =====================================================================
--  ÚLTIMA PARTE: dar permissão de edição para a conta dela.
--  A conta precisa já existir (Authentication > Users > Add user).
--  Troque EMAIL-DELA@exemplo.com pelo e-mail dela e rode.
-- =====================================================================
insert into public.admins (user_id)
select id from auth.users where email = 'EMAIL-DELA@exemplo.com'
on conflict do nothing;

-- Conferência: deve mostrar 1 linha com o e-mail dela.
select u.email from public.admins a join auth.users u on u.id = a.user_id;
