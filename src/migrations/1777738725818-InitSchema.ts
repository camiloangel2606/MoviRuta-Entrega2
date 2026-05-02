import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777738725818 implements MigrationInterface {
    name = 'InitSchema1777738725818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`conductor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`licencia\` varchar(50) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`personaId\` int NOT NULL, UNIQUE INDEX \`IDX_a33c172e90e41bf7cd99d1ead8\` (\`personaId\`), UNIQUE INDEX \`REL_a33c172e90e41bf7cd99d1ead8\` (\`personaId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`turno\` (\`id\` int NOT NULL AUTO_INCREMENT, \`inicio\` datetime NOT NULL, \`fin\` datetime NULL, \`estado\` enum ('PROGRAMADO', 'EN_CURSO', 'FINALIZADO') NOT NULL DEFAULT 'PROGRAMADO', \`observaciones\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`conductorId\` int NOT NULL, \`busId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`historial\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo\` enum ('ABORDAJE', 'DESCENSO') NOT NULL, \`fecha\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`orden\` int NULL, \`boletoId\` int NOT NULL, \`paraderoId\` int NOT NULL, UNIQUE INDEX \`IDX_6b3d920df363da13aea7b2bafb\` (\`boletoId\`, \`tipo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`conductor\` ADD CONSTRAINT \`FK_a33c172e90e41bf7cd99d1ead8c\` FOREIGN KEY (\`personaId\`) REFERENCES \`persona\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`turno\` ADD CONSTRAINT \`FK_7c9e9687f8247eaa642fd394121\` FOREIGN KEY (\`conductorId\`) REFERENCES \`conductor\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`turno\` ADD CONSTRAINT \`FK_6bd20f512dadade10ae6ba081a0\` FOREIGN KEY (\`busId\`) REFERENCES \`bus\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`historial\` ADD CONSTRAINT \`FK_f86c8d4c2839dc6b7f02c768b34\` FOREIGN KEY (\`boletoId\`) REFERENCES \`boleto\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`historial\` ADD CONSTRAINT \`FK_0a899d92cbe8314056c3f77efaa\` FOREIGN KEY (\`paraderoId\`) REFERENCES \`paradero\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`historial\` DROP FOREIGN KEY \`FK_0a899d92cbe8314056c3f77efaa\``);
        await queryRunner.query(`ALTER TABLE \`historial\` DROP FOREIGN KEY \`FK_f86c8d4c2839dc6b7f02c768b34\``);
        await queryRunner.query(`ALTER TABLE \`turno\` DROP FOREIGN KEY \`FK_6bd20f512dadade10ae6ba081a0\``);
        await queryRunner.query(`ALTER TABLE \`turno\` DROP FOREIGN KEY \`FK_7c9e9687f8247eaa642fd394121\``);
        await queryRunner.query(`ALTER TABLE \`conductor\` DROP FOREIGN KEY \`FK_a33c172e90e41bf7cd99d1ead8c\``);
        await queryRunner.query(`DROP INDEX \`IDX_6b3d920df363da13aea7b2bafb\` ON \`historial\``);
        await queryRunner.query(`DROP TABLE \`historial\``);
        await queryRunner.query(`DROP TABLE \`turno\``);
        await queryRunner.query(`DROP INDEX \`REL_a33c172e90e41bf7cd99d1ead8\` ON \`conductor\``);
        await queryRunner.query(`DROP INDEX \`IDX_a33c172e90e41bf7cd99d1ead8\` ON \`conductor\``);
        await queryRunner.query(`DROP TABLE \`conductor\``);
    }

}
