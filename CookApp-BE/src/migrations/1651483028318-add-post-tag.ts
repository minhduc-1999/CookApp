import {MigrationInterface, QueryRunner} from "typeorm";

export class addPostTag1651483028318 implements MigrationInterface {
    name = 'addPostTag1651483028318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "tags" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "tags"`);
    }

}
