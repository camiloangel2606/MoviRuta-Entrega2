import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777592214926 implements MigrationInterface {
    name = 'InitSchema1777592214926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`grupo_persona\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rol\` enum ('MIEMBRO', 'ADMIN') NULL, \`fecha_union\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`grupoId\` int NOT NULL, \`personaId\` int NOT NULL, UNIQUE INDEX \`IDX_b439acec7a9c7ff5f9cf9af8da\` (\`grupoId\`, \`personaId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`grupo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(120) NOT NULL, \`descripcion\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_46328b39b3ace503a0968d5fc0\` (\`nombre\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`grupo_persona\` ADD CONSTRAINT \`FK_d74e2af0216f881680972e78613\` FOREIGN KEY (\`grupoId\`) REFERENCES \`grupo\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`grupo_persona\` ADD CONSTRAINT \`FK_bb8d97c5152ac52e85c55370551\` FOREIGN KEY (\`personaId\`) REFERENCES \`persona\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`grupo_persona\` DROP FOREIGN KEY \`FK_bb8d97c5152ac52e85c55370551\``);
        await queryRunner.query(`ALTER TABLE \`grupo_persona\` DROP FOREIGN KEY \`FK_d74e2af0216f881680972e78613\``);
        await queryRunner.query(`DROP INDEX \`IDX_46328b39b3ace503a0968d5fc0\` ON \`grupo\``);
        await queryRunner.query(`DROP TABLE \`grupo\``);
        await queryRunner.query(`DROP INDEX \`IDX_b439acec7a9c7ff5f9cf9af8da\` ON \`grupo_persona\``);
        await queryRunner.query(`DROP TABLE \`grupo_persona\``);
    }

}
