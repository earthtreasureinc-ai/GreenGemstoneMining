-- Preview-only visual editor schema. Apply ONLY to a dedicated preview Supabase project.
-- Never apply this migration to the production Green Gemstone project.

-- A separate allowlist is required because this project must not rely on the
-- production project's public.admin_users table or authorization function.
create table if not exists public.visual_editor_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.visual_editor_admins enable row level security;
revoke all on public.visual_editor_admins from anon, authenticated;

create or replace function public.is_visual_editor_admin()
returns boolean language sql stable security definer set search_path = pg_catalog, public as $$
 select exists (
   select 1 from public.visual_editor_admins where user_id = auth.uid()
 );
$$;
revoke all on function public.is_visual_editor_admin() from public, anon, authenticated;
grant execute on function public.is_visual_editor_admin() to authenticated;

create table if not exists public.visual_editor_drafts (
 id uuid primary key default gen_random_uuid(),
 project_key text not null default 'green-gemstone-mining-preview'
   check (project_key = 'green-gemstone-mining-preview'),
 name text not null check (char_length(name) between 1 and 120),
 payload jsonb not null check (jsonb_typeof(payload) = 'object' and pg_column_size(payload) <= 1048576),
 version integer not null default 1 check (version > 0),
 status text not null default 'draft' check (status in ('draft','published','archived')),
 created_by uuid not null references auth.users(id) on delete restrict,
 updated_by uuid not null references auth.users(id) on delete restrict,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 published_at timestamptz
);
create index if not exists visual_editor_drafts_updated_idx
 on public.visual_editor_drafts(project_key, updated_at desc);

create table if not exists public.visual_editor_versions (
 id bigint generated always as identity primary key,
 project_key text not null default 'green-gemstone-mining-preview'
   check (project_key = 'green-gemstone-mining-preview'),
 draft_id uuid not null references public.visual_editor_drafts(id) on delete restrict,
 version integer not null check (version > 0),
 payload jsonb not null check (jsonb_typeof(payload) = 'object' and pg_column_size(payload) <= 1048576),
 status text not null check (status in ('draft','published','restored')),
 actor_id uuid not null references auth.users(id) on delete restrict,
 created_at timestamptz not null default now(),
 note text not null default 'Saved version',
 unique(draft_id, version)
);
create index if not exists visual_editor_versions_history_idx
 on public.visual_editor_versions(project_key, draft_id, version desc);

alter table public.visual_editor_drafts enable row level security;
alter table public.visual_editor_versions enable row level security;
revoke all on public.visual_editor_drafts from anon, authenticated;
revoke all on public.visual_editor_versions from anon, authenticated;
grant select on public.visual_editor_drafts, public.visual_editor_versions to authenticated;

drop policy if exists admins_read_editor_drafts on public.visual_editor_drafts;
create policy admins_read_editor_drafts on public.visual_editor_drafts
 for select to authenticated using (
   public.is_visual_editor_admin() and project_key = 'green-gemstone-mining-preview'
 );
drop policy if exists admins_read_editor_versions on public.visual_editor_versions;
create policy admins_read_editor_versions on public.visual_editor_versions
 for select to authenticated using (
   public.is_visual_editor_admin() and project_key = 'green-gemstone-mining-preview'
 );

create or replace function public.reject_visual_editor_version_mutation()
returns trigger language plpgsql set search_path = pg_catalog, public as $$
begin
 raise exception 'visual editor version history is immutable' using errcode = '55000';
end;
$$;
drop trigger if exists visual_editor_versions_immutable on public.visual_editor_versions;
create trigger visual_editor_versions_immutable
 before update or delete on public.visual_editor_versions
 for each row execute function public.reject_visual_editor_version_mutation();

create or replace function public.save_visual_editor_draft(
 p_draft_id uuid, p_expected_version integer, p_name text, p_payload jsonb
) returns public.visual_editor_drafts
language plpgsql security definer set search_path = pg_catalog, public as $$
declare u uuid := auth.uid(); r public.visual_editor_drafts;
begin
 if u is null or not public.is_visual_editor_admin() then raise exception 'not authorized' using errcode = '42501'; end if;
 if p_payload is null or jsonb_typeof(p_payload) <> 'object' or pg_column_size(p_payload) > 1048576 then raise exception 'invalid payload' using errcode = '22023'; end if;
 if p_name is null or char_length(trim(p_name)) < 1 or char_length(p_name) > 120 then raise exception 'invalid draft name' using errcode = '22023'; end if;
 if p_draft_id is null then
   if coalesce(p_expected_version, 0) <> 0 then raise exception 'version conflict' using errcode = '40001'; end if;
   insert into public.visual_editor_drafts(project_key,name,payload,version,status,created_by,updated_by)
   values ('green-gemstone-mining-preview',trim(p_name),p_payload,1,'draft',u,u) returning * into r;
   insert into public.visual_editor_versions(project_key,draft_id,version,payload,status,actor_id,note)
   values (r.project_key,r.id,r.version,r.payload,'draft',u,'Initial save');
   return r;
 end if;
 select * into r from public.visual_editor_drafts
  where id=p_draft_id and project_key='green-gemstone-mining-preview' for update;
 if not found then raise exception 'preview draft not found' using errcode='P0002'; end if;
 if r.status='published' then raise exception 'published snapshots are immutable; create a new draft' using errcode='55000'; end if;
 if r.version <> p_expected_version then raise exception 'version conflict: reload latest draft' using errcode='40001'; end if;
 update public.visual_editor_drafts set name=trim(p_name),payload=p_payload,version=r.version+1,status='draft',updated_by=u,updated_at=now()
  where id=p_draft_id and project_key='green-gemstone-mining-preview' returning * into r;
 insert into public.visual_editor_versions(project_key,draft_id,version,payload,status,actor_id,note)
 values (r.project_key,r.id,r.version,r.payload,'draft',u,'Saved draft');
 return r;
end;
$$;

create or replace function public.publish_visual_editor_draft(p_draft_id uuid,p_expected_version integer)
returns public.visual_editor_drafts
language plpgsql security definer set search_path = pg_catalog, public as $$
declare u uuid := auth.uid(); r public.visual_editor_drafts;
begin
 if u is null or not public.is_visual_editor_admin() then raise exception 'not authorized' using errcode='42501'; end if;
 select * into r from public.visual_editor_drafts
  where id=p_draft_id and project_key='green-gemstone-mining-preview' for update;
 if not found then raise exception 'preview draft not found' using errcode='P0002'; end if;
 if r.version <> p_expected_version then raise exception 'version conflict' using errcode='40001'; end if;
 if r.status <> 'draft' then raise exception 'only an unpublished draft can be published' using errcode='55000'; end if;
 update public.visual_editor_drafts set status='published',version=r.version+1,published_at=now(),updated_at=now(),updated_by=u
  where id=p_draft_id and project_key='green-gemstone-mining-preview' returning * into r;
 insert into public.visual_editor_versions(project_key,draft_id,version,payload,status,actor_id,note)
 values (r.project_key,r.id,r.version,r.payload,'published',u,'Published snapshot');
 return r;
end;
$$;

create or replace function public.list_visual_editor_drafts()
returns setof public.visual_editor_drafts
language plpgsql security definer set search_path = pg_catalog, public as $$
begin
 if auth.uid() is null or not public.is_visual_editor_admin() then raise exception 'not authorized' using errcode='42501'; end if;
 return query select * from public.visual_editor_drafts
  where project_key='green-gemstone-mining-preview' and status<>'archived'
  order by updated_at desc limit 50;
end;
$$;

create or replace function public.list_visual_editor_versions(p_draft_id uuid)
returns setof public.visual_editor_versions
language plpgsql security definer set search_path = pg_catalog, public as $$
begin
 if auth.uid() is null or not public.is_visual_editor_admin() then raise exception 'not authorized' using errcode='42501'; end if;
 if not exists(select 1 from public.visual_editor_drafts where id=p_draft_id and project_key='green-gemstone-mining-preview')
 then raise exception 'preview draft not found' using errcode='P0002'; end if;
 return query select * from public.visual_editor_versions
  where draft_id=p_draft_id and project_key='green-gemstone-mining-preview'
  order by version desc,id desc limit 100;
end;
$$;

-- Restoring creates a new draft and never mutates a saved or published snapshot.
create or replace function public.restore_visual_editor_version(p_draft_id uuid,p_version integer)
returns public.visual_editor_drafts
language plpgsql security definer set search_path = pg_catalog, public as $$
declare u uuid := auth.uid(); src public.visual_editor_drafts; v public.visual_editor_versions; r public.visual_editor_drafts;
begin
 if u is null or not public.is_visual_editor_admin() then raise exception 'not authorized' using errcode='42501'; end if;
 select * into src from public.visual_editor_drafts where id=p_draft_id and project_key='green-gemstone-mining-preview';
 if not found then raise exception 'preview draft not found' using errcode='P0002'; end if;
 select * into v from public.visual_editor_versions
  where draft_id=p_draft_id and version=p_version and project_key='green-gemstone-mining-preview';
 if not found then raise exception 'preview version not found' using errcode='P0002'; end if;
 insert into public.visual_editor_drafts(project_key,name,payload,version,status,created_by,updated_by)
 values ('green-gemstone-mining-preview',left('Restored: '||src.name,120),v.payload,1,'draft',u,u) returning * into r;
 insert into public.visual_editor_versions(project_key,draft_id,version,payload,status,actor_id,note)
 values (r.project_key,r.id,1,r.payload,'restored',u,'Restored from draft '||p_draft_id::text||' version '||p_version::text);
 return r;
end;
$$;

-- Public payload reads are only for the separate preview project. The production
-- project must not receive this migration or its RPC grant.
create or replace function public.get_published_visual_editor_payload()
returns jsonb language sql stable security definer set search_path = pg_catalog, public as $$
 select payload from public.visual_editor_drafts
 where project_key='green-gemstone-mining-preview' and status='published'
 order by published_at desc nulls last,updated_at desc limit 1;
$$;

revoke all on function public.reject_visual_editor_version_mutation() from public, anon, authenticated;
revoke all on function public.save_visual_editor_draft(uuid,integer,text,jsonb) from public, anon, authenticated;
revoke all on function public.publish_visual_editor_draft(uuid,integer) from public, anon, authenticated;
revoke all on function public.list_visual_editor_drafts() from public, anon, authenticated;
revoke all on function public.list_visual_editor_versions(uuid) from public, anon, authenticated;
revoke all on function public.restore_visual_editor_version(uuid,integer) from public, anon, authenticated;
revoke all on function public.get_published_visual_editor_payload() from public, anon, authenticated;
grant execute on function public.save_visual_editor_draft(uuid,integer,text,jsonb) to authenticated;
grant execute on function public.publish_visual_editor_draft(uuid,integer) to authenticated;
grant execute on function public.list_visual_editor_drafts() to authenticated;
grant execute on function public.list_visual_editor_versions(uuid) to authenticated;
grant execute on function public.restore_visual_editor_version(uuid,integer) to authenticated;
grant execute on function public.get_published_visual_editor_payload() to anon, authenticated;
