import {MigrationInterface, QueryRunner} from "typeorm";

export class changeDefaultImages1650171557488 implements MigrationInterface {
    name = 'changeDefaultImages1650171557488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."messages_content_type_enum" RENAME TO "messages_content_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."messages_content_type_enum" AS ENUM('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'RECIPE', 'INGREDIENT')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "content_type" TYPE "public"."messages_content_type_enum" USING "content_type"::"text"::"public"."messages_content_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."messages_content_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT 'images/avatar-default.png'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT 'images/avatar-default.jpg'`);
        await queryRunner.query(`CREATE TYPE "public"."messages_content_type_enum_old" AS ENUM('TEXT', 'IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "content_type" TYPE "public"."messages_content_type_enum_old" USING "content_type"::"text"::"public"."messages_content_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."messages_content_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."messages_content_type_enum_old" RENAME TO "messages_content_type_enum"`);
    }

}
