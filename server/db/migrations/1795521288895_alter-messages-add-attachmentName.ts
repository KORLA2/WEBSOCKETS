import { type ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        alter table messages add column attachment_name text
        `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
          alter table drop column attachment_name 
        `)
}
