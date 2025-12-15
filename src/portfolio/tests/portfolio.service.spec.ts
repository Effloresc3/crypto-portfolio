import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from '../portfolio.service';
import axios from 'axios';
import { PortfolioDto } from '../dto/portfolio.dto';
import { BudaQuotationResponseDto } from '../dto/buda-quotation-response.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const quotationMockAssetX: BudaQuotationResponseDto = {
  quotation: {
    amount: ['10.0', 'ASSETX'],
    base_balance_change: ['9.99', 'ASSETX'],
    base_exchanged: ['10.0', 'ASSETX'],
    fee: ['0.01', 'ASSETX'],
    incomplete: false,
    limit: null,
    order_amount: ['10.0', 'ASSETX'],
    quote_balance_change: ['-105.00', 'USD'],
    quote_exchanged: ['105.00', 'USD'],
    type: 'bid_given_size',
  },
};

const quotationMockAssetY: BudaQuotationResponseDto = {
  quotation: {
    amount: ['5.0', 'ASSETY'],
    base_balance_change: ['4.99', 'ASSETY'],
    base_exchanged: ['5.0', 'ASSETY'],
    fee: ['0.01', 'ASSETY'],
    incomplete: false,
    limit: null,
    order_amount: ['5.0', 'ASSETY'],
    quote_balance_change: ['-10.00', 'USD'],
    quote_exchanged: ['10.00', 'USD'],
    type: 'bid_given_size',
  },
};
describe('PortfolioService', () => {
  let service: PortfolioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortfolioService],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);

    mockedAxios.post.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correctly calculate the total equivalent value using quotations', async () => {
    const testPortfolio: PortfolioDto = {
      portfolio: {
        ASSETX: 10,
        ASSETY: 5,
      },
      fiat_currency: 'USD',
    };

    mockedAxios.post
      .mockResolvedValueOnce({ data: quotationMockAssetX })
      .mockResolvedValueOnce({ data: quotationMockAssetY });

    const expectedValue = 115.0;

    const result = await service.obtainEquivalent(testPortfolio);

    expect(mockedAxios.post).toHaveBeenCalledTimes(2);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://www.buda.com/api/v2/markets/ASSETX-USD/quotations',
      { type: 'bid_given_size', amount: 10 },
    );

    expect(result).toBe(expectedValue);
  });

  it('should throw an exception on API failure', async () => {
    const testPortfolio: PortfolioDto = {
      portfolio: { ASSETX: 10 },
      fiat_currency: 'USD',
    };

    mockedAxios.post.mockRejectedValue(new Error('Network failure simulation'));

    await expect(service.obtainEquivalent(testPortfolio)).rejects.toThrow(
      'Failed to obtain real-time quotations for portfolio calculation.',
    );
  });
});
