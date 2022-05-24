import { MigrationInterface, QueryRunner } from "typeorm";

export class addConfirmedFieldToFoodTable1653378368707
  implements MigrationInterface
{
  name = "addConfirmedFieldToFoodTable1653378368707";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "foods" ADD "confirmed" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `UPDATE "foods" SET confirmed = true WHERE true`
    );
    await queryRunner.query(
      `
          INSERT INTO permissions (title, sign) VALUES
            ('Censor new food','censor_food');
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          DELETE FROM permissions where sign = 'censor_food';
      `
    )
    await queryRunner.query(`ALTER TABLE "foods" DROP COLUMN "confirmed"`);
  }
}
