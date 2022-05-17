import {MigrationInterface, QueryRunner} from "typeorm";

export class removeRecommendationTitle1652806445632 implements MigrationInterface {
    name = 'removeRecommendationTitle1652806445632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "title" character varying`);
    }

}
