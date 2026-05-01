import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777593066012 implements MigrationInterface {
    name = 'InitSchema1777593066012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`nodo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(140) NOT NULL, \`latitud\` decimal(10,7) NOT NULL, \`longitud\` decimal(10,7) NOT NULL, \`tipo\` enum ('PARADERO', 'INTERSECCION') NOT NULL DEFAULT 'INTERSECCION', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`nodo\``);
    }

}
