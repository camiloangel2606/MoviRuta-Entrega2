import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConductorTurno1777595000000 implements MigrationInterface {
  name = 'AddConductorTurno1777595000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `conductor` (`id` int NOT NULL AUTO_INCREMENT, `licencia` varchar(50) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `personaId` int NOT NULL, UNIQUE INDEX `IDX_conductor_persona` (`personaId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `turno` (`id` int NOT NULL AUTO_INCREMENT, `inicio` datetime NOT NULL, `fin` datetime NULL, `estado` enum (\'PROGRAMADO\', \'EN_CURSO\', \'FINALIZADO\') NOT NULL DEFAULT \'PROGRAMADO\', `observaciones` varchar(255) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `conductorId` int NOT NULL, `busId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `conductor` ADD CONSTRAINT `FK_conductor_persona` FOREIGN KEY (`personaId`) REFERENCES `persona`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `turno` ADD CONSTRAINT `FK_turno_conductor` FOREIGN KEY (`conductorId`) REFERENCES `conductor`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `turno` ADD CONSTRAINT `FK_turno_bus` FOREIGN KEY (`busId`) REFERENCES `bus`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `turno` DROP FOREIGN KEY `FK_turno_bus`');
    await queryRunner.query('ALTER TABLE `turno` DROP FOREIGN KEY `FK_turno_conductor`');
    await queryRunner.query('ALTER TABLE `conductor` DROP FOREIGN KEY `FK_conductor_persona`');
    await queryRunner.query('DROP TABLE `turno`');
    await queryRunner.query('DROP INDEX `IDX_conductor_persona` ON `conductor`');
    await queryRunner.query('DROP TABLE `conductor`');
  }
}
