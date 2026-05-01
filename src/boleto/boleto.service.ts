import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Bus } from '../bus/entities/bus.entity';
import { Ciudadano } from '../ciudadano/entities/ciudadano.entity';
import { Paradero } from '../paradero/entities/paradero.entity';
import { Ruta } from '../ruta/entities/ruta.entity';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto, BoletoEstado } from './entities/boleto.entity';

@Injectable()
export class BoletoService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    @InjectRepository(Ciudadano)
    private readonly ciudadanoRepository: Repository<Ciudadano>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>,
    @InjectRepository(Paradero)
    private readonly paraderoRepository: Repository<Paradero>,
  ) {}

  async create(createBoletoDto: CreateBoletoDto): Promise<Boleto> {
    const ciudadano = await this.getCiudadanoOrThrow(createBoletoDto.ciudadanoId);
    const bus = await this.getBusOrThrow(createBoletoDto.busId);
    const ruta = await this.getRutaOrThrow(createBoletoDto.rutaId);
    const paraderoAbordaje = await this.getParaderoOrThrow(
      createBoletoDto.paraderoAbordajeId,
    );

    const boleto = this.boletoRepository.create({
      ciudadano,
      bus,
      ruta,
      paraderoAbordaje,
      costo: this.formatDecimal(createBoletoDto.costo, 2),
      fechaInicio: new Date(),
      estado: BoletoEstado.ACTIVO,
    });

    try {
      return await this.boletoRepository.save(boleto);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findAll(): Promise<Boleto[]> {
    return this.boletoRepository.find({
      relations: {
        ciudadano: { persona: true },
        bus: true,
        ruta: true,
        paraderoAbordaje: true,
        paraderoDescenso: true,
      },
    });
  }

  async findOne(id: number): Promise<Boleto> {
    const boleto = await this.boletoRepository.findOne({
      where: { id },
      relations: {
        ciudadano: { persona: true },
        bus: true,
        ruta: true,
        paraderoAbordaje: true,
        paraderoDescenso: true,
      },
    });
    if (!boleto) {
      throw new NotFoundException('Boleto not found');
    }
    return boleto;
  }

  async update(id: number, updateBoletoDto: UpdateBoletoDto): Promise<Boleto> {
    const boleto = await this.boletoRepository.findOne({ where: { id } });
    if (!boleto) {
      throw new NotFoundException('Boleto not found');
    }

    if (updateBoletoDto.estado === BoletoEstado.COMPLETADO) {
      if (!updateBoletoDto.paraderoDescensoId || !updateBoletoDto.fechaFin) {
        throw new BadRequestException(
          'Completar requiere paraderoDescensoId y fechaFin',
        );
      }
    }

    if (updateBoletoDto.paraderoDescensoId !== undefined) {
      boleto.paraderoDescenso = await this.getParaderoOrThrow(
        updateBoletoDto.paraderoDescensoId,
      );
    }

    if (updateBoletoDto.estado !== undefined) {
      boleto.estado = updateBoletoDto.estado;
    }

    if (updateBoletoDto.fechaFin !== undefined) {
      boleto.fechaFin = new Date(updateBoletoDto.fechaFin);
    }

    try {
      return await this.boletoRepository.save(boleto);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async remove(id: number): Promise<Boleto> {
    const boleto = await this.boletoRepository.findOne({ where: { id } });
    if (!boleto) {
      throw new NotFoundException('Boleto not found');
    }
    if (boleto.estado === BoletoEstado.ACTIVO) {
      throw new BadRequestException('No se puede eliminar un boleto activo');
    }
    try {
      await this.boletoRepository.remove(boleto);
      return boleto;
    } catch (error) {
      this.handleDbError(error);
    }
  }

  private async getCiudadanoOrThrow(id: number): Promise<Ciudadano> {
    const ciudadano = await this.ciudadanoRepository.findOne({
      where: { id },
      relations: ['persona'],
    });
    if (!ciudadano) {
      throw new NotFoundException('Ciudadano not found');
    }
    return ciudadano;
  }

  private async getBusOrThrow(id: number): Promise<Bus> {
    const bus = await this.busRepository.findOne({ where: { id } });
    if (!bus) {
      throw new NotFoundException('Bus not found');
    }
    return bus;
  }

  private async getRutaOrThrow(id: number): Promise<Ruta> {
    const ruta = await this.rutaRepository.findOne({ where: { id } });
    if (!ruta) {
      throw new NotFoundException('Ruta not found');
    }
    return ruta;
  }

  private async getParaderoOrThrow(id: number): Promise<Paradero> {
    const paradero = await this.paraderoRepository.findOne({ where: { id } });
    if (!paradero) {
      throw new NotFoundException('Paradero not found');
    }
    return paradero;
  }

  private handleDbError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as { code?: string } | undefined;
      if (driverError?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Duplicate value');
      }
    }
    throw error;
  }

  private formatDecimal(value: number, decimals: number): string {
    return Number(value).toFixed(decimals);
  }
}
