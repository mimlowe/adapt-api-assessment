import { Carriers } from '../../enum';
import { CarrierTemplateSchemaKey } from './carrier-template.interface';

export interface IHTMLSegment {
  carrier: Carriers;
  dataSchemaKey: CarrierTemplateSchemaKey;
  html: string;
  page: number;
}
