import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
         create table if not exists seen(
           mid uuid references message(id) on delete cascade not null,
           seenid uuid references users(id) on delete cascade not null,
           primary key(mid,seenid)
         )
        `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        drop table seen if exists;
        `)
}
