import {MigrationInterface, QueryRunner} from "typeorm";

export class addFoodReference1650887122428 implements MigrationInterface {
    name = 'addFoodReference1650887122428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "food_ref_id" uuid`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_eef8481f88e114d76da9d14f624" FOREIGN KEY ("food_ref_id") REFERENCES "foods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_eef8481f88e114d76da9d14f624"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "food_ref_id"`);
    }

}
