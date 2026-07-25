import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        alter table conversation add column directkey text
        `)

}

export async function down(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        alter table conversation drop column directkey 
        `)
}
