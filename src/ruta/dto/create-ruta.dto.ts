import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRutaDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(120)
	nombre!: string;

	@IsOptional()
	@IsString()
	@MaxLength(255)
	descripcion?: string | null;

	@Type(() => Number)
	@IsNumber()
	tarifa!: string;
}
