import {MigrationInterface, QueryRunner} from "typeorm";

export class alterExpireAtToBeNullable1657123619837 implements MigrationInterface {
    name = 'alterExpireAtToBeNullable1657123619837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" ALTER COLUMN "expire_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" ALTER COLUMN "expire_at" SET NOT NULL`);
    }

}
