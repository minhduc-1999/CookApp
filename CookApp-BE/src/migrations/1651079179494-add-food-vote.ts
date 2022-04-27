import {MigrationInterface, QueryRunner} from "typeorm";

export class addFoodVote1651079179494 implements MigrationInterface {
    name = 'addFoodVote1651079179494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "food_votes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "star" integer NOT NULL, "comment" character varying, "author_id" uuid NOT NULL, "food_id" uuid NOT NULL, CONSTRAINT "PK_a4427d4fb4507db2368eb050d3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "food_votes" ADD CONSTRAINT "FK_8bf2e78cea76569398d077a31de" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food_votes" ADD CONSTRAINT "FK_9cf0f7663973dc855571c659e9a" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_votes" DROP CONSTRAINT "FK_9cf0f7663973dc855571c659e9a"`);
        await queryRunner.query(`ALTER TABLE "food_votes" DROP CONSTRAINT "FK_8bf2e78cea76569398d077a31de"`);
        await queryRunner.query(`DROP TABLE "food_votes"`);
    }

}
