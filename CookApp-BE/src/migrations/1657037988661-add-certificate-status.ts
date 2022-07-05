import {MigrationInterface, QueryRunner} from "typeorm";

export class addCertificateStatus1657037988661 implements MigrationInterface {
    name = 'addCertificateStatus1657037988661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."certificates_status_enum" AS ENUM('confirmed', 'rejected', 'waiting')`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD "status" "public"."certificates_status_enum" NOT NULL DEFAULT 'waiting'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."certificates_status_enum"`);
    }

}
