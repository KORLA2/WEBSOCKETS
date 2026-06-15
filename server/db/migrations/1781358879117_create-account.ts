import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    
 pgm.sql(`
    create table if not exists account(
    id uuid primary key default gen_random_uuid(),
    uid uuid references users(id) on delete cascade not null,
    provider text,
    providerAccountId text,
    refreshToken text,
    accessToken text,
    expiresAt bigint,
    tokenType text,
    scope text,
    idToken text,
    sessionState text,
    unique (provider, providerAccountId)
    
);
    `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`drop table if exists account;`)
}
