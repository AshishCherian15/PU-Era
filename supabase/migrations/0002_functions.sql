-- Add increment_resource_views RPC function
create or replace function public.increment_resource_views(resource_id uuid)
returns void
language sql security definer
set search_path = public, pg_temp
as $$
  update public.resources
  set views = views + 1
  where id = resource_id and status = 'published';
$$;
