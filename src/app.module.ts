import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  CarrierDataFormatter,
  CarrierPageLoader,
  CarrierPageParser,
} from './scraper';
import { ScraperService } from './scraper/scraper.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    ScraperService,
    CarrierPageLoader,
    CarrierPageParser,
    CarrierDataFormatter,
  ],
})
export class AppModule {}
