import { IsInt, IsString, Min } from 'class-validator';

export class CreateMaintenanceRecordDto {
  @IsString()
  vehicleId: string;

  @IsString()
  serviceType: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  mileageAtService: number;
}
