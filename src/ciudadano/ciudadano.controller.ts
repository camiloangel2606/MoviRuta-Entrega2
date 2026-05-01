import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CiudadanoService } from './ciudadano.service';
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto';
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto';

@Controller('ciudadano')
export class CiudadanoController {
  constructor(private readonly ciudadanoService: CiudadanoService) {}

  @Post()
  create(@Body() createCiudadanoDto: CreateCiudadanoDto) {
    return this.ciudadanoService.create(createCiudadanoDto);
  }

  @Get()
  findAll() {
    return this.ciudadanoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const ciudadanoId = this.toPositiveInt(id, 'Ciudadano id');
    return this.ciudadanoService.findOne(ciudadanoId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCiudadanoDto: UpdateCiudadanoDto) {
    const ciudadanoId = this.toPositiveInt(id, 'Ciudadano id');
    return this.ciudadanoService.update(ciudadanoId, updateCiudadanoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const ciudadanoId = this.toPositiveInt(id, 'Ciudadano id');
    return this.ciudadanoService.remove(ciudadanoId);
  }

  private toPositiveInt(value: string, label: string): number {
    const numberValue = Number(value);
    if (!Number.isInteger(numberValue) || numberValue < 1) {
      throw new BadRequestException(`${label} must be a positive integer`);
    }
    return numberValue;
  }
}
