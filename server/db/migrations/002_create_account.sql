create table if not exists account(
    id uuid primary key default gen_random_uuid(),
    uid uuid references users(id) not null on delete cascade,
    provider text,
    providerAccountId text,
    refreshToken text,
    accessToken text,
    expiresAt bigint,
    tokenType text,
    scope text,
    idToken text,
    sessionState text,
    unique (provider, providerAccountId),
    
);