import {MigrationInterface, QueryRunner} from "typeorm";

export class addRolePermission1652173015415 implements MigrationInterface {
    name = 'addRolePermission1652173015415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "slug" TO "sign"`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME CONSTRAINT "UQ_881f72bac969d9a00a1a29e1079" TO "UQ_8391928366157eebd8e89579870"`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "sign" character varying NOT NULL, CONSTRAINT "UQ_70a7ef38a152b254914c868cc94" UNIQUE ("title"), CONSTRAINT "UQ_8b6e24ee112358f3545572af808" UNIQUE ("sign"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_181be57bee321617d2309faadcb"`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "role_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_181be57bee321617d2309faadcb" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_181be57bee321617d2309faadcb"`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_181be57bee321617d2309faadcb" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME CONSTRAINT "UQ_8391928366157eebd8e89579870" TO "UQ_881f72bac969d9a00a1a29e1079"`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "sign" TO "slug"`);
    }
}
