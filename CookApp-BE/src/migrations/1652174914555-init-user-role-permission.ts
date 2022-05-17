import {MigrationInterface, QueryRunner} from "typeorm";

export class initUserRolePermission1652174914555 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `
          DO $$ 
          DECLARE
            userRoleId uuid;
            adminRoleId uuid;
            nutritionistRoleId uuid;

            create_moment_post uuid;
            create_share_food_post uuid;
            create_recommendation_post uuid;
            edit_post uuid;
            delete_post uuid;
            read_post uuid;
            manage_post uuid;
            create_album uuid;
            edit_album uuid;
            delete_album uuid;
            read_album uuid;
            manage_album uuid;
            get_signed_url uuid;
            create_user uuid;
            edit_user uuid;
            delete_user uuid;
            read_user uuid;
            manage_user uuid;
            create_topic uuid;
            read_topic uuid;
            update_topic uuid;
            delete_topic uuid;
            manage_topic uuid;
            create_food uuid;
            edit_food uuid;
            delete_food uuid;
            read_food uuid;
            manage_food uuid;
            create_ingredient uuid;
            edit_ingredient uuid;
            delete_ingredient uuid;
            read_ingredient uuid;
            manage_ingredient uuid;
            create_unit uuid;
            edit_unit uuid;
            delete_unit uuid;
            read_unit uuid;
            manage_unit uuid;

          BEGIN 
            select r.id into userRoleId from roles r where r.sign = 'user';
            select r.id into nutritionistRoleId from roles r where r.sign = 'nutritionist';
            select r.id into adminRoleId from roles r where r.sign = 'sys-admin';

            select p.id into create_moment_post from permissions p where p.sign = 'create_moment_post';
            select p.id into create_share_food_post from permissions p where p.sign = 'create_share_food_post';
            select p.id into create_recommendation_post from permissions p where p.sign = 'create_recommendation_post';
            select p.id into edit_post from permissions p where p.sign = 'edit_post';
            select p.id into delete_post from permissions p where p.sign = 'delete_post';
            select p.id into read_post from permissions p where p.sign = 'read_post';
            select p.id into manage_post from permissions p where p.sign = 'manage_post';
            select p.id into create_album from permissions p where p.sign = 'create_album';
            select p.id into edit_album from permissions p where p.sign = 'edit_album';
            select p.id into delete_album from permissions p where p.sign = 'delete_album';
            select p.id into read_album from permissions p where p.sign = 'read_album';
            select p.id into manage_album from permissions p where p.sign = 'manage_album';
            select p.id into get_signed_url from permissions p where p.sign = 'get_signed_url';
            select p.id into create_user from permissions p where p.sign = 'create_user';
            select p.id into edit_user from permissions p where p.sign = 'edit_user';
            select p.id into delete_user from permissions p where p.sign = 'delete_user';
            select p.id into read_user from permissions p where p.sign = 'read_user';
            select p.id into manage_user from permissions p where p.sign = 'manage_user';
            select p.id into create_topic from permissions p where p.sign = 'create_topic';
            select p.id into read_topic from permissions p where p.sign = 'read_topic';
            select p.id into update_topic from permissions p where p.sign = 'update_topic';
            select p.id into delete_topic from permissions p where p.sign = 'delete_topic';
            select p.id into manage_topic from permissions p where p.sign = 'manage_topic';
            select p.id into create_food from permissions p where p.sign = 'create_food';
            select p.id into edit_food from permissions p where p.sign = 'edit_food';
            select p.id into delete_food from permissions p where p.sign = 'delete_food';
            select p.id into read_food from permissions p where p.sign = 'read_food';
            select p.id into manage_food from permissions p where p.sign = 'manage_food';
            select p.id into create_ingredient from permissions p where p.sign = 'create_ingredient';
            select p.id into edit_ingredient from permissions p where p.sign = 'edit_ingredient';
            select p.id into delete_ingredient from permissions p where p.sign = 'delete_ingredient';
            select p.id into read_ingredient from permissions p where p.sign = 'read_ingredient';
            select p.id into manage_ingredient from permissions p where p.sign = 'manage_ingredient';
            select p.id into create_unit from permissions p where p.sign = 'create_unit';
            select p.id into edit_unit from permissions p where p.sign = 'edit_unit';
            select p.id into delete_unit from permissions p where p.sign = 'delete_unit';
            select p.id into read_unit from permissions p where p.sign = 'read_unit';
            select p.id into manage_unit from permissions p where p.sign = 'manage_unit';

            insert into role_permissions (role_id, permission_id) values (userRoleId, create_moment_post);
            insert into role_permissions (role_id, permission_id) values (userRoleId, create_share_food_post);
            insert into role_permissions (role_id, permission_id) values (userRoleId, edit_post);
            insert into role_permissions (role_id, permission_id) values (userRoleId, delete_post);
            insert into role_permissions (role_id, permission_id) values (userRoleId, read_post);
            insert into role_permissions (role_id, permission_id) values (userRoleId, create_album);
            insert into role_permissions (role_id, permission_id) values (userRoleId, edit_album);
            insert into role_permissions (role_id, permission_id) values (userRoleId, delete_album);
            insert into role_permissions (role_id, permission_id) values (userRoleId, read_album);
            insert into role_permissions (role_id, permission_id) values (userRoleId, get_signed_url);
            insert into role_permissions (role_id, permission_id) values (userRoleId, read_topic);
            insert into role_permissions (role_id, permission_id) values (userRoleId, read_user);
            insert into role_permissions (role_id, permission_id) values (userRoleId, create_food);
            insert into role_permissions (role_id, permission_id) values (userRoleId, edit_food);
            insert into role_permissions (role_id, permission_id) values (userRoleId, read_food);
            insert into role_permissions (role_id, permission_id) values (userRoleId, delete_food);
            insert into role_permissions (role_id, permission_id) values (userRoleId, read_ingredient);
            insert into role_permissions (role_id, permission_id) values (userRoleId, read_unit);

            insert into role_permissions (role_id, permission_id) values (adminRoleId, manage_post);
            insert into role_permissions (role_id, permission_id) values (adminRoleId, manage_album);
            insert into role_permissions (role_id, permission_id) values (adminRoleId, manage_user);
            insert into role_permissions (role_id, permission_id) values (adminRoleId, manage_topic);
            insert into role_permissions (role_id, permission_id) values (adminRoleId, manage_food);
            insert into role_permissions (role_id, permission_id) values (adminRoleId, manage_ingredient);
            insert into role_permissions (role_id, permission_id) values (adminRoleId, manage_unit);

            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, create_moment_post);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, create_share_food_post);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, create_recommendation_post);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, edit_post);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, delete_post);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, read_post);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, create_album);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, edit_album);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, delete_album);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, read_album);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, get_signed_url);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, read_topic);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, read_user);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, create_food);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, edit_food);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, read_food);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, delete_food);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, read_ingredient);
            insert into role_permissions (role_id, permission_id) values (nutritionistRoleId, read_unit);
          END $$;
        `
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `
          DELETE FROM role_permissions WHERE true
        `
      )
    }

}
