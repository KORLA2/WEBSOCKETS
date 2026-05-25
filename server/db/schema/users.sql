create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) not null unique,
    password varchar(255) not null,
    name varchar(255) not null,
    created_at timestamp default now()
)

alter table users alter column id set default gen_random_uuid();