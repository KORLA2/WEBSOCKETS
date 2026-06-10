create table if not exists message(
    id uuid primary key default gen_random_uuid(),
    cid uuid references conversation(id) not null on delete cascade,
    senderId uuid references users(id) not null on delete cascade,
    body text,
    createdAt timestamp default now(),
    updatedAt timestamp default now()
);