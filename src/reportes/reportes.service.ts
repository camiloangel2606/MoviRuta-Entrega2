import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleto, BoletoEstado } from '../boleto/entities/boleto.entity';

export interface IngresosMensualesResponse {
  meses: string[];
  series: { metodoPago: string; data: number[] }[];
  totales: { metodoPago: string; total: number; porcentaje: number }[];
  totalGeneral: number;
  rango: { desde: string; hasta: string; meses: number };
}

const MESES_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepo: Repository<Boleto>,
  ) {}

  async ingresosPorMes(meses: number): Promise<IngresosMensualesResponse> {
    if (![3, 6, 12].includes(meses)) {
      throw new BadRequestException('El parámetro "meses" debe ser 3, 6 o 12.');
    }

    const hasta = new Date();
    const desde = new Date(hasta.getFullYear(), hasta.getMonth() - (meses - 1), 1);

    const boletos = await this.boletoRepo.find({
      where: { estado: BoletoEstado.COMPLETADO },
      relations: {
        metodoPagoCiudadano: { metodoPago: true },
        programacion: true,
      },
    });

    const bucketsMes: string[] = [];
    for (let i = 0; i < meses; i++) {
      const d = new Date(desde.getFullYear(), desde.getMonth() + i, 1);
      bucketsMes.push(`${MESES_ES[d.getMonth()]} ${d.getFullYear()}`);
    }

    // Mapa: metodoPagoNombre -> array(meses) de totales
    const seriesMap = new Map<string, number[]>();

    for (const b of boletos) {
      const refFecha =
        b.horaFin ?? b.programacion?.fecha ?? b.createdAt;
      if (!refFecha) continue;
      const fecha = new Date(refFecha);
      if (fecha < desde || fecha > hasta) continue;

      const idx =
        (fecha.getFullYear() - desde.getFullYear()) * 12 +
        (fecha.getMonth() - desde.getMonth());
      if (idx < 0 || idx >= meses) continue;

      const nombreMetodo =
        b.metodoPagoCiudadano?.metodoPago?.nombre ?? 'Sin método';
      const costo = parseFloat(b.costo as unknown as string) || 0;

      if (!seriesMap.has(nombreMetodo)) {
        seriesMap.set(nombreMetodo, new Array(meses).fill(0));
      }
      seriesMap.get(nombreMetodo)![idx] += costo;
    }

    const series = Array.from(seriesMap.entries())
      .map(([metodoPago, data]) => ({
        metodoPago,
        data: data.map((v) => Math.round(v * 100) / 100),
      }))
      .sort((a, b) => a.metodoPago.localeCompare(b.metodoPago));

    const totalGeneral = series.reduce(
      (acc, s) => acc + s.data.reduce((a, b) => a + b, 0),
      0,
    );

    const totales = series
      .map((s) => {
        const total = s.data.reduce((a, b) => a + b, 0);
        const porcentaje =
          totalGeneral > 0
            ? Math.round((total / totalGeneral) * 1000) / 10
            : 0;
        return {
          metodoPago: s.metodoPago,
          total: Math.round(total * 100) / 100,
          porcentaje,
        };
      })
      .sort((a, b) => b.total - a.total);

    return {
      meses: bucketsMes,
      series,
      totales,
      totalGeneral: Math.round(totalGeneral * 100) / 100,
      rango: {
        desde: desde.toISOString().slice(0, 10),
        hasta: hasta.toISOString().slice(0, 10),
        meses,
      },
    };
  }
}
