create table if not exists conversation(
id uuid primary key default gen_random_uuid(),
isGroup boolean default false,
name text,
createdAt timestamp default now(),
lastMessageAt  timestamp default now(),
);

create table if not exists conversationMembers(
    uid uuid references users(id) not null on delete cascade,
    conversationId uuid references conversation(id) not null on delete cascade,
    primary key (uid, conversationId)
)