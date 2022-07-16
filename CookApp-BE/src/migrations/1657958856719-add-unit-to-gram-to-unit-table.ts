import {MigrationInterface, QueryRunner} from "typeorm";

export class addUnitToGramToUnitTable1657958856719 implements MigrationInterface {
    name = 'addUnitToGramToUnitTable1657958856719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" ADD "to_gram" double precision`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "kcal"`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "kcal" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "kcal"`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "kcal" integer`);
        await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "to_gram"`);
    }

}
