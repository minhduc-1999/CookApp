import {MigrationInterface, QueryRunner} from "typeorm";

export class addNoteColumnInRequestTable1657124435040 implements MigrationInterface {
    name = 'addNoteColumnInRequestTable1657124435040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" ADD "note" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "note"`);
    }

}
