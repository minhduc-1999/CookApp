import {MigrationInterface, QueryRunner} from "typeorm";

export class init41648144887175 implements MigrationInterface {
    name = 'init41648144887175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "comments" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "reactions" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "reactions" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "comments" DROP DEFAULT`);
    }

}
