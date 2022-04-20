import {MigrationInterface, QueryRunner} from "typeorm";

export class addLastSeen1649412457728 implements MigrationInterface {
    name = 'addLastSeen1649412457728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_a53679287450d522a3f700088e9"`);
        await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "last_message_id" TO "last_msg_id"`);
        await queryRunner.query(`ALTER TABLE "conversations" RENAME CONSTRAINT "UQ_a53679287450d522a3f700088e9" TO "UQ_d3ea73ab20704a46343304478e7"`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ADD "last_seen_msg_id" uuid`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_d3ea73ab20704a46343304478e7" FOREIGN KEY ("last_msg_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation_members" ADD CONSTRAINT "FK_25a72f682c4b20ddc369b7f01d6" FOREIGN KEY ("last_seen_msg_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation_members" DROP CONSTRAINT "FK_25a72f682c4b20ddc369b7f01d6"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_d3ea73ab20704a46343304478e7"`);
        await queryRunner.query(`ALTER TABLE "conversation_members" DROP COLUMN "last_seen_msg_id"`);
        await queryRunner.query(`ALTER TABLE "conversations" RENAME CONSTRAINT "UQ_d3ea73ab20704a46343304478e7" TO "UQ_a53679287450d522a3f700088e9"`);
        await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "last_msg_id" TO "last_message_id"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_a53679287450d522a3f700088e9" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
