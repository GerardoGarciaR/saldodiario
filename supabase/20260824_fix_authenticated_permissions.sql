-- Saldo Diario - corrección de permisos para Data API / usuarios autenticados
-- Ejecutar UNA VEZ en Supabase > SQL Editor sobre la base actual.
-- RLS sigue siendo la capa que limita cada usuario a sus propios registros.

grant usage on schema public to authenticated;

grant select, insert, update, delete
on table public.periodos_financieros
 to authenticated;

grant select, insert, update, delete
on table public.movimientos_financieros
 to authenticated;
