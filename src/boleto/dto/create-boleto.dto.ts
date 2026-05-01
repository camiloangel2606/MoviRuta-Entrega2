import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateBoletoDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	ciudadanoId!: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	busId!: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	rutaId!: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	paraderoAbordajeId!: number;

	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	costo!: number;
}
