import { MigrationInterface, QueryRunner } from "typeorm";

export class addAccountRoleRelationship1650942408970
  implements MigrationInterface
{
  name = "addAccountRoleRelationship1650942408970";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "accounts" ADD "role_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_181be57bee321617d2309faadcb" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `UPDATE accounts SET role_id = (SELECT r.id FROM roles r WHERE r.slug = 'user') WHERE true`
    );
    await queryRunner.query(
      `ALTER  TABLE "accounts" ALTER COLUMN "role_id" SET NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_181be57bee321617d2309faadcb"`
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "role_id"`);
  }
}
