import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777593353371 implements MigrationInterface {
    name = 'InitSchema1777593353371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`boleto\` (\`id\` int NOT NULL AUTO_INCREMENT, \`estado\` enum ('ACTIVO', 'COMPLETADO', 'CANCELADO') NOT NULL DEFAULT 'ACTIVO', \`costo\` decimal(10,2) NOT NULL, \`fecha_inicio\` datetime NOT NULL, \`fecha_fin\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ciudadanoId\` int NOT NULL, \`busId\` int NOT NULL, \`rutaId\` int NOT NULL, \`paraderoAbordajeId\` int NULL, \`paraderoDescensoId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`boleto\` ADD CONSTRAINT \`FK_ac2317d6d409e6611e0801cbf4f\` FOREIGN KEY (\`ciudadanoId\`) REFERENCES \`ciudadano\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`boleto\` ADD CONSTRAINT \`FK_c5be0ebc90a915615d652d2b214\` FOREIGN KEY (\`busId\`) REFERENCES \`bus\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`boleto\` ADD CONSTRAINT \`FK_863257e41be655d58946961bbf7\` FOREIGN KEY (\`rutaId\`) REFERENCES \`ruta\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`boleto\` ADD CONSTRAINT \`FK_4873f6188ab1b2b71795a016b5d\` FOREIGN KEY (\`paraderoAbordajeId\`) REFERENCES \`paradero\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`boleto\` ADD CONSTRAINT \`FK_15b98134772ddab8aa6cdce181f\` FOREIGN KEY (\`paraderoDescensoId\`) REFERENCES \`paradero\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`boleto\` DROP FOREIGN KEY \`FK_15b98134772ddab8aa6cdce181f\``);
        await queryRunner.query(`ALTER TABLE \`boleto\` DROP FOREIGN KEY \`FK_4873f6188ab1b2b71795a016b5d\``);
        await queryRunner.query(`ALTER TABLE \`boleto\` DROP FOREIGN KEY \`FK_863257e41be655d58946961bbf7\``);
        await queryRunner.query(`ALTER TABLE \`boleto\` DROP FOREIGN KEY \`FK_c5be0ebc90a915615d652d2b214\``);
        await queryRunner.query(`ALTER TABLE \`boleto\` DROP FOREIGN KEY \`FK_ac2317d6d409e6611e0801cbf4f\``);
        await queryRunner.query(`DROP TABLE \`boleto\``);
    }

}
