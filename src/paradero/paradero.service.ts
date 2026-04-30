import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateParaderoDto } from './dto/create-paradero.dto';
import { UpdateParaderoDto } from './dto/update-paradero.dto';
import { Paradero } from './entities/paradero.entity';

@Injectable()
export class ParaderoService {
  constructor(
    @InjectRepository(Paradero)
    private readonly paraderoRepository: Repository<Paradero>,
  ) {}

  async create(createParaderoDto: CreateParaderoDto): Promise<Paradero> {
    const paradero = this.paraderoRepository.create(createParaderoDto);
    try {
      return await this.paraderoRepository.save(paradero);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findAll(): Promise<Paradero[]> {
    return this.paraderoRepository.find();
  }

  async findOne(id: number): Promise<Paradero> {
    const paradero = await this.paraderoRepository.findOne({ where: { id } });
    if (!paradero) {
      throw new NotFoundException('Paradero not found');
    }
    return paradero;
  }

  async update(id: number, updateParaderoDto: UpdateParaderoDto): Promise<Paradero> {
    const paradero = await this.paraderoRepository.findOne({ where: { id } });
    if (!paradero) {
      throw new NotFoundException('Paradero not found');
    }
    Object.assign(paradero, updateParaderoDto);
    try {
      return await this.paraderoRepository.save(paradero);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async remove(id: number): Promise<Paradero> {
    const paradero = await this.paraderoRepository.findOne({ where: { id } });
    if (!paradero) {
      throw new NotFoundException('Paradero not found');
    }
    try {
      await this.paraderoRepository.remove(paradero);
      return paradero;
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
        throw new BadRequestException('Cannot delete paradero with rutas');
      }
    }
    throw error;
  }
}
