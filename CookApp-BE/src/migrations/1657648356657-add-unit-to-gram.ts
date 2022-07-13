import {MigrationInterface, QueryRunner} from "typeorm";

export class addUnitToGram1657648356657 implements MigrationInterface {
    name = 'addUnitToGram1657648356657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD "unit_to_gram" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP COLUMN "unit_to_gram"`);
    }

}
