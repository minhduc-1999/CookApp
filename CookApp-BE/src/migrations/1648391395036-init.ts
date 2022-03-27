import {MigrationInterface, QueryRunner} from "typeorm";

export class init1648391395036 implements MigrationInterface {
    name = 'init1648391395036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "core"."units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "cover_img" character varying NOT NULL, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."food_ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "quantity" integer NOT NULL, "unit_id" uuid, "food_id" uuid, "ingredient_id" uuid, CONSTRAINT "PK_db9f90a2adec24b3d8813e955ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "social"."providers_provider_type_enum" AS ENUM('GOOGLE')`);
        await queryRunner.query(`CREATE TABLE "social"."providers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "provider_type" "social"."providers_provider_type_enum" NOT NULL, "external_id" character varying NOT NULL, "account_id" uuid NOT NULL, CONSTRAINT "REL_a825cc60e97688893cd951f3d7" UNIQUE ("account_id"), CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "social"."accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "email_verified" boolean NOT NULL DEFAULT false, "phone" character varying, "password" character varying, "user_id" uuid NOT NULL, CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE ("username"), CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0" UNIQUE ("email"), CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "social"."follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "follower_id" uuid, "followee_id" uuid, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "social"."users_sex_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "social"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "height" integer, "weight" integer, "birth_date" TIMESTAMP, "first_name" character varying, "last_name" character varying, "sex" "social"."users_sex_enum", "n_followers" integer NOT NULL DEFAULT '0', "n_followees" integer NOT NULL DEFAULT '0', "n_posts" integer NOT NULL DEFAULT '0', "avatar" character varying NOT NULL DEFAULT 'images/avatar-default.jpg', "display_name" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "social"."posts_kind_enum" AS ENUM('ALBUM', 'MOMENT')`);
        await queryRunner.query(`CREATE TABLE "social"."posts" ("location" character varying, "content" character varying NOT NULL, "kind" "social"."posts_kind_enum" NOT NULL, "id" uuid NOT NULL, "author_id" uuid, CONSTRAINT "REL_2829ac61eff60fcec60d7274b9" UNIQUE ("id"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "social"."post_medias_type_enum" AS ENUM('IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "social"."post_medias" ("type" "social"."post_medias_type_enum" NOT NULL, "key" character varying NOT NULL, "id" uuid NOT NULL, "post_id" uuid, CONSTRAINT "REL_454dd8c598c65ed6c948552610" UNIQUE ("id"), CONSTRAINT "PK_454dd8c598c65ed6c948552610f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "social"."interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "n_comments" integer NOT NULL DEFAULT '0', "n_reactions" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_911b7416a6671b4148b18c18ecb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."recipe_steps" ("content" character varying NOT NULL, "food_id" uuid, "id" uuid NOT NULL, CONSTRAINT "REL_6fa74d528684e8dc16bfe8582f" UNIQUE ("id"), CONSTRAINT "PK_6fa74d528684e8dc16bfe8582f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "core"."recipe_step_medias_type_enum" AS ENUM('IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "core"."recipe_step_medias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "core"."recipe_step_medias_type_enum" NOT NULL, "key" character varying NOT NULL, "recipe_step_id" uuid, CONSTRAINT "PK_fe8b902dcddbfaa68fb8637152d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."foods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "servings" integer NOT NULL, "total_time" integer NOT NULL, "url" character varying NOT NULL, "description" character varying, "name" character varying NOT NULL, "video_url" character varying NOT NULL, CONSTRAINT "PK_0cc83421325632f61fa27a52b59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "core"."food_medias_type_enum" AS ENUM('IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "core"."food_medias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "core"."food_medias_type_enum" NOT NULL, "key" character varying NOT NULL, "food_id" uuid, CONSTRAINT "PK_33e1b75dfc8e3391c0c26f599cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "social"."feeds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, "post_id" uuid, CONSTRAINT "PK_3dafbf766ecbb1eb2017732153f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "social"."comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying NOT NULL, "user_id" uuid, "target_id" uuid, "parent_id" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "social"."comment_medias_type_enum" AS ENUM('IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "social"."comment_medias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "social"."comment_medias_type_enum" NOT NULL, "key" character varying NOT NULL, "comment_id" uuid, CONSTRAINT "PK_5354ecb7ad2aac3c43487f52931" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "social"."saved_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, "post_id" uuid, CONSTRAINT "PK_868375ca4f041a2337a1c1a6634" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "social"."reactions_type_enum" AS ENUM('LOVE')`);
        await queryRunner.query(`CREATE TABLE "social"."reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "social"."reactions_type_enum" NOT NULL, "user_id" uuid, "target_id" uuid, CONSTRAINT "PK_0b213d460d0c473bc2fb6ee27f3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "social"."reactions"`);
        await queryRunner.query(`DROP TYPE "social"."reactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "social"."saved_posts"`);
        await queryRunner.query(`DROP TABLE "social"."comment_medias"`);
        await queryRunner.query(`DROP TYPE "social"."comment_medias_type_enum"`);
        await queryRunner.query(`DROP TABLE "social"."comments"`);
        await queryRunner.query(`DROP TABLE "social"."feeds"`);
        await queryRunner.query(`DROP TABLE "core"."food_medias"`);
        await queryRunner.query(`DROP TYPE "core"."food_medias_type_enum"`);
        await queryRunner.query(`DROP TABLE "core"."foods"`);
        await queryRunner.query(`DROP TABLE "core"."recipe_step_medias"`);
        await queryRunner.query(`DROP TYPE "core"."recipe_step_medias_type_enum"`);
        await queryRunner.query(`DROP TABLE "core"."recipe_steps"`);
        await queryRunner.query(`DROP TABLE "social"."interactions"`);
        await queryRunner.query(`DROP TABLE "social"."post_medias"`);
        await queryRunner.query(`DROP TYPE "social"."post_medias_type_enum"`);
        await queryRunner.query(`DROP TABLE "social"."posts"`);
        await queryRunner.query(`DROP TYPE "social"."posts_kind_enum"`);
        await queryRunner.query(`DROP TABLE "social"."users"`);
        await queryRunner.query(`DROP TYPE "social"."users_sex_enum"`);
        await queryRunner.query(`DROP TABLE "social"."follows"`);
        await queryRunner.query(`DROP TABLE "social"."accounts"`);
        await queryRunner.query(`DROP TABLE "social"."providers"`);
        await queryRunner.query(`DROP TYPE "social"."providers_provider_type_enum"`);
        await queryRunner.query(`DROP TABLE "core"."food_ingredients"`);
        await queryRunner.query(`DROP TABLE "core"."ingredients"`);
        await queryRunner.query(`DROP TABLE "core"."units"`);
    }

}
