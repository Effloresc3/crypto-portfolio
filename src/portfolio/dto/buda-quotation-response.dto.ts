import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BudaQuotationDetailDto } from './buda-quotation-detail.dto';

export class BudaQuotationResponseDto {
  @Type(() => BudaQuotationDetailDto)
  @ValidateNested()
  quotation: BudaQuotationDetailDto;
}
