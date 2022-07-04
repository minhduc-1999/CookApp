import { MigrationInterface, QueryRunner } from "typeorm";

export class addRequestPermission1656954026662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO permissions (title, sign) VALUES 
          ('Send request','send_request'),
          ('Manage request','manage_request'),
          ('Read request','read_request')
        `
    );
    await queryRunner.query(
      `
          DO $$ 
          DECLARE
            userRoleId uuid;
            adminRoleId uuid;
            nutritionistRoleId uuid;

            send_request uuid;
            manage_request uuid;
            read_request uuid;

          BEGIN 
            select r.id into userRoleId from roles r where r.sign = 'user';
            select r.id into nutritionistRoleId from roles r where r.sign = 'nutritionist';
            select r.id into adminRoleId from roles r where r.sign = 'sys-admin';

            select p.id into send_request from permissions p where p.sign = 'send_request';
            select p.id into manage_request from permissions p where p.sign = 'manage_request';
            select p.id into read_request from permissions p where p.sign = 'read_request';

            insert into role_permissions (role_id, permission_id) values (userRoleId, send_request);
            insert into role_permissions (role_id, permission_id) values (userRoleId, read_request);

            insert into role_permissions (role_id, permission_id) values (adminRoleId, manage_request);

            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, read_request);
          END $$;
        `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          DO $$ 
          DECLARE
            userRoleId uuid;
            adminRoleId uuid;
            nutritionistRoleId uuid;

            send_request uuid;
            manage_request uuid;
            read_request uuid;

          BEGIN 
            select r.id into userRoleId from roles r where r.sign = 'user';
            select r.id into nutritionistRoleId from roles r where r.sign = 'nutritionist';
            select r.id into adminRoleId from roles r where r.sign = 'sys-admin';

            select p.id into send_request from permissions p where p.sign = 'send_request';
            select p.id into manage_request from permissions p where p.sign = 'manage_request';
            select p.id into read_request from permissions p where p.sign = 'read_request';

            delete from role_permissions where role_id = userRoleId and permission_id = send_request;
            delete from role_permissions where role_id = userRoleId and permission_id = read_request;

            delete from role_permissions where role_id = nutritionistRoleId and permission_id = read_request;

            delete from role_permissions where role_id = adminRoleId and permission_id = manage_request;
          END $$;
        `
    );
    await queryRunner.query(
      `delete from permissions where sign in ('send_request', 'manage_request', 'read_request')`
    );
  }
}
