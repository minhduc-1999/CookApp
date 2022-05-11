import {MigrationInterface, QueryRunner} from "typeorm";

export class addAuthorInFoodTable1650625226810 implements MigrationInterface {
    name = 'addAuthorInFoodTable1650625226810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "foods" ADD "author_id" uuid`);
        await queryRunner.query(`ALTER TABLE "foods" ADD CONSTRAINT "FK_1a466eba168938a374670b5d3db" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "foods" DROP CONSTRAINT "FK_1a466eba168938a374670b5d3db"`);
        await queryRunner.query(`ALTER TABLE "foods" DROP COLUMN "author_id"`);
    }

}
