export interface ICarrierTemplate {
  // Base url for the carrier's website
  baseUrl: string;
  // An array of schema keys that are enabled for the current carrier
  schemaKeys: CarrierTemplateSchemaKey[];
  // Schema for the agent section of the carrier's website
  agent: ICarrierTemplateSchema;
  // Schema for the customer section of the carrier's website
  customer: ICarrierTemplateSchema;
  // Schema for the list of policies section of the carrier's website
  policies: ICarrierTemplateSchema;
}

export interface ICarrierTemplateSchema {
  // The url for the section of the carrier's website
  url: string;
  // Indicates if the section is paginated
  isPaginated: boolean;
  // The pagination element
  page?: ITemplateElement;
  // The section's root element
  root: ITemplateElement;
  // For list data, the section's data item element
  item?: ITemplateElement;
  // Wrapper for schema's formatter factory
  formatter: Function;
  // The schema's data fields
  dataFields: {
    [key: string]: ITemplateElement;
  };
}

export type CarrierTemplateSectionKey = 'agent' | 'customer';
export type CarrierTemplateListKey = 'policies';
export type CarrierTemplateSchemaKey =
  | CarrierTemplateSectionKey
  | CarrierTemplateListKey;

export interface ITemplateElement {
  // The element's html tag. Current an unused field but potentially useful for debugging
  element: string;
  // Element selector
  select: string;
  // Declaring a deepExtract function allows the CarrierPageParser to apply a custom
  // formatting rule to the html of the given element.
  // This can be used when lots of data points exist within a single element
  // without much structure or useful selectors. For example, lastPaymentDate on Placeholder Carrier.
  deepExtract?: Function;
}
