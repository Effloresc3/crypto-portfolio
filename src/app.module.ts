import { Module } from '@nestjs/common';

import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [PortfolioModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
