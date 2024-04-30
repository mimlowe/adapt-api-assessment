import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scraper/scraper.service';
import { IApiPageOutput } from './interface';

@Controller('/api/v1')
export class AppController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('/carrier-data')
  async getCarrierData(): Promise<IApiPageOutput[]> {
    return await this.scraperService.scrape();
  }
}
