import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ScraperService } from './scraper/scraper.service';
import {
  CarrierDataFormatter,
  CarrierPageLoader,
  CarrierPageParser,
} from './scraper';
import { IApiPageOutput } from './interface';

describe('AppController', () => {
  let appController: AppController;
  let output: IApiPageOutput[] = [];
  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        ScraperService,
        CarrierPageLoader,
        CarrierPageParser,
        CarrierDataFormatter,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    output = await appController.getCarrierData();
  });

  describe('root', () => {
    it('should return 2 results"', async () => {
      expect(output).toHaveLength(2);
    });

    it('each record should have a carrier, agent, customer, and policies array', async () => {
      expect(output[0].carrier).toBeDefined();
      expect(output[0].agent).toBeDefined();
      expect(output[0].customer).toBeDefined();
      expect(output[0].policies).toBeDefined();

      expect(output[1].carrier).toBeDefined();
      expect(output[1].agent).toBeDefined();
      expect(output[1].customer).toBeDefined();
      expect(output[1].policies).toBeDefined();
    });
  });
});
