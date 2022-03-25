import {MigrationInterface, QueryRunner} from "typeorm";

export class init91648227246512 implements MigrationInterface {
    name = 'init91648227246512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "location" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "location" SET NOT NULL`);
    }

}
