// Packages
import cheerio from 'cheerio';
import axios from 'axios';
// Nest
import { Injectable } from '@nestjs/common';
// Data
import { CarrierTemplate } from '../data';
// Interface
import {
  CarrierTemplateSchemaKey,
  ICarrierTemplate,
  ICarrierTemplateSchema,
  IHTMLSegment,
} from '../interface';
// Enum
import { Carriers } from '../enum';

/**
 * The CarrierPageLoader class is used load page bodies for a given Carrier.
 */
@Injectable()
export class CarrierPageLoader {
  public html: Array<IHTMLSegment | null> = [];
  public template: ICarrierTemplate | undefined;
  public schemaKey: CarrierTemplateSchemaKey | undefined;
  public carrier: Carriers | undefined;
  /**
   * This method initializes the CarrierPageLoader instance with an empty array of html
   * and the configuration template for the provided Carrier.
   * @param schemaKey
   * @param carrier
   */
  public initializeCarrier(
    schemaKey: CarrierTemplateSchemaKey,
    carrier: Carriers,
  ) {
    this.html = [];
    this.carrier = carrier;
    this.template = CarrierTemplate[carrier];
    this.schemaKey = schemaKey;
  }

  /**
   * Method to begin loading html
   * @param id
   */
  public async load(id: string): Promise<void> {
    if (!this.template) {
      throw new Error(
        `${CarrierPageLoader.name} carrier template is undefined.`,
      );
    }
    if (!this.schemaKey) {
      throw new Error(`${CarrierPageLoader.name} schema key is undefined.`);
    }
    // Construct the initial page url using the carrier template configuration
    const url: string = (
      this.template.baseUrl + this.template[this.schemaKey].url
    ).replace(':id', id);

    // Load all html for the current carrier
    await this.loadBodyPages(id, url, this.template[this.schemaKey]);
  }

  /**
   * This method will load the body of the page at the specified url.
   * It will also recursively attempt to find and load the next page url
   * @param id
   * @param url
   * @param schemaTemplate
   * @param pageNumber
   */
  private async loadBodyPages(
    id: string,
    url: string,
    schemaTemplate: ICarrierTemplateSchema,
    pageNumber: number = 0,
  ): Promise<void> {
    if (!this.template) {
      throw new Error(
        `${CarrierPageLoader.name} carrier template is undefined.`,
      );
    }

    // Load the page from the provided url;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    // Get the segment root from the page
    const htmlSegment: string = $(schemaTemplate.root.select).html() || '';

    // Save the body to the html array
    this.html.push({
      carrier: this.carrier as Carriers,
      dataSchemaKey: this.schemaKey as CarrierTemplateSchemaKey,
      html: htmlSegment,
      page: pageNumber,
    });
    /**
     * If the carrier's template specifies that the data is paginated,
     * then we want to attempt to select the href attribute from the page
     * navigation element. If we find an href, then we will recursively call
     * this method and continue the load/navigate loop, saving each page we encounter.
     */
    if (schemaTemplate.isPaginated && schemaTemplate.page) {
      // Attempt to parse out the next url from the current page
      const nextPageUrl = $(schemaTemplate.page.select).attr('href');
      if (nextPageUrl) {
        await this.loadBodyPages(
          id,
          this.template.baseUrl + nextPageUrl,
          schemaTemplate,
          pageNumber + 1,
        );
      }
    }
  }
}
