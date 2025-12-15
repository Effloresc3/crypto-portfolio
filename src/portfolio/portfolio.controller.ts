import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioDto } from './dto/portfolio.dto';

@Controller()
export class PortfolioController {
  constructor(
    @Inject(PortfolioService)
    private readonly portfolioService: PortfolioService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  async getEquivalent(@Body() portfolio: PortfolioDto): Promise<number> {
    return this.portfolioService.obtainEquivalent(portfolio);
  }
}
