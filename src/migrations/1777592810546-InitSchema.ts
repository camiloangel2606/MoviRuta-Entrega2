import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777592810546 implements MigrationInterface {
    name = 'InitSchema1777592810546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ciudadano\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fecha_nacimiento\` date NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`personaId\` int NOT NULL, UNIQUE INDEX \`IDX_f68106fba4ab62191478349ab7\` (\`personaId\`), UNIQUE INDEX \`REL_f68106fba4ab62191478349ab7\` (\`personaId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ciudadano\` ADD CONSTRAINT \`FK_f68106fba4ab62191478349ab78\` FOREIGN KEY (\`personaId\`) REFERENCES \`persona\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ciudadano\` DROP FOREIGN KEY \`FK_f68106fba4ab62191478349ab78\``);
        await queryRunner.query(`DROP INDEX \`REL_f68106fba4ab62191478349ab7\` ON \`ciudadano\``);
        await queryRunner.query(`DROP INDEX \`IDX_f68106fba4ab62191478349ab7\` ON \`ciudadano\``);
        await queryRunner.query(`DROP TABLE \`ciudadano\``);
    }

}
