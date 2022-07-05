import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserIdToRequestTable1657041800090 implements MigrationInterface {
    name = 'addUserIdToRequestTable1657041800090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "FK_88f90b1b9c635c14271e509cec0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_88f90b1b9c635c14271e509cec0"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP COLUMN "user_id"`);
    }

}
