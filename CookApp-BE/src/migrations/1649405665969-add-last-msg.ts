import { MigrationInterface, QueryRunner } from "typeorm";

export class addLastMsg1649405665969 implements MigrationInterface {
  name = 'addLastMsg1649405665969'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "conversations" ADD "last_message_id" uuid`);
    await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "UQ_a53679287450d522a3f700088e9" UNIQUE ("last_message_id")`);
    await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_a53679287450d522a3f700088e9" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION message_insert_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              update conversations set last_message_id = new."id" where id = new."conversation_id";
              return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
    await queryRunner.query(`
            CREATE TRIGGER message_insert_trigger
            AFTER INSERT
            ON "messages"
            FOR EACH ROW
            EXECUTE PROCEDURE message_insert_trigger_fnc();`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER message_insert_trigger ON messages`)
    await queryRunner.query(`DROP FUNCTION message_insert_trigger_fnc`)

    await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_a53679287450d522a3f700088e9"`);
    await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "UQ_a53679287450d522a3f700088e9"`);
    await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "last_message_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "status" character varying NOT NULL DEFAULT ''`);
  }

}
