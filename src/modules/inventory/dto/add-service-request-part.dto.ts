import { IsInt, IsString, Min } from 'class-validator';

export class AddServiceRequestPartDto {
  @IsString()
  inventoryItemId: string;

  @IsInt()
  @Min(1)
  quantityUsed: number;
}
