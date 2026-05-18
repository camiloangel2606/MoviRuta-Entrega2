import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import { Ciudadano } from '../ciudadano/entities/ciudadano.entity'; // Asegúrate de que esta ruta sea correcta

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,

    @InjectRepository(Ciudadano)
    private readonly ciudadanoRepository: Repository<Ciudadano>,
  ) {}

  async create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    // 1. Creamos e insertamos la Persona en MySQL
    const nuevaPersona = this.personaRepository.create(createPersonaDto);
    let personaGuardada: Persona;

    try {
      personaGuardada = await this.personaRepository.save(nuevaPersona);
    } catch (error) {
      this.handleDbError(error);
    }

    try {
      // 2. CREACIÓN CORRECTA EN LA SUBTABLA CIUDADANO
      // Dejamos que el ID de ciudadano se autoincremente solo (@PrimaryGeneratedColumn)
      // Y le pasamos el objeto completo 'persona' para cumplir con la relación OneToOne nullable: false
      const nuevoCiudadano = this.ciudadanoRepository.create({
        persona: personaGuardada, // 👈 Le pasamos la entidad Persona recién guardada
        fechaNacimiento: null,    // Queda en null hasta que use el formulario de Angular
      });
      
      await this.ciudadanoRepository.save(nuevoCiudadano);
      console.log(`[ÉXITO] Ciudadano vinculado automáticamente a la Persona ID: ${personaGuardada.id}`);
      
    } catch (error) {
      console.error('--- ERROR DETALLADO DE TYPEORM AL CREAR CIUDADANO ---', error);
      
      // Rollback: Si el ciudadano falla, borramos la persona para mantener la BD limpia
      await this.personaRepository.remove(personaGuardada);
      throw new ConflictException('No se pudo inicializar la subtabla de Ciudadano. Registro cancelado.');
    }

    return personaGuardada;
  }

  async findAll(): Promise<Persona[]> {
    return this.personaRepository.find();
  }

  async findOne(id: number): Promise<Persona> {
    const persona = await this.personaRepository.findOne({ where: { id } });
    if (!persona) {
      throw new NotFoundException('Persona no encontrada');
    }
    return persona;
  }

  async findBySecurityId(securityUserId: string): Promise<Persona | null> {
    return await this.personaRepository.findOne({
      where: { securityUserId: securityUserId }
    });
  }

  async updateBySecurityId(securityUserId: string, updateData: any) {
    const persona = await this.findBySecurityId(securityUserId);
    if (!persona) {
      throw new NotFoundException('Persona no encontrada con ese ID de seguridad');
    }
    this.personaRepository.merge(persona, updateData);
    return await this.personaRepository.save(persona);
  }

  async update(id: number, updatePersonaDto: UpdatePersonaDto): Promise<Persona> {
    const persona = await this.findOne(id);
    Object.assign(persona, updatePersonaDto);
    try {
      return await this.personaRepository.save(persona);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async remove(id: number): Promise<Persona> {
    const persona = await this.findOne(id);
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
        if (driverError.message?.includes('security_user_id')) {
          throw new ConflictException('Este usuario de seguridad ya tiene una persona vinculada.');
        }
        throw new ConflictException('El correo electrónico ya está registrado.');
      }
    }
    throw error;
  }
}