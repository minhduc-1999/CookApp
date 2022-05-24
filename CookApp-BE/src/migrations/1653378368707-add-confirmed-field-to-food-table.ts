import {MigrationInterface, QueryRunner} from "typeorm";

export class addConfirmedFieldToFoodTable1653378368707 implements MigrationInterface {
    name = 'addConfirmedFieldToFoodTable1653378368707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "foods" ADD "confirmed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "foods" DROP COLUMN "confirmed"`);
    }

}
