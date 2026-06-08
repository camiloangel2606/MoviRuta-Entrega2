import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPagoCiudadano } from '../metodo-pago-ciudadano/entities/metodo-pago-ciudadano.entity';
import { CrearReferenciaDto } from './dto/crear-referencia.dto';

@Injectable()
export class PagosService {
  private readonly custId = process.env.EPAYCO_CUST_ID ?? '';
  private readonly pKey = process.env.EPAYCO_P_KEY ?? '';

  constructor(
    @InjectRepository(MetodoPagoCiudadano)
    private readonly metodoPagoRepo: Repository<MetodoPagoCiudadano>,
  ) {}

  async crearReferencia(dto: CrearReferenciaDto) {
    const tarjeta = await this.metodoPagoRepo.findOne({
      where: { id: +dto.tarjetaId },
      relations: { metodoPago: true },
    });
    if (!tarjeta) throw new NotFoundException('Tarjeta no encontrada');

    const referencia = `REC-${Date.now()}-${dto.tarjetaId}`;
    const tipo = tarjeta.metodoPago?.tipo ?? 'TARJETA';
    const descripcion = `Recarga tarjeta ${tipo} - $${dto.monto}`;

    return { referencia, monto: dto.monto, descripcion };
  }

  async procesarConfirmacion(body: Record<string, string>) {
    const {
      x_ref_payco,
      x_invoice,
      x_response,
      x_amount,
      x_currency_code,
      x_signature,
    } = body;

    // 1. Verificar firma ePayco
    const firmaEsperada = crypto
      .createHash('sha256')
      .update(
        `${this.custId}^${this.pKey}^${x_ref_payco}^${x_amount}^${x_currency_code}^${x_response}`,
      )
      .digest('hex');

    if (firmaEsperada !== x_signature) {
      return { success: false };
    }

    // 2. Pago no aprobado
    if (x_response !== 'Aceptada') {
      return { success: false };
    }

    // 3. Extraer tarjetaId del invoice (formato REC-{timestamp}-{tarjetaId})
    const partes = (x_invoice ?? '').split('-');
    const tarjetaId = +partes[2];
    if (!tarjetaId || isNaN(tarjetaId)) {
      return { success: false };
    }

    // 4. Buscar tarjeta
    const tarjeta = await this.metodoPagoRepo.findOne({
      where: { id: tarjetaId },
    });
    if (!tarjeta) return { success: false };

    // 5. Acreditar saldo
    const saldoActual = parseFloat(tarjeta.saldo as unknown as string);
    const montoRecarga = parseFloat(x_amount);
    tarjeta.saldo = (saldoActual + montoRecarga).toFixed(2) as unknown as string;
    await this.metodoPagoRepo.save(tarjeta);

    return { success: true };
  }
}
