import { MigrationInterface, QueryRunner } from "typeorm";

export class addAccountRole1650941519549 implements MigrationInterface {
  name = "addAccountRole1650941519549";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "UQ_08e86fada7ae67b1689f948e83e" UNIQUE ("title"), CONSTRAINT "UQ_881f72bac969d9a00a1a29e1079" UNIQUE ("slug"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `INSERT INTO roles (title, slug) VALUES 
            ('System Admin', 'sys-admin'),
            ('User', 'user');
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE true`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
