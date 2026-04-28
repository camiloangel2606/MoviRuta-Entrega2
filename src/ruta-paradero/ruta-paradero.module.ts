import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutaParaderoService } from './ruta-paradero.service';
import { RutaParaderoController } from './ruta-paradero.controller';
import { RutaParadero } from './entities/ruta-paradero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RutaParadero])],
  controllers: [RutaParaderoController],
  providers: [RutaParaderoService],
  exports: [TypeOrmModule],
})
export class RutaParaderoModule {}