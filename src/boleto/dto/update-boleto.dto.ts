import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BoletoEstado } from '../entities/boleto.entity';

export class UpdateBoletoDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	paraderoDescensoId?: number;

	@IsOptional()
	@IsEnum(BoletoEstado)
	estado?: BoletoEstado;

	@IsOptional()
	@IsDateString()
	fechaFin?: string;
}
