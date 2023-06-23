import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1687473514739 implements MigrationInterface {
    name = 'Default1687473514739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TB_MUNICIPIO" DROP CONSTRAINT "TB_MUNICIPIO_FK1"`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" DROP CONSTRAINT "TB_ENDERECO_FK1"`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" DROP CONSTRAINT "TB_ENDERECO_FK2"`);
        await queryRunner.query(`ALTER TABLE "TB_BAIRRO" DROP CONSTRAINT "TB_BAIRRO_FK1"`);
        await queryRunner.query(`ALTER TABLE "TB_MUNICIPIO" MODIFY "CODIGO_UF" number(9,0)  NULL`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" MODIFY "CODIGO_PESSOA" number(9,0)  NULL`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" MODIFY "CODIGO_BAIRRO" number(9,0)  NULL`);
        await queryRunner.query(`ALTER TABLE "TB_BAIRRO" MODIFY "CODIGO_MUNICIPIO" number(9,0)  NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "TB_UF_PK" ON "TB_UF" ("CODIGO_UF")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "TB_MUNICIPIO_PK" ON "TB_MUNICIPIO" ("CODIGO_MUNICIPIO")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "TB_PESSOA_PK" ON "TB_PESSOA" ("CODIGO_PESSOA")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "TB_ENDERECO_PK" ON "TB_ENDERECO" ("CODIGO_ENDERECO")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "TB_BAIRRO_PK" ON "TB_BAIRRO" ("CODIGO_BAIRRO")`);
        await queryRunner.query(`ALTER TABLE "TB_MUNICIPIO" ADD CONSTRAINT "FK_5ffbefc831d79cc23b2a85bba3f" FOREIGN KEY ("CODIGO_UF") REFERENCES "TB_UF" ("CODIGO_UF")`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" ADD CONSTRAINT "FK_7b04848cc0eda7c16d72a69ae9e" FOREIGN KEY ("CODIGO_PESSOA") REFERENCES "TB_PESSOA" ("CODIGO_PESSOA")`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" ADD CONSTRAINT "FK_19905bbde841192c7fa90c0ec50" FOREIGN KEY ("CODIGO_BAIRRO") REFERENCES "TB_BAIRRO" ("CODIGO_BAIRRO")`);
        await queryRunner.query(`ALTER TABLE "TB_BAIRRO" ADD CONSTRAINT "FK_f910210e141c8d8274e922ff80b" FOREIGN KEY ("CODIGO_MUNICIPIO") REFERENCES "TB_MUNICIPIO" ("CODIGO_MUNICIPIO")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TB_BAIRRO" DROP CONSTRAINT "FK_f910210e141c8d8274e922ff80b"`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" DROP CONSTRAINT "FK_19905bbde841192c7fa90c0ec50"`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" DROP CONSTRAINT "FK_7b04848cc0eda7c16d72a69ae9e"`);
        await queryRunner.query(`ALTER TABLE "TB_MUNICIPIO" DROP CONSTRAINT "FK_5ffbefc831d79cc23b2a85bba3f"`);
        await queryRunner.query(`DROP INDEX "TB_BAIRRO_PK"`);
        await queryRunner.query(`DROP INDEX "TB_ENDERECO_PK"`);
        await queryRunner.query(`DROP INDEX "TB_PESSOA_PK"`);
        await queryRunner.query(`DROP INDEX "TB_MUNICIPIO_PK"`);
        await queryRunner.query(`DROP INDEX "TB_UF_PK"`);
        await queryRunner.query(`ALTER TABLE "TB_BAIRRO" MODIFY "CODIGO_MUNICIPIO" number(9,0)  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" MODIFY "CODIGO_BAIRRO" number(9,0)  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" MODIFY "CODIGO_PESSOA" number(9,0)  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TB_MUNICIPIO" MODIFY "CODIGO_UF" number(9,0)  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TB_BAIRRO" ADD CONSTRAINT "TB_BAIRRO_FK1" FOREIGN KEY ("CODIGO_MUNICIPIO") REFERENCES "TB_MUNICIPIO" ("CODIGO_MUNICIPIO")`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" ADD CONSTRAINT "TB_ENDERECO_FK2" FOREIGN KEY ("CODIGO_BAIRRO") REFERENCES "TB_BAIRRO" ("CODIGO_BAIRRO")`);
        await queryRunner.query(`ALTER TABLE "TB_ENDERECO" ADD CONSTRAINT "TB_ENDERECO_FK1" FOREIGN KEY ("CODIGO_PESSOA") REFERENCES "TB_PESSOA" ("CODIGO_PESSOA")`);
        await queryRunner.query(`ALTER TABLE "TB_MUNICIPIO" ADD CONSTRAINT "TB_MUNICIPIO_FK1" FOREIGN KEY ("CODIGO_UF") REFERENCES "TB_UF" ("CODIGO_UF")`);
    }

}
