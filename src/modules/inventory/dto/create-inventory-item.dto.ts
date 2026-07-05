import {
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsDecimal({ decimal_digits: '2' })
  unitPrice: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;
}
