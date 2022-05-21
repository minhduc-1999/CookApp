import { MigrationInterface, QueryRunner } from "typeorm";

export class addingStoragePermissionForSysAdmin1653119665550
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          DO $$ 
          DECLARE
            adminRoleId uuid;
            get_signed_url uuid;
          BEGIN 
            select r.id into adminRoleId from roles r where r.sign = 'sys-admin';
            select p.id into get_signed_url from permissions p where p.sign = 'get_signed_url';
            insert into role_permissions (role_id, permission_id) values (adminRoleId, get_signed_url);
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
            get_signed_url uuid;
          BEGIN 
            select r.id into adminRoleId from roles r where r.sign = 'sys-admin';
            select p.id into get_signed_url from permissions p where p.sign = 'get_signed_url';
            delete from role_permissions where role_id = adminRoleId and permission_id = get_signed_url;
          END $$;
        `
    );
  }
}
