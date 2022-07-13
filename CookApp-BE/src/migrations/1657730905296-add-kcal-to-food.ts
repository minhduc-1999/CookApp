import {MigrationInterface, QueryRunner} from "typeorm";

export class addKcalToFood1657730905296 implements MigrationInterface {
    name = 'addKcalToFood1657730905296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "foods" ADD "kcal" real`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "foods" DROP COLUMN "kcal"`);
    }

}
