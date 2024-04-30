import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1714143062475 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT
                company TEXT
                registration_status TEXT
                telegram_id NUMBER
                chat_id NUMBER
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE user;
        `)
    }

}
