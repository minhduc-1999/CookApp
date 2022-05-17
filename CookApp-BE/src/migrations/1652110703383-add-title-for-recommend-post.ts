import {MigrationInterface, QueryRunner} from "typeorm";

export class addTitleForRecommendPost1652110703383 implements MigrationInterface {
    name = 'addTitleForRecommendPost1652110703383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "title" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "title"`);
    }

}
