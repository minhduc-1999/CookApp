import { MigrationInterface, QueryRunner } from "typeorm";

export class createPermissionData1652173708355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO permissions (title, sign) VALUES 
          ('Create moment post type','create_moment_post'),
          ('Create share food post type','create_share_food_post'),
          ('Create recommendation post type','create_recommendation_post'),
          ('Edit post','edit_post'),
          ('Delete post','delete_post'),
          ('Read post','read_post'),
          ('Manage post','manage_post'),
          ('Create album','create_album'),
          ('Edit album','edit_album'),
          ('Delete album','delete_album'),
          ('Read album','read_album'),
          ('Manage album','manage_album'),
          ('Get upload url','get_signed_url'),
          ('Create user','create_user'),
          ('Edit user','edit_user'),
          ('Delete user','delete_user'),
          ('Read user','read_user'),
          ('Manage user','manage_user'),
          ('Create topic','create_topic'),
          ('Read topic','read_topic'),
          ('Update topic','update_topic'),
          ('Delete topic','delete_topic'),
          ('Manage topic','manage_topic'),
          ('Create food','create_food'),
          ('Edit food','edit_food'),
          ('Delete food','delete_food'),
          ('Read food','read_food'),
          ('Manage food','manage_food'),
          ('Create ingredient','create_ingredient'),
          ('Edit ingredient','edit_ingredient'),
          ('Delete ingredient','delete_ingredient'),
          ('Read ingredient','read_ingredient'),
          ('Manage ingredient','manage_ingredient'),
          ('Create unit','create_unit'),
          ('Edit unit','edit_unit'),
          ('Delete unit','delete_unit'),
          ('Read unit','read_unit'),
          ('Manage unit','manage_unit');
        `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM permissions WHERE true`
    )
  }
}
