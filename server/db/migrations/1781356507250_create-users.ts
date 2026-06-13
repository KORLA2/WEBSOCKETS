import type  { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
pgm.sql(`
 create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) not null unique,
    hashedPassword text not null,
    name varchar(255) not null,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    image text ,
    emailVerified timestamp
);
`)

}

export async function down(pgm: MigrationBuilder): Promise<void> {
pgm.sql(`drop table if exists users;`)
    
}
