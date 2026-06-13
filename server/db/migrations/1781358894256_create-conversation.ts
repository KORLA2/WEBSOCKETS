import type  { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
pgm.sql(`
    create table if not exists conversation(
    id uuid primary key default gen_random_uuid(),
    isGroup boolean default false,
    name text,
    createdAt timestamp default now(),
    lastMessageAt  timestamp default now()
    );
    `)

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`drop table if exists conversation;`)
}
