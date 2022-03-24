import {MigrationInterface, QueryRunner} from "typeorm";

export class init31648144296543 implements MigrationInterface {
    name = 'init31648144296543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "status" character varying NOT NULL`);
    }

}
