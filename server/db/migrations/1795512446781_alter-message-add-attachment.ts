import { type ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.sql(`
         alter table  messages add column attachment_url text, add column  attachment_type text
        `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
 pgm.sql(`
     alter table messages drop column attachment_url , attachment_type 
    `)

}
