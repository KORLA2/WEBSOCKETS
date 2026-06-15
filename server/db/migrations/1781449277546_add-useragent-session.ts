import type{ ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
pgm.sql(`
    alter table session add column userAgent text;
    alter table session add column ip text;
    `)

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
    alter table session drop column userAgent;
    alter table session drop column ip;
    `)
}
