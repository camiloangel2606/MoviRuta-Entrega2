import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777591884401 implements MigrationInterface {
    name = 'InitSchema1777591884401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`persona\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(120) NOT NULL, \`apellidos\` varchar(120) NOT NULL, \`email\` varchar(150) NOT NULL, \`telefono\` varchar(30) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_86ae2f9d6da4482363f832340b\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_86ae2f9d6da4482363f832340b\` ON \`persona\``);
        await queryRunner.query(`DROP TABLE \`persona\``);
    }

}
