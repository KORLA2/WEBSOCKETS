import { type  ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
          alter table conversationmembers add column lastreadat timestamp
        `)

}

export async function down(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
        alter table conversationmembers drop column lastreadat
        `)
}
