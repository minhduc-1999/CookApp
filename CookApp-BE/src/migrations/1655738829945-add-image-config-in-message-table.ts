import {MigrationInterface, QueryRunner} from "typeorm";

export class addImageConfigInMessageTable1655738829945 implements MigrationInterface {
    name = 'addImageConfigInMessageTable1655738829945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "config" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "config"`);
    }

}
