import { Injectable } from '@nestjs/common';
import { CreateRutaParaderoDto } from './dto/create-ruta-paradero.dto';
import { UpdateRutaParaderoDto } from './dto/update-ruta-paradero.dto';

@Injectable()
export class RutaParaderoService {
  create(createRutaParaderoDto: CreateRutaParaderoDto) {
    return 'This action adds a new rutaParadero';
  }

  findAll() {
    return `This action returns all rutaParadero`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rutaParadero`;
  }

  update(id: number, updateRutaParaderoDto: UpdateRutaParaderoDto) {
    return `This action updates a #${id} rutaParadero`;
  }

  remove(id: number) {
    return `This action removes a #${id} rutaParadero`;
  }
}
