import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserBio1651512313897 implements MigrationInterface {
    name = 'addUserBio1651512313897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
    }

}
