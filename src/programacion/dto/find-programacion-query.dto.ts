import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class FindProgramacionQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rutaId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  busId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  conductorId?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;
}
