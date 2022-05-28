import {MigrationInterface, QueryRunner} from "typeorm";

export class addSaveFoodTable1653721141137 implements MigrationInterface {
    name = 'addSaveFoodTable1653721141137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."saved_foods_type_enum" AS ENUM('should', 'should_not')`);
        await queryRunner.query(`CREATE TABLE "saved_foods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."saved_foods_type_enum" NOT NULL, "user_id" uuid NOT NULL, "food_id" uuid NOT NULL, CONSTRAINT "PK_5c7fa1b323a84aae6320eb34018" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT 'images/avatars/avatar-default.png'`);
        await queryRunner.query(`ALTER TABLE "saved_foods" ADD CONSTRAINT "FK_05db3dca4936b02250c3a6db4bc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_foods" ADD CONSTRAINT "FK_7c7baf2e15c1aae73c3481a3d82" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_foods" DROP CONSTRAINT "FK_7c7baf2e15c1aae73c3481a3d82"`);
        await queryRunner.query(`ALTER TABLE "saved_foods" DROP CONSTRAINT "FK_05db3dca4936b02250c3a6db4bc"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT 'images/avatar-default.png'`);
        await queryRunner.query(`DROP TABLE "saved_foods"`);
        await queryRunner.query(`DROP TYPE "public"."saved_foods_type_enum"`);
    }

}
