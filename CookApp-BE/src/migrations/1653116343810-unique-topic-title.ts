import {MigrationInterface, QueryRunner} from "typeorm";

export class uniqueTopicTitle1653116343810 implements MigrationInterface {
    name = 'uniqueTopicTitle1653116343810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topics" ADD CONSTRAINT "UQ_f511a2b28e4acd2b481f79e55c0" UNIQUE ("title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topics" DROP CONSTRAINT "UQ_f511a2b28e4acd2b481f79e55c0"`);
    }

}
