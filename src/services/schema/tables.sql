drop table if exists profiles;
create table profiles (
  id uuid references auth.users primary key,
  name text,
  avatar text
);

create table profiles_private (
  id uuid references profiles(id) primary key,
  email text,
  admin boolean default false not null
);

alter table profiles_private
  enable row level security;

create policy "Profiles are only visible by the user who owns it"
  on profiles_private for select using (
    auth.uid() = id
  );
  

drop function if exists handle_new_user();
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id, name, avatar)
  values (new.id, new.raw_user_meta_data::json->>'full_name', new.raw_user_meta_data::json->>'avatar_url');
  
  insert into profiles_private (id, email)
  values (new.id, new.email);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- chat

create table rooms (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  slug text not null,
  name text not null,
  topic text not null,

  user_id uuid default auth.uid() not null,
  constraint user_id foreign key(user_id) references profiles(id) on delete cascade
);

create extension unaccent;

create or replace function public.slugify()
 returns trigger
 language plpgsql
as $function$
begin
    new.slug := trim(BOTH '-' from regexp_replace(lower(unaccent(trim(new.name))), '[^a-z0-9\-_]+', '-', 'gi'));
    return new;
end;
$function$

drop trigger if exists on_room_created_add_slug on public.rooms;
create trigger on_room_created_add_slug
  before insert on public.rooms
  for each row execute procedure public.slugify();


create table direct_messages (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  content text not null,

  from_id uuid default auth.uid() not null,
  constraint from_id foreign key(from_id) references profiles(id) on delete cascade,

  to_id uuid not null,
  constraint to_id foreign key(to_id) references profiles(id) on delete cascade
);

alter table direct_messages
  enable row level security;

create policy "Direct messages selected: from_id or to_id"
  on direct_messages for select using (
    auth.uid() = direct_messages.from_id
    or
    auth.uid() = direct_messages.to_id
  );

create policy "Direct messages inserted: authenticated"
  on direct_messages for insert with check (
    auth.role() = 'authenticated'
  );

create table room_messages (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  content text not null,

  user_id uuid default auth.uid() not null,
  constraint user_id foreign key(user_id) references profiles(id) on delete cascade,

  room_id uuid not null,
  constraint room_id foreign key(room_id) references rooms(id) on delete cascade
);

drop publication if exists room_messages_insert;
create publication room_messages_insert
  for table public.room_messages
  with (publish = 'insert');

--- rpc

create or replace function public.post_message_to_room(content text, room_slug text)
returns room_messages language plpgsql as $$
declare
  room_id uuid;
  message room_messages;
begin
  select id from public.rooms where slug = $2 into room_id;

  insert into public.room_messages(content, room_id)
  values ($1, room_id) returning * into message;

  return message;
end $$;

create or replace function public.get_conversations()
returns setof profiles language plpgsql as $$
begin
  return query
    select distinct profiles.* from direct_messages
    join profiles on direct_messages.from_id = profiles.id or direct_messages.to_id = profiles.id
    where (direct_messages.from_id = auth.uid() or direct_messages.to_id = auth.uid()) and profiles.id != auth.uid();
end $$;
