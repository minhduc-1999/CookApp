import {MigrationInterface, QueryRunner} from "typeorm";

export class changeFoodConfirmedToStatus1654414816153 implements MigrationInterface {
    name = 'changeFoodConfirmedToStatus1654414816153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "foods" RENAME COLUMN "confirmed" TO "status"`);
        await queryRunner.query(`ALTER TABLE "foods" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."foods_status_enum" AS ENUM('confirmed', 'dismissed', 'uncensored')`);
        await queryRunner.query(`ALTER TABLE "foods" ADD "status" "public"."foods_status_enum" NOT NULL DEFAULT 'uncensored'`);
        await queryRunner.query(`update foods set status =  'confirmed' where true`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "foods" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."foods_status_enum"`);
        await queryRunner.query(`ALTER TABLE "foods" ADD "status" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "foods" RENAME COLUMN "status" TO "confirmed"`);
    }

}
