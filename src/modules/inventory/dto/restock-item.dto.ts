import { IsInt, Min } from 'class-validator';

export class RestockItemDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
