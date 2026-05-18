import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { Persona } from './entities/persona.entity';
import { Ciudadano } from '../ciudadano/entities/ciudadano.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Persona, Ciudadano])],
  controllers: [PersonaController],
  providers: [PersonaService],
  exports: [TypeOrmModule, PersonaService] // Exportamos el servicio para que pueda ser usado en otros módulos si es necesario,
})
export class PersonaModule {}
