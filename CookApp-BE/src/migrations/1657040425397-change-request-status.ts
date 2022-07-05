import {MigrationInterface, QueryRunner} from "typeorm";

export class changeRequestStatus1657040425397 implements MigrationInterface {
    name = 'changeRequestStatus1657040425397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."requests_status_enum" RENAME TO "requests_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."requests_status_enum" AS ENUM('confirmed', 'rejected', 'waiting')`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" TYPE "public"."requests_status_enum" USING "status"::"text"::"public"."requests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT 'waiting'`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."requests_type_enum" RENAME TO "requests_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."requests_type_enum" AS ENUM('request_to_be_nutritionist')`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "type" TYPE "public"."requests_type_enum" USING "type"::"text"::"public"."requests_type_enum"`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "type" SET DEFAULT 'request_to_be_nutritionist'`);
        await queryRunner.query(`DROP TYPE "public"."requests_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."requests_type_enum_old" AS ENUM('REQUEST_TO_BE_NUTRITIONIST')`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "type" TYPE "public"."requests_type_enum_old" USING "type"::"text"::"public"."requests_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "type" SET DEFAULT 'REQUEST_TO_BE_NUTRITIONIST'`);
        await queryRunner.query(`DROP TYPE "public"."requests_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."requests_type_enum_old" RENAME TO "requests_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."requests_status_enum_old" AS ENUM('CONFIRMED', 'REJECT', 'WAITING')`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" TYPE "public"."requests_status_enum_old" USING "status"::"text"::"public"."requests_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT 'WAITING'`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."requests_status_enum_old" RENAME TO "requests_status_enum"`);
    }

}
