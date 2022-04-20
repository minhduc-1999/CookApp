import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorFood1648412957364 implements MigrationInterface {
    name = 'refactorFood1648412957364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP CONSTRAINT "FK_0486de862af12f92a1af2ff489a"`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP CONSTRAINT "FK_8c67a81d61cd2e2564493ff2dd5"`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP COLUMN "unit_id"`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP COLUMN "ingredient_id"`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD "unit" character varying`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD "ingredient" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD "quantity" double precision`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "feeds" DROP CONSTRAINT "FK_a1cb7a8cb9461da1042be030176"`);
        await queryRunner.query(`ALTER TABLE "saved_posts" DROP CONSTRAINT "FK_116e9df57f5221cc1a77c3d1cfe"`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "UQ_2829ac61eff60fcec60d7274b9e" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_454dd8c598c65ed6c948552610f"`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "UQ_454dd8c598c65ed6c948552610f" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" DROP CONSTRAINT "FK_6fa74d528684e8dc16bfe8582f2"`);
        await queryRunner.query(`ALTER TABLE "recipe_step_medias" DROP CONSTRAINT "FK_0f6f0cd4585d1af373ca1a7c707"`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" ADD CONSTRAINT "UQ_6fa74d528684e8dc16bfe8582f2" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "foods" ALTER COLUMN "url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "foods" ALTER COLUMN "video_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_454dd8c598c65ed6c948552610f" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" ADD CONSTRAINT "FK_6fa74d528684e8dc16bfe8582f2" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_step_medias" ADD CONSTRAINT "FK_0f6f0cd4585d1af373ca1a7c707" FOREIGN KEY ("recipe_step_id") REFERENCES "recipe_steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feeds" ADD CONSTRAINT "FK_a1cb7a8cb9461da1042be030176" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_posts" ADD CONSTRAINT "FK_116e9df57f5221cc1a77c3d1cfe" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "units"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "cover_img" character varying NOT NULL, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "saved_posts" DROP CONSTRAINT "FK_116e9df57f5221cc1a77c3d1cfe"`);
        await queryRunner.query(`ALTER TABLE "feeds" DROP CONSTRAINT "FK_a1cb7a8cb9461da1042be030176"`);
        await queryRunner.query(`ALTER TABLE "recipe_step_medias" DROP CONSTRAINT "FK_0f6f0cd4585d1af373ca1a7c707"`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" DROP CONSTRAINT "FK_6fa74d528684e8dc16bfe8582f2"`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98"`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_454dd8c598c65ed6c948552610f"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "foods" ALTER COLUMN "video_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "foods" ALTER COLUMN "url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" DROP CONSTRAINT "UQ_6fa74d528684e8dc16bfe8582f2"`);
        await queryRunner.query(`ALTER TABLE "recipe_step_medias" ADD CONSTRAINT "FK_0f6f0cd4585d1af373ca1a7c707" FOREIGN KEY ("recipe_step_id") REFERENCES "recipe_steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_steps" ADD CONSTRAINT "FK_6fa74d528684e8dc16bfe8582f2" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "UQ_454dd8c598c65ed6c948552610f"`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_454dd8c598c65ed6c948552610f" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "UQ_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_posts" ADD CONSTRAINT "FK_116e9df57f5221cc1a77c3d1cfe" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feeds" ADD CONSTRAINT "FK_a1cb7a8cb9461da1042be030176" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP COLUMN "ingredient"`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD "ingredient_id" uuid`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD "unit_id" uuid`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD CONSTRAINT "FK_8c67a81d61cd2e2564493ff2dd5" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD CONSTRAINT "FK_0486de862af12f92a1af2ff489a" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
