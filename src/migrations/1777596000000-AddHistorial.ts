import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHistorial1777596000000 implements MigrationInterface {
  name = 'AddHistorial1777596000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `historial` (`id` int NOT NULL AUTO_INCREMENT, `tipo` enum (\'ABORDAJE\', \'DESCENSO\') NOT NULL, `fecha` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `orden` int NULL, `boletoId` int NOT NULL, `paraderoId` int NOT NULL, UNIQUE INDEX `IDX_historial_boleto_tipo` (`boletoId`, `tipo`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `historial` ADD CONSTRAINT `FK_historial_boleto` FOREIGN KEY (`boletoId`) REFERENCES `boleto`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `historial` ADD CONSTRAINT `FK_historial_paradero` FOREIGN KEY (`paraderoId`) REFERENCES `paradero`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `historial` DROP FOREIGN KEY `FK_historial_paradero`');
    await queryRunner.query('ALTER TABLE `historial` DROP FOREIGN KEY `FK_historial_boleto`');
    await queryRunner.query('DROP INDEX `IDX_historial_boleto_tipo` ON `historial`');
    await queryRunner.query('DROP TABLE `historial`');
  }
}
