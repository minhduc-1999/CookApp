import {MigrationInterface, QueryRunner} from "typeorm";

export class addTopicCover1653114905508 implements MigrationInterface {
    name = 'addTopicCover1653114905508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topics" ADD "cover" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "cover"`);
    }

}
