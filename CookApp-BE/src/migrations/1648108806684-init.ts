import {MigrationInterface, QueryRunner} from "typeorm";

export class init1648108806684 implements MigrationInterface {
    name = 'init1648108806684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."providers_provider_type_enum" AS ENUM('GOOGLE')`);
        await queryRunner.query(`CREATE TABLE "providers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "provider_type" "public"."providers_provider_type_enum" NOT NULL, "external_id" character varying NOT NULL, "account_id" uuid NOT NULL, CONSTRAINT "REL_a825cc60e97688893cd951f3d7" UNIQUE ("account_id"), CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "email_verified" boolean NOT NULL DEFAULT false, "phone" character varying, "password" character varying, "user_id" uuid NOT NULL, CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE ("username"), CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0" UNIQUE ("email"), CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_sex_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "height" integer, "weight" integer, "birth_date" TIMESTAMP, "first_name" character varying, "last_name" character varying, "sex" "public"."users_sex_enum", "followers" integer NOT NULL DEFAULT '0', "followees" integer NOT NULL DEFAULT '0', "posts" integer NOT NULL DEFAULT '0', "avatar" character varying NOT NULL DEFAULT 'images/avatar-default.jpg', "display_name" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."interactions_type_enum" AS ENUM('POST', 'MEDIA', 'RECIPE_STEP')`);
        await queryRunner.query(`CREATE TABLE "interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."interactions_type_enum" NOT NULL, "comments" integer NOT NULL, "reactions" integer NOT NULL, CONSTRAINT "PK_911b7416a6671b4148b18c18ecb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying NOT NULL, "user_id" uuid, "target_id" uuid, "parent_id" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."comment_medias_type_enum" AS ENUM('IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "comment_medias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."comment_medias_type_enum" NOT NULL, "key" character varying NOT NULL, "comment_id" uuid, CONSTRAINT "PK_5354ecb7ad2aac3c43487f52931" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("location" character varying NOT NULL, "status" character varying NOT NULL, "content" character varying NOT NULL, "id" uuid NOT NULL, "author_id" uuid, CONSTRAINT "REL_2829ac61eff60fcec60d7274b9" UNIQUE ("id"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."post_medias_type_enum" AS ENUM('IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "post_medias" ("type" "public"."post_medias_type_enum" NOT NULL, "key" character varying NOT NULL, "id" uuid NOT NULL, "post_id" uuid, CONSTRAINT "REL_454dd8c598c65ed6c948552610" UNIQUE ("id"), CONSTRAINT "PK_454dd8c598c65ed6c948552610f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feeds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, "post_id" uuid, CONSTRAINT "PK_3dafbf766ecbb1eb2017732153f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "follower_id" uuid, "followee_id" uuid, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reactions_type_enum" AS ENUM('LOVE')`);
        await queryRunner.query(`CREATE TABLE "reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."reactions_type_enum" NOT NULL, "user_id" uuid, "target_id" uuid, CONSTRAINT "PK_0b213d460d0c473bc2fb6ee27f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "providers" ADD CONSTRAINT "FK_a825cc60e97688893cd951f3d7e" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_eb85ecb7fe2892be68166eea8a9" FOREIGN KEY ("target_id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_d6f93329801a93536da4241e386" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_medias" ADD CONSTRAINT "FK_2e7c10a74492b4eee1c8d8a9520" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_454dd8c598c65ed6c948552610f" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feeds" ADD CONSTRAINT "FK_ca81f22ea67d9df1257df35afb9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feeds" ADD CONSTRAINT "FK_a1cb7a8cb9461da1042be030176" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_54b5dc2739f2dea57900933db66" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_1984b177379388946c21afcdaa9" FOREIGN KEY ("followee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_dde6062145a93649adc5af3946e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_9b401ddbeca7c98f38d625c4232" FOREIGN KEY ("target_id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_9b401ddbeca7c98f38d625c4232"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_dde6062145a93649adc5af3946e"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_1984b177379388946c21afcdaa9"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_54b5dc2739f2dea57900933db66"`);
        await queryRunner.query(`ALTER TABLE "feeds" DROP CONSTRAINT "FK_a1cb7a8cb9461da1042be030176"`);
        await queryRunner.query(`ALTER TABLE "feeds" DROP CONSTRAINT "FK_ca81f22ea67d9df1257df35afb9"`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98"`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_454dd8c598c65ed6c948552610f"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "comment_medias" DROP CONSTRAINT "FK_2e7c10a74492b4eee1c8d8a9520"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_d6f93329801a93536da4241e386"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_eb85ecb7fe2892be68166eea8a9"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP CONSTRAINT "FK_a825cc60e97688893cd951f3d7e"`);
        await queryRunner.query(`DROP TABLE "reactions"`);
        await queryRunner.query(`DROP TYPE "public"."reactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "feeds"`);
        await queryRunner.query(`DROP TABLE "post_medias"`);
        await queryRunner.query(`DROP TYPE "public"."post_medias_type_enum"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "comment_medias"`);
        await queryRunner.query(`DROP TYPE "public"."comment_medias_type_enum"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "interactions"`);
        await queryRunner.query(`DROP TYPE "public"."interactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_sex_enum"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "providers"`);
        await queryRunner.query(`DROP TYPE "public"."providers_provider_type_enum"`);
    }

}
