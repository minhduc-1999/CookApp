import {MigrationInterface, QueryRunner} from "typeorm";

export class addNumberColumnInTableCertificate1656953769816 implements MigrationInterface {
    name = 'addNumberColumnInTableCertificate1656953769816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" ADD "number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "UQ_8b379f595aea96c9406c5a44900" UNIQUE ("number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "UQ_8b379f595aea96c9406c5a44900"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP COLUMN "number"`);
    }

}
