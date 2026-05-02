import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { IniciarTurnoDto } from './dto/iniciar-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { TurnoService } from './turno.service';

@Controller('turno')
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) {}

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnoService.create(createTurnoDto);
  }

  @Get()
  findAll() {
    return this.turnoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTurnoDto: UpdateTurnoDto,
  ) {
    return this.turnoService.update(id, updateTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.remove(id);
  }

  @Post(':id/iniciar')
  iniciar(
    @Param('id', ParseIntPipe) id: number,
    @Body() iniciarTurnoDto: IniciarTurnoDto,
  ) {
    return this.turnoService.iniciar(id, iniciarTurnoDto);
  }

  @Post(':id/finalizar')
  finalizar(@Param('id', ParseIntPipe) id: number) {
    return this.turnoService.finalizar(id);
  }
}
