import { IsString } from 'class-validator';

export class AssignMechanicDto {
  @IsString()
  mechanicId: string;
}
