import { MigrationInterface, QueryRunner } from "typeorm";

export class addingWallPermission1653299113521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          INSERT INTO permissions (title, sign) VALUES
            ('Read user''s wall infomation','read_wall_info');
      `
    )
    await queryRunner.query(
      `
          DO $$ 
          DECLARE
            adminRoleId uuid;
            userRoleId uuid;
            nutritionistRoleId uuid;
            read_wall_info uuid;
          BEGIN 
            select r.id into adminRoleId from roles r where r.sign = 'sys-admin';
            select r.id into userRoleId from roles r where r.sign = 'user';
            select r.id into nutritionistRoleId from roles r where r.sign = 'nutritionist';

            select p.id into read_wall_info from permissions p where p.sign = 'read_wall_info';

            insert into role_permissions (role_id, permission_id) values (adminRoleId, read_wall_info);
            insert into role_permissions (role_id, permission_id) values (userRoleId, read_wall_info);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, read_wall_info);
          END $$;
        `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          DO $$ 
          DECLARE
            adminRoleId uuid;
            userRoleId uuid;
            nutritionistRoleId uuid;
            read_wall_info uuid;
          BEGIN 
            select r.id into adminRoleId from roles r where r.sign = 'sys-admin';
            select r.id into userRoleId from roles r where r.sign = 'user';
            select r.id into nutritionistRoleId from roles r where r.sign = 'nutritionist';

            select p.id into read_wall_info from permissions p where p.sign = 'read_wall_info';

            delete from role_permissions where role_id = adminRoleId and permission_id = read_wall_info;
            delete from role_permissions where role_id = userRoleId and permission_id = read_wall_info;
            delete from role_permissions where role_id = nutritionistRoleId and permission_id = read_wall_info;
          END $$;
        `
    );
    await queryRunner.query(
      `
          DELETE FROM permissions where sign = 'read_wall_info';
      `
    )
  }
}
