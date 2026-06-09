import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // HU-2014: Reporte de ingresos por mes y método de pago
  // GET /reportes/ingresos?meses=6
  @Get('ingresos')
  ingresos(
    @Query('meses', new DefaultValuePipe(6), ParseIntPipe) meses: number,
  ) {
    return this.reportesService.ingresosPorMes(meses);
  }
}
