import { Carriers } from '../../enum';
import { CarrierTemplateSchemaKey } from './carrier-template.interface';

export interface IParsedField {
  fieldName: string;
  value: string | null;
}

export interface IParsedSchema {
  carrier: Carriers;
  schemaKey: CarrierTemplateSchemaKey;
  data: IParsedField[];
}

export interface IParsedSchemaList extends Omit<IParsedSchema, 'data'> {
  data: IParsedField[][];
}

export interface IParsedPage {
  agent: IParsedField[];
  customer: IParsedField[];
  policies: IParsedField[][];
}
