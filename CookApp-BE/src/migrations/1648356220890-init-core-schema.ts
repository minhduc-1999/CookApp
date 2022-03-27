import {MigrationInterface, QueryRunner} from "typeorm";

export class initCoreSchema1648356220890 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA "core"`);
        await queryRunner.query(`CREATE SCHEMA "social"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP SHCEMA "social"`);
        await queryRunner.query(`DROP SHCEMA "core"`);
    }

}
