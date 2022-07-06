import {MigrationInterface, QueryRunner} from "typeorm";

export class addNoteColumnInCertificateTable1657126334925 implements MigrationInterface {
    name = 'addNoteColumnInCertificateTable1657126334925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" ADD "note" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" DROP COLUMN "note"`);
    }

}
