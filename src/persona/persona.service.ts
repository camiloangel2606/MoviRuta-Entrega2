import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    const persona = this.personaRepository.create(createPersonaDto);
    try {
      return await this.personaRepository.save(persona);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findAll(): Promise<Persona[]> {
    return this.personaRepository.find();
  }

  async findOne(id: number): Promise<Persona> {
    const persona = await this.personaRepository.findOne({ where: { id } });
    if (!persona) {
      throw new NotFoundException('Persona not found');
    }
    return persona;
  }

  // =========================================================
  // NUEVO MÉTODO: Busca la persona por el ID de MS Security
  // =========================================================
  async findBySecurityId(securityUserId: string): Promise<Persona | null> {
    return await this.personaRepository.findOne({
      where: { securityUserId: securityUserId }
    });
  }

  async update(id: number, updatePersonaDto: UpdatePersonaDto): Promise<Persona> {
    const persona = await this.personaRepository.findOne({ where: { id } });
    if (!persona) {
      throw new NotFoundException('Persona not found');
    }
    Object.assign(persona, updatePersonaDto);
    try {
      return await this.personaRepository.save(persona);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async remove(id: number): Promise<Persona> {
    const persona = await this.personaRepository.findOne({ where: { id } });
    if (!persona) {
      throw new NotFoundException('Persona not found');
    }
    try {
      await this.personaRepository.remove(persona);
      return persona;
    } catch (error) {
      this.handleDbError(error);
    }
  }

  private handleDbError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as { code?: string; message?: string } | undefined;
      if (driverError?.code === 'ER_DUP_ENTRY') {
        // Validación dinámica por si el error de duplicado es por Email o por el ID de Seguridad
        if (driverError.message?.includes('security_user_id')) {
          throw new ConflictException('Este usuario de seguridad ya tiene una persona vinculada en el negocio.');
        }
        throw new ConflictException('Email already exists');
      }
    }
    throw error;
  }
}