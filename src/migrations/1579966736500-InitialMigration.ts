import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1579966736500 implements MigrationInterface {
    name = 'InitialMigration1579966736500'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "message" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "chatId" integer, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "username"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "message"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "timestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "chatId"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "username" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "message" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "timestamp" TIMESTAMP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "chatId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "name" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "maxSize" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "location" geometry(Point,4326)`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "tagList" text NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "size" integer NOT NULL`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_b9f4acc88a5a13d536ed935887" ON "chat" USING GiST ("location") `, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_3af41a2b44ec75589b7213a05e2" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_3af41a2b44ec75589b7213a05e2"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_b9f4acc88a5a13d536ed935887"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "size"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "tagList"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "location"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "maxSize"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "name"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "chatId"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "timestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "message"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "username"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "chatId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "timestamp" TIMESTAMP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "message" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD "username" character varying NOT NULL`, undefined);
        await queryRunner.query(`DROP TABLE "chat"`, undefined);
    }

}
