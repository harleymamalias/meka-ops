import { IsDecimal, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  serviceRequestId: string;

  @IsDecimal({ decimal_digits: '2' })
  laborCost: string;
}
