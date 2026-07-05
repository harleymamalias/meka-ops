import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateServiceRequestDto {
  @IsString()
  vehicleId: string;

  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  estimatedCompletion?: Date;
}
