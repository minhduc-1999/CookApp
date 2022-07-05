import {MigrationInterface, QueryRunner} from "typeorm";

export class removeUniqueOnNumberCollumnInCertificateTable1657042068112 implements MigrationInterface {
    name = 'removeUniqueOnNumberCollumnInCertificateTable1657042068112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "UQ_8b379f595aea96c9406c5a44900"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "UQ_8b379f595aea96c9406c5a44900" UNIQUE ("number")`);
    }

}
