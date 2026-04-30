import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777484288826 implements MigrationInterface {
    name = 'InitSchema1777484288826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ruta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(120) NOT NULL, \`descripcion\` varchar(255) NULL, \`tarifa\` decimal(10,2) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_7f4af0cef9fb7c4203dee858ac\` (\`nombre\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`paradero\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(140) NOT NULL, \`latitud\` decimal(10,7) NOT NULL, \`longitud\` decimal(10,7) NOT NULL, \`tipo\` enum ('PARADERO', 'ESTACION', 'TERMINAL') NOT NULL DEFAULT 'PARADERO', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ruta_paradero\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orden\` int NOT NULL, \`distancia_desde_anterior\` decimal(10,2) NULL, \`tiempo_estimado_desde_anterior\` int NULL, \`rutaId\` int NOT NULL, \`paraderoId\` int NOT NULL, UNIQUE INDEX \`UQ_ruta_paradero_ruta_paradero\` (\`rutaId\`, \`paraderoId\`), UNIQUE INDEX \`UQ_ruta_paradero_ruta_orden\` (\`rutaId\`, \`orden\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`placa\` varchar(10) NOT NULL, \`modelo\` varchar(60) NOT NULL, \`anio\` int NOT NULL, \`capacidad_maxima\` int NOT NULL, \`estado\` enum ('OPERATIVO', 'MANTENIMIENTO', 'FUERA_SERVICIO') NOT NULL DEFAULT 'OPERATIVO', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`empresaId\` int NOT NULL, UNIQUE INDEX \`IDX_fb7ea3a64d22d5276573f22dbd\` (\`placa\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`empresa\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(120) NOT NULL, \`nit\` varchar(30) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_51ac4482e14d7afaa64eab9c5a\` (\`nit\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ruta_paradero\` ADD CONSTRAINT \`FK_ca55297a190c192b6d6f0dee88e\` FOREIGN KEY (\`rutaId\`) REFERENCES \`ruta\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ruta_paradero\` ADD CONSTRAINT \`FK_dbfcc37f869b92a6491ec02ba99\` FOREIGN KEY (\`paraderoId\`) REFERENCES \`paradero\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bus\` ADD CONSTRAINT \`FK_c4faa91c10668bcc2280faf2269\` FOREIGN KEY (\`empresaId\`) REFERENCES \`empresa\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bus\` DROP FOREIGN KEY \`FK_c4faa91c10668bcc2280faf2269\``);
        await queryRunner.query(`ALTER TABLE \`ruta_paradero\` DROP FOREIGN KEY \`FK_dbfcc37f869b92a6491ec02ba99\``);
        await queryRunner.query(`ALTER TABLE \`ruta_paradero\` DROP FOREIGN KEY \`FK_ca55297a190c192b6d6f0dee88e\``);
        await queryRunner.query(`DROP INDEX \`IDX_51ac4482e14d7afaa64eab9c5a\` ON \`empresa\``);
        await queryRunner.query(`DROP TABLE \`empresa\``);
        await queryRunner.query(`DROP INDEX \`IDX_fb7ea3a64d22d5276573f22dbd\` ON \`bus\``);
        await queryRunner.query(`DROP TABLE \`bus\``);
        await queryRunner.query(`DROP INDEX \`UQ_ruta_paradero_ruta_orden\` ON \`ruta_paradero\``);
        await queryRunner.query(`DROP INDEX \`UQ_ruta_paradero_ruta_paradero\` ON \`ruta_paradero\``);
        await queryRunner.query(`DROP TABLE \`ruta_paradero\``);
        await queryRunner.query(`DROP TABLE \`paradero\``);
        await queryRunner.query(`DROP INDEX \`IDX_7f4af0cef9fb7c4203dee858ac\` ON \`ruta\``);
        await queryRunner.query(`DROP TABLE \`ruta\``);
    }

}
