import { MigrationInterface, QueryRunner } from "typeorm";

export class setFoodAuthor1650963029856 implements MigrationInterface {
  name = "setFoodAuthor1650963029856";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO users(id, display_name, avatar) VALUES ('b6f5a38a-84d3-4111-86af-b218bd0ad48a', 'Tastify', 'images/avatars/tastify.png')`
    );
    await queryRunner.query(
      `UPDATE foods SET author_id = 'b6f5a38a-84d3-4111-86af-b218bd0ad48a' WHERE author_id IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "foods" ALTER COLUMN "author_id" SET NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "foods" ALTER COLUMN "author_id" DROP NOT NULL`
    );
    await queryRunner.query(
      `UPDATE foods SET author_id = NULL WHERE author_id = 'b6f5a38a-84d3-4111-86af-b218bd0ad48a'`
    );
    await queryRunner.query(
      `DELETE FROM users WHERE id = 'b6f5a38a-84d3-4111-86af-b218bd0ad48a'`
    );
  }
}
