import {MigrationInterface, QueryRunner} from "typeorm";

export class addResetPasswordToken1654012773077 implements MigrationInterface {
    name = 'addResetPasswordToken1654012773077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "reset_password_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "reset_password_token"`);
    }

}
