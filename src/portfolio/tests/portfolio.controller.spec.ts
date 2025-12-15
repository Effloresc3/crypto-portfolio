import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { PortfolioController } from '../portfolio.controller';
import { PortfolioService } from '../portfolio.service';
import { Server } from 'http';

const value: number = 1234.56;
const mockPortfolioService = {
  obtainEquivalent: jest.fn(),
};

describe('PortfolioController (e2e)', () => {
  let app: INestApplication;

  const BASE_URL = '/';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioController],
      providers: [
        {
          provide: PortfolioService,
          useValue: mockPortfolioService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    mockPortfolioService.obtainEquivalent.mockClear();
    mockPortfolioService.obtainEquivalent.mockResolvedValue(value);
  });

  it('/ (POST) should successfully process portfolio and return the equivalent number', async () => {
    const portfolioObject = {
      BTC: 0.5,
      ETH: 10,
    };

    const testBody = {
      portfolio: portfolioObject,
      fiat_currency: 'USD',
    };

    const expectedPortfolio = {
      fiat_currency: 'USD',
      portfolio: portfolioObject,
    };

    return request(app.getHttpServer() as Server)
      .post(BASE_URL)
      .send(testBody)
      .expect(HttpStatus.OK)
      .expect((response: request.Response) => {
        expect(response.text).toBe(value.toString());
        expect(mockPortfolioService.obtainEquivalent).toHaveBeenCalledWith(
          expectedPortfolio,
        );
      });
  });

  it('/ (POST) should return 500 if the service throws an error', async () => {
    const portfolioObjectEmpty = {};
    const testBody = {
      portfolio: portfolioObjectEmpty,
      fiat_currency: 'USD',
    };

    const expectedPortfolio = {
      fiat_currency: 'USD',
      portfolio: portfolioObjectEmpty,
    };

    mockPortfolioService.obtainEquivalent.mockRejectedValueOnce(
      new Error('Network failure simulation'),
    );

    return request(app.getHttpServer() as Server)
      .post(BASE_URL)
      .send(testBody)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect((response: request.Response) => {
        const body = response.body as { statusCode: number; message: string };
        expect(body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(body.message).toContain('Internal server error');
        expect(mockPortfolioService.obtainEquivalent).toHaveBeenCalledWith(
          expectedPortfolio,
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
