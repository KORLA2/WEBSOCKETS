import { type ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        create table reactions (
            id uuid primary key default gen_random_uuid(),
            mid  uuid not null references messages(id) on delete cascade,
            uid  uuid not null references users(id) on delete cascade,
            emoji text not null,
            unique(mid, uid, emoji)
        )
        `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        drop table reactions
    `)
}
