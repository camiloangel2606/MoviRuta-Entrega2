import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaModule } from './empresa/empresa.module';
import { BusModule } from './bus/bus.module';
import { RutaModule } from './ruta/ruta.module';
import { ParaderoModule } from './paradero/paradero.module';
import { RutaParaderoModule } from './ruta-paradero/ruta-paradero.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

      autoLoadEntities: true,

      // SOLO si quieres avanzar sin migraciones al inicio:
      // synchronize: true (solo 1-2 días) y luego lo apagas.
      synchronize: false,
    }),
    EmpresaModule,
    BusModule,
    RutaModule,
    ParaderoModule,
    RutaParaderoModule,
  ],
})
export class AppModule {}