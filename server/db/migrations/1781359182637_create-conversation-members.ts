import type  { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        create table if not exists conversationMembers(
        uid uuid references users(id)  on delete cascade not null,
        conversationId uuid references conversation(id)  on delete cascade not null,
        primary key (uid, conversationId)
    );
        `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`drop table if exists conversationMembers;`)
}
