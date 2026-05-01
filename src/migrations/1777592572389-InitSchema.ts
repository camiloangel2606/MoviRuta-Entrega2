import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777592572389 implements MigrationInterface {
    name = 'InitSchema1777592572389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`destinatario_grupo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`mensajeId\` int NOT NULL, \`grupoId\` int NOT NULL, UNIQUE INDEX \`IDX_868bff759f7f3f3669daa82b5b\` (\`mensajeId\`, \`grupoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`destinatario_persona\` (\`id\` int NOT NULL AUTO_INCREMENT, \`leido\` tinyint NOT NULL DEFAULT 0, \`mensajeId\` int NOT NULL, \`personaId\` int NOT NULL, UNIQUE INDEX \`IDX_6817e12c9d2a40172d2b1181d1\` (\`mensajeId\`, \`personaId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mensaje\` (\`id\` int NOT NULL AUTO_INCREMENT, \`contenido\` text NOT NULL, \`fecha_envio\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`emisorId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`destinatario_grupo\` ADD CONSTRAINT \`FK_2169333283c25f621e1659487d6\` FOREIGN KEY (\`mensajeId\`) REFERENCES \`mensaje\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`destinatario_grupo\` ADD CONSTRAINT \`FK_8b2148d0975c5f14158b92fac2d\` FOREIGN KEY (\`grupoId\`) REFERENCES \`grupo\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`destinatario_persona\` ADD CONSTRAINT \`FK_1875ed2c4aeda7baf22688203ad\` FOREIGN KEY (\`mensajeId\`) REFERENCES \`mensaje\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`destinatario_persona\` ADD CONSTRAINT \`FK_3c1b19d4e9eb62885999d67c5a8\` FOREIGN KEY (\`personaId\`) REFERENCES \`persona\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mensaje\` ADD CONSTRAINT \`FK_71ebdcdd975d728ccf181b4ec25\` FOREIGN KEY (\`emisorId\`) REFERENCES \`persona\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mensaje\` DROP FOREIGN KEY \`FK_71ebdcdd975d728ccf181b4ec25\``);
        await queryRunner.query(`ALTER TABLE \`destinatario_persona\` DROP FOREIGN KEY \`FK_3c1b19d4e9eb62885999d67c5a8\``);
        await queryRunner.query(`ALTER TABLE \`destinatario_persona\` DROP FOREIGN KEY \`FK_1875ed2c4aeda7baf22688203ad\``);
        await queryRunner.query(`ALTER TABLE \`destinatario_grupo\` DROP FOREIGN KEY \`FK_8b2148d0975c5f14158b92fac2d\``);
        await queryRunner.query(`ALTER TABLE \`destinatario_grupo\` DROP FOREIGN KEY \`FK_2169333283c25f621e1659487d6\``);
        await queryRunner.query(`DROP TABLE \`mensaje\``);
        await queryRunner.query(`DROP INDEX \`IDX_6817e12c9d2a40172d2b1181d1\` ON \`destinatario_persona\``);
        await queryRunner.query(`DROP TABLE \`destinatario_persona\``);
        await queryRunner.query(`DROP INDEX \`IDX_868bff759f7f3f3669daa82b5b\` ON \`destinatario_grupo\``);
        await queryRunner.query(`DROP TABLE \`destinatario_grupo\``);
    }

}
