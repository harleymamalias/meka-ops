import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceRequestStatus } from '../../../shared/enums/service-request-status.enum';

export class UpdateServiceStatusDto {
  @IsEnum(ServiceRequestStatus)
  status: ServiceRequestStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
