import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { Ruta } from './entities/ruta.entity';

@Injectable()
export class RutaService {
  constructor(
    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>,
  ) {}

  async create(createRutaDto: CreateRutaDto): Promise<Ruta> {
    const ruta = this.rutaRepository.create(createRutaDto);
    try {
      return await this.rutaRepository.save(ruta);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findAll(): Promise<Ruta[]> {
    return this.rutaRepository.find();
  }

  async findOne(id: number): Promise<Ruta> {
    const ruta = await this.rutaRepository.findOne({ where: { id } });
    if (!ruta) {
      throw new NotFoundException('Ruta not found');
    }
    return ruta;
  }

  async update(id: number, updateRutaDto: UpdateRutaDto): Promise<Ruta> {
    const ruta = await this.rutaRepository.findOne({ where: { id } });
    if (!ruta) {
      throw new NotFoundException('Ruta not found');
    }
    Object.assign(ruta, updateRutaDto);
    try {
      return await this.rutaRepository.save(ruta);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async remove(id: number): Promise<Ruta> {
    const ruta = await this.rutaRepository.findOne({ where: { id } });
    if (!ruta) {
      throw new NotFoundException('Ruta not found');
    }
    try {
      await this.rutaRepository.remove(ruta);
      return ruta;
    } catch (error) {
      this.handleDbError(error);
    }
  }

  private handleDbError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as { code?: string } | undefined;
      if (driverError?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Duplicate value');
      }
      if (driverError?.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new BadRequestException('Cannot delete ruta with paraderos');
      }
    }
    throw error;
  }
}
