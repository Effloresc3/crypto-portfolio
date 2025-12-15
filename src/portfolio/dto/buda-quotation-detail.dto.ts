import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class BudaQuotationDetailDto {
  @IsArray()
  @IsString({ each: true })
  amount: [string, string];

  @IsArray()
  @IsString({ each: true })
  base_balance_change: [string, string];

  @IsArray()
  @IsString({ each: true })
  base_exchanged: [string, string];

  @IsArray()
  @IsString({ each: true })
  fee: [string, string];

  @IsBoolean()
  incomplete: boolean;

  @IsOptional()
  @IsString()
  limit: string | null;

  @IsArray()
  @IsString({ each: true })
  order_amount: [string, string];

  @IsArray()
  @IsString({ each: true })
  quote_balance_change: [string, string];

  @IsArray()
  @IsString({ each: true })
  quote_exchanged: [string, string];

  @IsString()
  type: string;
}
