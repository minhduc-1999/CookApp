import {MigrationInterface, QueryRunner} from "typeorm";

export class addNewPostType1652083976467 implements MigrationInterface {
    name = 'addNewPostType1652083976467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "recommendation" jsonb`);
        await queryRunner.query(`ALTER TYPE "public"."posts_kind_enum" RENAME TO "posts_kind_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."posts_kind_enum" AS ENUM('MOMENT', 'FOOD_SHARE', 'RECOMMENDATION')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "kind" TYPE "public"."posts_kind_enum" USING "kind"::"text"::"public"."posts_kind_enum"`);
        await queryRunner.query(`DROP TYPE "public"."posts_kind_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."posts_kind_enum_old" AS ENUM('MOMENT', 'FOOD_SHARE')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "kind" TYPE "public"."posts_kind_enum_old" USING "kind"::"text"::"public"."posts_kind_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."posts_kind_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."posts_kind_enum_old" RENAME TO "posts_kind_enum"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "recommendation"`);
    }

}
