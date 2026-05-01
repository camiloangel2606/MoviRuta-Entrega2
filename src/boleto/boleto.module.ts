import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from '../bus/entities/bus.entity';
import { Ciudadano } from '../ciudadano/entities/ciudadano.entity';
import { Paradero } from '../paradero/entities/paradero.entity';
import { Ruta } from '../ruta/entities/ruta.entity';
import { BoletoController } from './boleto.controller';
import { BoletoService } from './boleto.service';
import { Boleto } from './entities/boleto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boleto, Ciudadano, Bus, Ruta, Paradero])],
  controllers: [BoletoController],
  providers: [BoletoService],
  exports: [TypeOrmModule],
})
export class BoletoModule {}
