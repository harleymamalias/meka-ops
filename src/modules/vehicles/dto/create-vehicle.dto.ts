import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateVehicleDto {
  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsString()
  @Matches(/^[A-Z0-9 -]{3,12}$/)
  plateNumber: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @IsOptional()
  @IsString()
  engineType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;
}
