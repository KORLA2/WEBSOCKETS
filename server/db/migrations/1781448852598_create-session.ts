import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        create table if not exists session(
        id uuid primary key default gen_random_uuid(),
        userId uuid references users(id) on delete cascade not null,
        refreshToken text not null,
        createdAt timestamp default now(),
        updatedAt timestamp default now()
    );
        `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`drop table if exists session;`)
}
