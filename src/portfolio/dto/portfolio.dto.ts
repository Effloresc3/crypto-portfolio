import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class PortfolioDto {
  @IsObject()
  @IsNotEmpty({ message: 'The portfolio must contain at least one asset.' })
  public portfolio: Record<string, number>;

  @IsString()
  @IsNotEmpty({ message: 'Fiat currency is required.' })
  public fiat_currency: string;
}
