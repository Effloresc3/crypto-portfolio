import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { PortfolioDto } from './dto/portfolio.dto';
import { BudaQuotationResponseDto } from './dto/buda-quotation-response.dto';
import { BudaQuotationDetailDto } from './dto/buda-quotation-detail.dto';

@Injectable()
export class PortfolioService {
  async obtainEquivalent(portfolio: PortfolioDto): Promise<number> {
    const fiat: string = portfolio.fiat_currency.toUpperCase();
    const assetCurrencies: Record<string, number> = portfolio.portfolio;

    const calculationPromises: Promise<
      AxiosResponse<BudaQuotationResponseDto>
    >[] = Object.entries(assetCurrencies).map(
      ([assetCode, quantity]: [string, number]): Promise<
        AxiosResponse<BudaQuotationResponseDto>
      > => {
        const marketId: string = `${assetCode.toUpperCase()}-${fiat}`;
        const url: string = `https://www.buda.com/api/v2/markets/${marketId}/quotations`;

        const requestBody: unknown = {
          type: 'bid_given_size',
          amount: quantity,
        };

        return axios.post<BudaQuotationResponseDto>(url, requestBody);
      },
    );

    try {
      const responses: Awaited<AxiosResponse<BudaQuotationResponseDto>>[] =
        await Promise.all(calculationPromises);

      const totalEquivalentValue: number = responses.reduce(
        (acc: number, response) => {
          const quotation: BudaQuotationDetailDto = response.data.quotation;
          const quoteValue: number = parseFloat(quotation.quote_exchanged[0]);
          return acc + quoteValue;
        },
        0,
      );

      return parseFloat(totalEquivalentValue.toFixed(2));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('External API Quotation Error:', errorMessage);
      throw new HttpException(
        'Failed to obtain real-time quotations for portfolio calculation.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
