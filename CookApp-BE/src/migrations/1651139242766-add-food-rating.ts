import { MigrationInterface, QueryRunner } from "typeorm";

export class addFoodRating1651139242766 implements MigrationInterface {
  name = "addFoodRating1651139242766";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "foods" ADD "rating" real`);
    await queryRunner.query(
      `
        CREATE OR REPLACE FUNCTION food_vote_change_trigger_fnc() returns trigger 
            AS
            $$
            Declare  
              numOfVote integer;
              starSum integer;
            Begin
              SELECT COUNT(*) INTO numOfVote FROM "food_votes" WHERE food_id = new."food_id" AND deleted_at IS NULL;
              SELECT SUM(star) INTO starSum FROM "food_votes" WHERE food_id = new."food_id" AND deleted_at IS NULL;
              UPDATE foods SET rating = starSum::FLOAT / numOfVote WHERE id = new."food_id";
              RETURN new;
        END;
        $$
        LANGUAGE 'plpgsql';
      `
    );
    await queryRunner.query(
      `
        CREATE TRIGGER food_vote_change_trigger
        AFTER INSERT OR UPDATE OF star, deleted_at
        ON "food_votes"
        FOR EACH ROW
        EXECUTE PROCEDURE food_vote_change_trigger_fnc();
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP trigger food_vote_change_trigger ON food_votes;`)
    await queryRunner.query(`DROP FUNCTION food_vote_change_trigger_fnc;`)
    await queryRunner.query(`ALTER TABLE "foods" DROP COLUMN "rating";`);
  }
}
