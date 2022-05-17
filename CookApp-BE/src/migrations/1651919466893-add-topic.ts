import {MigrationInterface, QueryRunner} from "typeorm";

export class addTopic1651919466893 implements MigrationInterface {
    name = 'addTopic1651919466893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "topics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interested_topics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "topic_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_656b13f49e9732d9a65f168eb20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "interested_topics" ADD CONSTRAINT "FK_f11cd9c4539baa08abaa9b51d14" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interested_topics" ADD CONSTRAINT "FK_da6de1c54677f3ac6ff981ccac8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(
          `
            INSERT INTO topics (id, title) VALUES 
            ('720b7fdf-1721-4cfd-aa37-f9b8fbeee4d2', 'Giảm cân'),
            ('c1c5b33e-528c-4fc0-b6b5-8557e5b767e4', 'Gymer'),
            ('492ae58b-4387-4c5e-943f-6d08b9563003', 'Ăn kiêng'),
            ('8f8c0369-02e6-4ab7-9cef-5aec5e205d63', 'Ăn chay'),
            ('e465d136-a366-4d50-bd4b-2440cbb7f8ba', 'Trẻ em');
          `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interested_topics" DROP CONSTRAINT "FK_da6de1c54677f3ac6ff981ccac8"`);
        await queryRunner.query(`ALTER TABLE "interested_topics" DROP CONSTRAINT "FK_f11cd9c4539baa08abaa9b51d14"`);
        await queryRunner.query(`DROP TABLE "interested_topics"`);
        await queryRunner.query(`DROP TABLE "topics"`);
    }

}
