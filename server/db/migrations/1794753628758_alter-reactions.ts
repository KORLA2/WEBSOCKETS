import {type  ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

pgm.sql(
    `
    alter table reactions drop constraint reactions_mid_uid_emoji_key;
    alter table reactions add constraint mid_uid_unique unique(mid, uid);
    `
)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        alter table reactions drop constraint mid_uid_unique;
        alter table reactions add constraint reactions_mid_uid_emoji_key unique(mid, uid, emoji);
        `)
}
