import {MigrationInterface, QueryRunner} from "typeorm";

export class createRequestAndCertificateTable1656950012259 implements MigrationInterface {
    name = 'createRequestAndCertificateTable1656950012259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."requests_status_enum" AS ENUM('CONFIRMED', 'REJECT', 'WAITING')`);
        await queryRunner.query(`CREATE TYPE "public"."requests_type_enum" AS ENUM('REQUEST_TO_BE_NUTRITIONIST')`);
        await queryRunner.query(`CREATE TABLE "requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status" "public"."requests_status_enum" NOT NULL DEFAULT 'WAITING', "type" "public"."requests_type_enum" NOT NULL DEFAULT 'REQUEST_TO_BE_NUTRITIONIST', "sender_id" uuid NOT NULL, CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "certificates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying NOT NULL, "issue_at" TIMESTAMP NOT NULL, "expire_at" TIMESTAMP NOT NULL, "issue_by" character varying NOT NULL, "image" character varying NOT NULL, "request_id" uuid NOT NULL, CONSTRAINT "PK_e4c7e31e2144300bea7d89eb165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_7e58368e50d76813c1aca1eb234" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "FK_f434ea93e533e0913f06ad4b7fb" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_f434ea93e533e0913f06ad4b7fb"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_7e58368e50d76813c1aca1eb234"`);
        await queryRunner.query(`DROP TABLE "certificates"`);
        await queryRunner.query(`DROP TABLE "requests"`);
        await queryRunner.query(`DROP TYPE "public"."requests_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum"`);
    }

}
