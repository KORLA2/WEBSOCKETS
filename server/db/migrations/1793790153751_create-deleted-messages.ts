import { type ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
pgm.sql(`
 CREATE TABLE deletedmessages (
    mid uuid references messages(id) on delete cascade,
    uid uuid references users(id) on delete cascade,
    primary key(mid,uid)
 ) 
    `)

}

export async function down(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
    DROP TABLE deletedmessages
    `)
}
