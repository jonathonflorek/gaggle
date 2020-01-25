import {MigrationInterface, QueryRunner} from "typeorm";

export class FixBadName1579975806187 implements MigrationInterface {
    name = 'FixBadName1579975806187'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_3af41a2b44ec75589b7213a05e2"`, undefined);
        await queryRunner.query(`CREATE TABLE "chat_message" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "message" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "chatId" integer, CONSTRAINT "PK_3cc0d85193aade457d3077dd06b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "username"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "message"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "timestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "chatId"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_6d2db5b1118d92e561f5ebc1af0" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_6d2db5b1118d92e561f5ebc1af0"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "chatId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "timestamp" TIMESTAMP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "message" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "username" character varying NOT NULL`, undefined);
        await queryRunner.query(`DROP TABLE "chat_message"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_3af41a2b44ec75589b7213a05e2" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
