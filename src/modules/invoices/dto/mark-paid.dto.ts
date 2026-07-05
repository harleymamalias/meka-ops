import { IsOptional, IsString } from 'class-validator';

export class MarkPaidDto {
  @IsOptional()
  @IsString()
  paymentProofUrl?: string;
}
