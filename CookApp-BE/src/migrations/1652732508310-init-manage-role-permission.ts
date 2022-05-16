import { MigrationInterface, QueryRunner } from "typeorm";

export class initManageRolePermission1652732508310
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO permissions (title, sign) VALUES 
          ('Manage role','manage_role');
      `
    );
    await queryRunner.query(
      `
          DO $$ 
          DECLARE
            adminRoleId uuid;
            manage_role uuid;
          BEGIN 
            select r.id into adminRoleId from roles r where r.sign = 'sys-admin';
            select p.id into manage_role from permissions p where p.sign = 'manage_role';
            insert into role_permissions (role_id, permission_id) values (adminRoleId, manage_role);
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
            manage_role uuid;
          BEGIN 
            select r.id into adminRoleId from roles r where r.sign = 'sys-admin';
            select p.id into manage_role from permissions p where p.sign = 'manage_role';
            DELETE FROM role_permissions WHERE role_id = adminRoleId AND permission_id = manage_role;
          END $$;
        `
    );
    await queryRunner.query(
      `
      DELETE FROM permissions WHERE sign = 'manage_role'
      `
    );
  }
}
