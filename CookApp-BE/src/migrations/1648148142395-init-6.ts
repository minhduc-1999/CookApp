import {MigrationInterface, QueryRunner} from "typeorm";

export class init61648148142395 implements MigrationInterface {
    name = 'init61648148142395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "followers"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "followees"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "posts"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "comments"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "reactions"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "n_followers" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "n_followees" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "n_posts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD "n_comments" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD "n_reactions" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "n_reactions"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "n_comments"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "n_posts"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "n_followees"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "n_followers"`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD "reactions" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD "comments" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "posts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "followees" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "followers" integer NOT NULL DEFAULT '0'`);
    }

}
