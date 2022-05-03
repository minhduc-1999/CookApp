import { MigrationInterface, QueryRunner } from "typeorm";

export class addLastSeenTrigger1650101072182 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION message_insert_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              update conversations 
              set 
                last_msg_id = new."id" 
              where 
                id = new."conversation_id";

              update conversation_members 
              set 
                last_seen_msg_id = new."id" 
              where 
                id = new."sender_id";
              return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION message_insert_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              update conversations set last_msg_id = new."id" where id = new."conversation_id";
              return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
  }

}
