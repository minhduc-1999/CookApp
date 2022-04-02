import {MigrationInterface, QueryRunner} from "typeorm";

export class addStatusField1648865262322 implements MigrationInterface {
    name = 'addStatusField1648865262322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "status" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "album_medias" DROP CONSTRAINT "FK_c34ccb571b2b96192bf3dc310b5"`);
        await queryRunner.query(`ALTER TABLE "album_medias" ADD CONSTRAINT "UQ_c34ccb571b2b96192bf3dc310b5" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "album_medias" ADD CONSTRAINT "FK_c34ccb571b2b96192bf3dc310b5" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album_medias" DROP CONSTRAINT "FK_c34ccb571b2b96192bf3dc310b5"`);
        await queryRunner.query(`ALTER TABLE "album_medias" DROP CONSTRAINT "UQ_c34ccb571b2b96192bf3dc310b5"`);
        await queryRunner.query(`ALTER TABLE "album_medias" ADD CONSTRAINT "FK_c34ccb571b2b96192bf3dc310b5" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    }

}
