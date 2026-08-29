import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
 pgm.sql(`
    alter table message
    add column if not exists image text
  `);

}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    alter table message
    drop column if exists image
  `);

}
