import { type ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        alter table message rename to messages
        `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {

     pgm.sql(`
        alter table messages rename to message
        `)
}
