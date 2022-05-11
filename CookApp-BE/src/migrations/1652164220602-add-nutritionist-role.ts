import { MigrationInterface, QueryRunner } from "typeorm";

export class addNutritionistRole1652164220602 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO roles (title, slug) VALUES 
            ('Nutritionist', 'nutritionist');
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM roles WHERE slug = 'nutritionist'`
    )
  }
}
