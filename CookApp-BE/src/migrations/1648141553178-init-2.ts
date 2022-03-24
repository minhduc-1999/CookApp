import {MigrationInterface, QueryRunner} from "typeorm";

export class init21648141553178 implements MigrationInterface {
    name = 'init21648141553178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interactions" ADD "user_id" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."posts_kind_enum" AS ENUM('ALBUM', 'MOMENT')`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "kind" "public"."posts_kind_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98"`);
        await queryRunner.query(`ALTER TABLE "feeds" DROP CONSTRAINT "FK_a1cb7a8cb9461da1042be030176"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "UQ_2829ac61eff60fcec60d7274b9e" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_454dd8c598c65ed6c948552610f"`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "UQ_454dd8c598c65ed6c948552610f" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_59962fa0fe4a491273c402e93fa" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_454dd8c598c65ed6c948552610f" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feeds" ADD CONSTRAINT "FK_a1cb7a8cb9461da1042be030176" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feeds" DROP CONSTRAINT "FK_a1cb7a8cb9461da1042be030176"`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98"`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "FK_454dd8c598c65ed6c948552610f"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_59962fa0fe4a491273c402e93fa"`);
        await queryRunner.query(`ALTER TABLE "post_medias" DROP CONSTRAINT "UQ_454dd8c598c65ed6c948552610f"`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_454dd8c598c65ed6c948552610f" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "UQ_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "feeds" ADD CONSTRAINT "FK_a1cb7a8cb9461da1042be030176" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_medias" ADD CONSTRAINT "FK_86d1b22bb6d6508941a24ff9f98" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_2829ac61eff60fcec60d7274b9e" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "kind"`);
        await queryRunner.query(`DROP TYPE "public"."posts_kind_enum"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "user_id"`);
    }

}
