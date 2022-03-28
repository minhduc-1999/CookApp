import { MigrationInterface, QueryRunner } from "typeorm";

export class initTrigger1648461869105 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION reaction_insert_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              update interactions set n_reactions = n_reactions + 1 where id = new."target_id";
              return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
    await queryRunner.query(`
            CREATE TRIGGER reaction_insert_trigger
            AFTER INSERT
            ON "reactions"
            FOR EACH ROW
            EXECUTE PROCEDURE  reaction_insert_trigger_fnc();`
    )
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION reaction_soft_delete_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              if new."deleted_at" is not null then 
                  update interactions set n_reactions = n_reactions - 1 where id = new."target_id";
              end if;
                return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
    await queryRunner.query(`
            CREATE TRIGGER reaction_soft_delete_trigger
            AFTER update 
            ON "reactions"
            FOR EACH ROW
            EXECUTE PROCEDURE  reaction_soft_delete_trigger_fnc();`
    )
    //==================================================
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION comment_insert_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              update interactions set n_comments = n_comments + 1 where id = new."target_id";
              return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
    await queryRunner.query(`
            CREATE TRIGGER comment_insert_trigger
            AFTER INSERT
            ON "comments"
            FOR EACH ROW
            EXECUTE PROCEDURE comment_insert_trigger_fnc();`
    )
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION comment_soft_delete_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              if new."deleted_at" is not null then 
                  update interactions set n_comments = n_comments - 1 where id = new."target_id";
              end if;
                return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
    await queryRunner.query(`
            CREATE TRIGGER comment_soft_delete_trigger
            AFTER update 
            ON "comments"
            FOR EACH ROW
            EXECUTE PROCEDURE comment_soft_delete_trigger_fnc();`
    )

    //=====================================================
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION follow_insert_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              update users set n_followers = n_followers + 1 where id = new."followee_id";
              update users set n_followees = n_followees + 1 where id = new."follower_id";
              return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
    await queryRunner.query(`
            CREATE TRIGGER follow_insert_trigger
            AFTER INSERT
            ON "follows"
            FOR EACH ROW
            EXECUTE PROCEDURE follow_insert_trigger_fnc();`
    )
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION follow_soft_delete_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              if new."deleted_at" is not null then 
                update users set n_followers = n_followers - 1 where id = new."followee_id";
                update users set n_followees = n_followees - 1 where id = new."follower_id";
              end if;
                return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
    await queryRunner.query(`
            CREATE TRIGGER follow_soft_delete_trigger
            AFTER update 
            ON "follows"
            FOR EACH ROW
            EXECUTE PROCEDURE follow_soft_delete_trigger_fnc();`
    )
    //=====================================================
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION post_insert_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              update users set n_posts = n_posts + 1 where id = new."author_id";
              return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
    await queryRunner.query(`
            CREATE TRIGGER post_insert_trigger
            AFTER INSERT
            ON "posts"
            FOR EACH ROW
            EXECUTE PROCEDURE post_insert_trigger_fnc();`
    )
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION post_soft_delete_trigger_fnc() returns trigger 
            AS
            $$
            BEGIN
              if new."deleted_at" is not null then 
                update users set n_posts = n_posts - 1 where id = new."author_id";
              end if;
                return new;
            END;
            $$
            LANGUAGE 'plpgsql';`
    )
    await queryRunner.query(`
            CREATE TRIGGER post_soft_delete_trigger
            AFTER update 
            ON "posts"
            FOR EACH ROW
            EXECUTE PROCEDURE post_soft_delete_trigger_fnc();`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER post_soft_delete_trigger ON posts`)
    await queryRunner.query(`DROP FUNCTION post_soft_delete_trigger_fnc`)
    await queryRunner.query(`DROP TRIGGER post_insert_trigger ON posts`)
    await queryRunner.query(`DROP FUNCTION post_insert_trigger_fnc`)

    await queryRunner.query(`DROP TRIGGER follow_soft_delete_trigger ON follows`)
    await queryRunner.query(`DROP FUNCTION follow_soft_delete_trigger_fnc`)
    await queryRunner.query(`DROP TRIGGER follow_insert_trigger ON follows`)
    await queryRunner.query(`DROP FUNCTION follow_insert_trigger_fnc`)

    await queryRunner.query(`DROP TRIGGER comment_soft_delete_trigger ON comments`)
    await queryRunner.query(`DROP FUNCTION comment_soft_delete_trigger_fnc`)
    await queryRunner.query(`DROP TRIGGER comment_insert_trigger ON comments`)
    await queryRunner.query(`DROP FUNCTION comment_insert_trigger_fnc`)

    await queryRunner.query(`DROP TRIGGER reaction_soft_delete_trigger ON reactions`)
    await queryRunner.query(`DROP FUNCTION reaction_soft_delete_trigger_fnc`)
    await queryRunner.query(`DROP TRIGGER reaction_insert_trigger ON reactions`)
    await queryRunner.query(`DROP FUNCTION reaction_insert_trigger_fnc`)
  }

}
