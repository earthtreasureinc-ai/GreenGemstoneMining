-- Preview-branch migration only. Do not apply to the production Supabase project.
create extension if not exists pgcrypto;
create table if not exists public.visual_editor_drafts (
 id uuid primary key default gen_random_uuid(),
 project_key text not null default 'green-gemstone-mining' check(project_key='green-gemstone-mining'),
 name text not null check(char_length(name) between 1 and 120),
 payload jsonb not null check(jsonb_typeof(payload)='object' and pg_column_size(payload)<=1048576),
 version integer not null default 1 check(version>0),
 status text not null default 'draft' check(status in ('draft','published','archived')),
 created_by uuid not null references auth.users(id) on delete restrict,
 updated_by uuid not null references auth.users(id) on delete restrict,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz
);
create index if not exists visual_editor_drafts_updated_idx on public.visual_editor_drafts(updated_at desc);
create table if not exists public.visual_editor_versions (
 id bigint generated always as identity primary key,
 draft_id uuid not null references public.visual_editor_drafts(id) on delete cascade,
 version integer not null, payload jsonb not null check(pg_column_size(payload)<=1048576),
 status text not null check(status in ('draft','published','restored')),
 actor_id uuid not null references auth.users(id) on delete restrict,
 created_at timestamptz not null default now(), note text not null default 'Saved version',
 unique(draft_id,version)
);
create index if not exists visual_editor_versions_history_idx on public.visual_editor_versions(draft_id,version desc);
alter table public.visual_editor_drafts enable row level security;
alter table public.visual_editor_versions enable row level security;
revoke all on public.visual_editor_drafts from anon,authenticated;
revoke all on public.visual_editor_versions from anon,authenticated;
grant select on public.visual_editor_drafts,public.visual_editor_versions to authenticated;
drop policy if exists "admins_read_editor_drafts" on public.visual_editor_drafts;
create policy "admins_read_editor_drafts" on public.visual_editor_drafts for select to authenticated using(public.is_admin());
drop policy if exists "admins_read_editor_versions" on public.visual_editor_versions;
create policy "admins_read_editor_versions" on public.visual_editor_versions for select to authenticated using(public.is_admin());

create or replace function public.save_visual_editor_draft(p_draft_id uuid,p_expected_version integer,p_name text,p_payload jsonb)
returns public.visual_editor_drafts language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid(); r public.visual_editor_drafts;
begin
 if u is null or not public.is_admin() then raise exception 'not authorized' using errcode='42501'; end if;
 if p_payload is null or jsonb_typeof(p_payload)<>'object' or pg_column_size(p_payload)>1048576 then raise exception 'invalid payload' using errcode='22023'; end if;
 if p_name is null or char_length(trim(p_name))<1 or char_length(p_name)>120 then raise exception 'invalid draft name' using errcode='22023'; end if;
 if p_draft_id is null then
  if coalesce(p_expected_version,0)<>0 then raise exception 'version conflict' using errcode='40001'; end if;
  insert into public.visual_editor_drafts(name,payload,version,status,created_by,updated_by) values(trim(p_name),p_payload,1,'draft',u,u) returning * into r;
  insert into public.visual_editor_versions(draft_id,version,payload,status,actor_id,note) values(r.id,r.version,r.payload,'draft',u,'Initial save');
  return r;
 end if;
 select * into r from public.visual_editor_drafts where id=p_draft_id for update;
 if not found then raise exception 'draft not found' using errcode='P0002'; end if;
 if r.status='published' then raise exception 'published versions are immutable; start a new draft' using errcode='55000'; end if;
 if r.version<>p_expected_version then raise exception 'version conflict: reload latest draft' using errcode='40001'; end if;
 update public.visual_editor_drafts set name=trim(p_name),payload=p_payload,version=r.version+1,status='draft',updated_by=u,updated_at=now() where id=p_draft_id returning * into r;
 insert into public.visual_editor_versions(draft_id,version,payload,status,actor_id,note) values(r.id,r.version,r.payload,'draft',u,'Saved draft');
 return r;
end; $$;

create or replace function public.publish_visual_editor_draft(p_draft_id uuid,p_expected_version integer)
returns public.visual_editor_drafts language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid(); r public.visual_editor_drafts;
begin
 if u is null or not public.is_admin() then raise exception 'not authorized' using errcode='42501'; end if;
 select * into r from public.visual_editor_drafts where id=p_draft_id for update;
 if not found then raise exception 'draft not found' using errcode='P0002'; end if;
 if r.version<>p_expected_version then raise exception 'version conflict' using errcode='40001'; end if;
 if r.status='published' then return r; end if;
 update public.visual_editor_drafts set status='published',version=r.version+1,published_at=now(),updated_at=now(),updated_by=u where id=p_draft_id returning * into r;
 insert into public.visual_editor_versions(draft_id,version,payload,status,actor_id,note) values(r.id,r.version,r.payload,'published',u,'Published snapshot');
 return r;
end; $$;

create or replace function public.list_visual_editor_drafts()
returns setof public.visual_editor_drafts language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null or not public.is_admin() then raise exception 'not authorized' using errcode='42501'; end if;
 return query select * from public.visual_editor_drafts where status<>'archived' order by updated_at desc limit 50;
end; $$;
create or replace function public.list_visual_editor_versions(p_draft_id uuid)
returns setof public.visual_editor_versions language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null or not public.is_admin() then raise exception 'not authorized' using errcode='42501'; end if;
 if not exists(select 1 from public.visual_editor_drafts where id=p_draft_id) then raise exception 'draft not found' using errcode='P0002'; end if;
 return query select * from public.visual_editor_versions where draft_id=p_draft_id order by version desc,id desc limit 100;
end; $$;
create or replace function public.get_published_visual_editor_payload()
returns jsonb language sql stable security definer set search_path=public as $$
 select payload from public.visual_editor_drafts where project_key='green-gemstone-mining' and status='published' order by published_at desc nulls last,updated_at desc limit 1;
$$;
revoke all on function public.save_visual_editor_draft(uuid,integer,text,jsonb) from public,anon;
revoke all on function public.publish_visual_editor_draft(uuid,integer) from public,anon;
revoke all on function public.list_visual_editor_drafts() from public,anon;
revoke all on function public.list_visual_editor_versions(uuid) from public,anon;
revoke all on function public.get_published_visual_editor_payload() from public,anon;
grant execute on function public.save_visual_editor_draft(uuid,integer,text,jsonb) to authenticated;
grant execute on function public.publish_visual_editor_draft(uuid,integer) to authenticated;
grant execute on function public.list_visual_editor_drafts() to authenticated;
grant execute on function public.list_visual_editor_versions(uuid) to authenticated;
grant execute on function public.get_published_visual_editor_payload() to anon,authenticated;
