import {MigrationInterface, QueryRunner} from "typeorm";

export class init51648145611731 implements MigrationInterface {
    name = 'init51648145611731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_59962fa0fe4a491273c402e93fa"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interactions" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_59962fa0fe4a491273c402e93fa" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
