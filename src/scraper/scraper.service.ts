// Nest
import { Injectable } from '@nestjs/common';
// Interface
import {
  CarrierTemplateSchemaKey,
  IApiOutput,
  IApiPageOutput,
  ICarrierTemplateSchema,
  IHTMLSegment,
  IParsedSchema,
  IParsedSchemaList,
  IScraperInput,
} from '../interface';
// Enum
import { Carriers } from '../enum';
// Data
import * as InputFile from '../input.json';
import { CarrierTemplate } from '../data';
// Services
import { CarrierDataFormatter, CarrierPageLoader, CarrierPageParser } from './';

@Injectable()
export class ScraperService {
  public constructor(
    private readonly loader: CarrierPageLoader,
    private readonly parser: CarrierPageParser,
    private readonly formatter: CarrierDataFormatter,
  ) {}

  /**
   * Scraping function to orchestrate loading, parsing, and data formatting
   */
  public async scrape(): Promise<IApiPageOutput[]> {
    // Read inputs
    const input: IScraperInput[] = InputFile.input;

    // Declare an array to hold the final page output, 1 record per carrier
    const output: IApiPageOutput[] = [];

    for (const i of input) {
      const carrier: Carriers = i.carrier as Carriers;
      const schemaKeys: CarrierTemplateSchemaKey[] =
        CarrierTemplate[carrier].schemaKeys;

      // Declare an object to hold the formatted page data
      const formattedPage: IApiPageOutput = {
        carrier: carrier,
        agent: [],
        customer: [],
        policies: [],
      };

      // We want to iterate over the available schema keys for the current carrier.
      // These can be turned on or off by adding/remove the keys from the carrier's schema keys array in CarrierTemplate
      for (const schemaKey of schemaKeys) {
        const templateSchema: ICarrierTemplateSchema =
          CarrierTemplate[carrier][schemaKey];

        // Initialize the this.loader for the current input and schema key
        // For example: ('agent', 'MOCK_INDEMNITY') will load all html for the agent section of the MOCK_INDEMNITY carrier
        this.loader.initializeCarrier(schemaKey, carrier);
        await this.loader.load(i.customerId);

        // // Parse the html segments that we've loaded for the current carrier & schema
        const parsedPages: Array<IParsedSchema | IParsedSchemaList> =
          await this.parsePages(this.loader.html);

        // // Format the data fields
        const pageOut: IApiOutput[] = this.formatter.format(
          parsedPages,
          templateSchema,
          templateSchema.item !== undefined,
        );

        // Add the formatted page data to the output element for the current carrier
        if (formattedPage[schemaKey]) {
          formattedPage[schemaKey] = formattedPage[schemaKey]?.concat(pageOut);
        }
      }
      // Add the carrier's formatted page output to the api output
      output.push(formattedPage);
    }

    const jsonOut = JSON.stringify(output, null, 2);

    // Log the output
    console.log(jsonOut);

    // Finally, write the output to a JSON file
    //writeFileSync(`../out/${new Date().toDateString()}.json`, jsonOut);

    return output;
  }

  /**
   * Parsing function to extract normalized field data from the provided pages
   * @param pages An array of page bodies
   */
  private async parsePages(
    pages: Array<IHTMLSegment | null>,
  ): Promise<Array<IParsedSchema | IParsedSchemaList>> {
    const result: Array<IParsedSchema | IParsedSchemaList> = [];

    for (const html of pages) {
      if (!html) continue;

      // Initialize the parser with the current html segment
      this.parser.initializeCarrierPage(html);

      // Attempt to parse the data on the current segment and add the parsed page to the results
      try {
        const data: IParsedSchema | IParsedSchemaList =
          await this.parser.getData();
        result.push(data);
      } catch (e) {
        console.log(e);
      }
    }

    return result;
  }
}
