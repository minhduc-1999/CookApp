import {MigrationInterface, QueryRunner} from "typeorm";

export class refAlbumInteraction1650989499356 implements MigrationInterface {
    name = 'refAlbumInteraction1650989499356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "album_medias" DROP CONSTRAINT "FK_277932a86b80ea2d23c434adb7f"`);
        await queryRunner.query(`ALTER TABLE "albums" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "UQ_838ebae24d2e12082670ffc95d7" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "albums" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_838ebae24d2e12082670ffc95d7" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_medias" ADD CONSTRAINT "FK_277932a86b80ea2d23c434adb7f" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album_medias" DROP CONSTRAINT "FK_277932a86b80ea2d23c434adb7f"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_838ebae24d2e12082670ffc95d7"`);
        await queryRunner.query(`ALTER TABLE "albums" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "UQ_838ebae24d2e12082670ffc95d7"`);
        await queryRunner.query(`ALTER TABLE "albums" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "album_medias" ADD CONSTRAINT "FK_277932a86b80ea2d23c434adb7f" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "deleted_at" TIMESTAMP`);
    }

}
