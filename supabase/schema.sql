-- Saldo Diario - Esquema inicial para Supabase
-- Ejecutar completo en SQL Editor dentro de un proyecto NUEVO.

create extension if not exists pgcrypto;

create table if not exists public.periodos_financieros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  concepto text not null check (char_length(trim(concepto)) > 0),
  ingreso_inicial numeric(14,2) not null default 0 check (ingreso_inicial >= 0),
  fecha_inicio date not null,
  fecha_fin date not null,
  created_at timestamptz not null default now(),
  constraint periodos_fechas_validas check (fecha_fin >= fecha_inicio)
);

create table if not exists public.movimientos_financieros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  periodo_id uuid not null references public.periodos_financieros(id) on delete cascade,
  tipo text not null check (tipo in ('ingreso', 'gasto')),
  importe numeric(14,2) not null check (importe > 0),
  concepto text not null check (char_length(trim(concepto)) > 0),
  fecha date not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_periodos_user_fecha
  on public.periodos_financieros(user_id, fecha_inicio desc);

create index if not exists idx_movimientos_user_periodo_fecha
  on public.movimientos_financieros(user_id, periodo_id, fecha, created_at);

alter table public.periodos_financieros enable row level security;
alter table public.movimientos_financieros enable row level security;

alter table public.periodos_financieros force row level security;
alter table public.movimientos_financieros force row level security;

-- PERIODOS: cada usuario sólo puede ver y modificar sus propios registros.
drop policy if exists "periodos_select_own" on public.periodos_financieros;
create policy "periodos_select_own"
  on public.periodos_financieros
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "periodos_insert_own" on public.periodos_financieros;
create policy "periodos_insert_own"
  on public.periodos_financieros
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "periodos_update_own" on public.periodos_financieros;
create policy "periodos_update_own"
  on public.periodos_financieros
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "periodos_delete_own" on public.periodos_financieros;
create policy "periodos_delete_own"
  on public.periodos_financieros
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- MOVIMIENTOS: además de ser del usuario, el período padre también debe pertenecerle.
drop policy if exists "movimientos_select_own" on public.movimientos_financieros;
create policy "movimientos_select_own"
  on public.movimientos_financieros
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "movimientos_insert_own" on public.movimientos_financieros;
create policy "movimientos_insert_own"
  on public.movimientos_financieros
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.periodos_financieros p
      where p.id = periodo_id
        and p.user_id = auth.uid()
    )
  );

drop policy if exists "movimientos_update_own" on public.movimientos_financieros;
create policy "movimientos_update_own"
  on public.movimientos_financieros
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.periodos_financieros p
      where p.id = periodo_id
        and p.user_id = auth.uid()
    )
  );

drop policy if exists "movimientos_delete_own" on public.movimientos_financieros;
create policy "movimientos_delete_own"
  on public.movimientos_financieros
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- PERMISOS DE DATA API
-- Los GRANT de PostgreSQL y las políticas RLS son capas distintas.
-- authenticated puede operar las tablas; RLS decide qué filas son de cada usuario.
grant usage on schema public to authenticated;

grant select, insert, update, delete
on table public.periodos_financieros
 to authenticated;

grant select, insert, update, delete
on table public.movimientos_financieros
 to authenticated;
