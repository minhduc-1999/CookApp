import {MigrationInterface, QueryRunner} from "typeorm";

export class createAlbumTable1648631153907 implements MigrationInterface {
    name = 'createAlbumTable1648631153907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "owner_id" uuid, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."album_medias_type_enum" AS ENUM('IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "album_medias" ("type" "public"."album_medias_type_enum" NOT NULL, "key" character varying NOT NULL, "id" uuid NOT NULL, "album_id" uuid, CONSTRAINT "REL_c34ccb571b2b96192bf3dc310b" UNIQUE ("id"), CONSTRAINT "PK_c34ccb571b2b96192bf3dc310b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."posts_kind_enum" RENAME TO "posts_kind_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."posts_kind_enum" AS ENUM('MOMENT')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "kind" TYPE "public"."posts_kind_enum" USING "kind"::"text"::"public"."posts_kind_enum"`);
        await queryRunner.query(`DROP TYPE "public"."posts_kind_enum_old"`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_14dfb720709372ede2fc2e15859" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_medias" ADD CONSTRAINT "FK_c34ccb571b2b96192bf3dc310b5" FOREIGN KEY ("id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_medias" ADD CONSTRAINT "FK_277932a86b80ea2d23c434adb7f" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album_medias" DROP CONSTRAINT "FK_277932a86b80ea2d23c434adb7f"`);
        await queryRunner.query(`ALTER TABLE "album_medias" DROP CONSTRAINT "FK_c34ccb571b2b96192bf3dc310b5"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_14dfb720709372ede2fc2e15859"`);
        await queryRunner.query(`CREATE TYPE "public"."posts_kind_enum_old" AS ENUM('ALBUM', 'MOMENT')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "kind" TYPE "public"."posts_kind_enum_old" USING "kind"::"text"::"public"."posts_kind_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."posts_kind_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."posts_kind_enum_old" RENAME TO "posts_kind_enum"`);
        await queryRunner.query(`DROP TABLE "album_medias"`);
        await queryRunner.query(`DROP TYPE "public"."album_medias_type_enum"`);
        await queryRunner.query(`DROP TABLE "albums"`);
    }

}
