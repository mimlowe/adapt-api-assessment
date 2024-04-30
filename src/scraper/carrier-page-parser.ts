// Packages
import cheerio from 'cheerio';
// Nest
import { Injectable } from '@nestjs/common';
// Data
import { CarrierTemplate } from '../data';
// Interface
import {
  CarrierTemplateListKey,
  CarrierTemplateSectionKey,
  ICarrierTemplate,
  ICarrierTemplateSchema,
  IHTMLSegment,
  IParsedField,
  IParsedSchema,
  IParsedSchemaList,
} from '../interface';

/**
 * The CarrierPageParser class is capable of parsing data fields specified in the CarrierTemplate configuration.
 * The purpose of the CarrierPageParser is to extract values from an HTML segment in a normalized format
 *
 * Each individual data point is formatted as an IParsedField object.
 * Additional data type casting and massaging is performed by the CarrierDataFormatter
 */
@Injectable()
export class CarrierPageParser {
  public html: IHTMLSegment | undefined;
  public template: ICarrierTemplate | undefined;

  /**
   * The CarrierPageParser class must be provided with an html string to parse
   * Additionally, each carrier has its own template of field/selector values
   * @param html
   * @param carrier
   */
  public initializeCarrierPage(html: IHTMLSegment) {
    this.html = html;
    this.template = CarrierTemplate[this.html.carrier];
  }

  /**
   * Method to get the parsed data from the html segment
   */
  public async getData(): Promise<IParsedSchema | IParsedSchemaList> {
    if (!this.html) {
      throw new Error(` ${CarrierPageParser.name} is missing an HTML segment.`);
    }

    if (!this.template) {
      throw new Error(
        ` ${CarrierPageParser.name} is missing a carrier template.`,
      );
    }

    switch (this.html.dataSchemaKey) {
      case 'agent':
      case 'customer':
        return {
          carrier: this.html.carrier,
          schemaKey: this.html.dataSchemaKey,
          data: await this.getSectionData(this.html.dataSchemaKey),
        } as IParsedSchema;
      case 'policies':
        return {
          carrier: this.html.carrier,
          schemaKey: this.html.dataSchemaKey,
          data: await this.getListData(this.html.dataSchemaKey),
        } as IParsedSchemaList;
    }
  }

  /**
   * Parse all field data for a flat object from a specified data section.
   * Example usage: Get data for all fields specified for 'agent' data
   * @param schemaKey
   */
  public async getSectionData(
    schemaKey: CarrierTemplateSectionKey,
  ): Promise<IParsedField[]> {
    if (!this.html) {
      throw new Error(` ${CarrierPageParser.name} is missing an HTML segment.`);
    }

    if (!this.template) {
      throw new Error(
        ` ${CarrierPageParser.name} is missing a carrier template.`,
      );
    }

    const $: cheerio.Root = cheerio.load(this.html.html);
    const template: ICarrierTemplateSchema = this.template[schemaKey];
    const rootElement: cheerio.Cheerio = $.root();
    const result: IParsedField[] = [];

    for (const [key, value] of Object.entries(template.dataFields)) {
      const element: IParsedField = {
        fieldName: key,
        value: rootElement.find(value.select).html(),
      };
      if (value.deepExtract) {
        element.value = value.deepExtract(element.value);
      }
      result.push(element);
    }

    return result;
  }

  /**
   * Parse list of field data for objects from a specified data list section
   * @param listName
   */
  public async getListData(
    listName: CarrierTemplateListKey,
  ): Promise<IParsedField[][]> {
    if (!this.html) {
      throw new Error(` ${CarrierPageParser.name} is missing an HTML body.`);
    }

    if (!this.template) {
      throw new Error(
        ` ${CarrierPageParser.name} is missing a carrier template.`,
      );
    }

    const $: cheerio.Root = cheerio.load(this.html.html);
    const template: ICarrierTemplateSchema = this.template[listName];
    const rootList: cheerio.Element[] = $(template.item?.select).toArray();
    const result: IParsedField[][] = [];

    for (const itemElement of rootList) {
      const entry: IParsedField[] = [];
      for (const [key, value] of Object.entries(template.dataFields)) {
        const element: IParsedField = {
          fieldName: key,
          value: $(value.select, itemElement).html(),
        };
        if (value.deepExtract) {
          element.value = value.deepExtract(element.value);
        }
        entry.push(element);
      }

      result.push(entry);
    }

    return result;
  }
}
