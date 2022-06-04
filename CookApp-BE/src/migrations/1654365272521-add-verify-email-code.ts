import {MigrationInterface, QueryRunner} from "typeorm";

export class addVerifyEmailCode1654365272521 implements MigrationInterface {
    name = 'addVerifyEmailCode1654365272521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "verify_email_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "verify_email_code"`);
    }

}
