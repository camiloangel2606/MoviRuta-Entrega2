import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProgramacionDto } from './dto/create-programacion.dto';
import { FindProgramacionQueryDto } from './dto/find-programacion-query.dto';
import { UpdateProgramacionDto } from './dto/update-programacion.dto';
import { ProgramacionService } from './programacion.service';

@Controller('programacion')
export class ProgramacionController {
  constructor(private readonly programacionService: ProgramacionService) {}

  @Post()
  create(@Body() createProgramacionDto: CreateProgramacionDto) {
    return this.programacionService.create(createProgramacionDto);
  }

  @Get()
  findAll(@Query() query: FindProgramacionQueryDto) {
    return this.programacionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.programacionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgramacionDto: UpdateProgramacionDto,
  ) {
    return this.programacionService.update(id, updateProgramacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.programacionService.remove(id);
  }
}
