import {MigrationInterface, QueryRunner} from "typeorm";

export class initChatTables1648871129404 implements MigrationInterface {
    name = 'initChatTables1648871129404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."conversations_type_enum" AS ENUM('DIRECT', 'GROUP')`);
        await queryRunner.query(`CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."conversations_type_enum" NOT NULL, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversation_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "conversation_id" uuid, "user_id" uuid, CONSTRAINT "PK_33146a476696a973a14d931e675" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."messages_content_type_enum" AS ENUM('TEXT', 'IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying NOT NULL, "content_type" "public"."messages_content_type_enum" NOT NULL, "conversation_id" uuid, "sender_id" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ADD CONSTRAINT "FK_36340a1704b039608e34244511f" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ADD CONSTRAINT "FK_a46c76be8f62c4b00a835cdc370" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "conversation_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "conversation_members" DROP CONSTRAINT "FK_a46c76be8f62c4b00a835cdc370"`);
        await queryRunner.query(`ALTER TABLE "conversation_members" DROP CONSTRAINT "FK_36340a1704b039608e34244511f"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "public"."messages_content_type_enum"`);
        await queryRunner.query(`DROP TABLE "conversation_members"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
        await queryRunner.query(`DROP TYPE "public"."conversations_type_enum"`);
    }

}
