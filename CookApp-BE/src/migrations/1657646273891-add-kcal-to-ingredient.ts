import {MigrationInterface, QueryRunner} from "typeorm";

export class addKcalToIngredient1657646273891 implements MigrationInterface {
    name = 'addKcalToIngredient1657646273891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_ingredients" ADD "kcal" integer`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "kcal" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "kcal"`);
        await queryRunner.query(`ALTER TABLE "food_ingredients" DROP COLUMN "kcal"`);
    }

}
