# TypeScript Carrier Scraper

A highly extensible and scalable web scraping solution for [Adapt API's](https://adaptinsurance.com/) take-home project.

![Diagram](diagram.jpg "Diagram")

# CarrierTemplate
Each Carrier has a Carrier Template which is used to define the behavior of our scraper when loading and parsing its pages.
The `CarrierTemplate` definition is located at the path `./data/carrier-template.ts`.

### ITemplateElement
Most of the fields on the `ICarrierTemplate` are of type `ITemplateElement`.
This interface provides us with a path to selecting and parsing data for each individual field.
```typescript
export interface ITemplateElement {
    // element tag type
    element: string, 
    // selector string, used to find the element on page
    select: string,
    // optional #id
    id?: string, 
    // Custom function to deeply extract 
    // data from unstructured elements
    deepExtract?: Function
}
```

### Root
Each section of the `ICarrierTemplate` (`agent`, `customer`, `policies`) also has a root element.
The root element allows us to limit the scope of our parser. 

The selectors for individual data fields are relative to that section's root element.

### Pagination
`ICarrierTemplate` also allows us to specify if a given carrier has paginated data with the `isPaginated` flag.

For paginated carriers, the `page: ItemplateElement` field should contain a selector
for the element which performs the page navigation. 

In the case of this program, the `page` field is used for `Placeholder Carrier`, and we are specifically grabbing its `href` attribute.

The `CarrierPageLoader` class is capable of recursively crawling and storing multiple pages to be parsed by `CarrierPageParser`.
```typescript
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
```


# Classes

## CarrierPageLoader
The `CarrierPageLoader` class is used to load and store page bodies for a given Carrier.


It is capable of recursively crawling across paginated data. 

## CarrierPageParser

The `CarrierPageParser` class is capable of parsing data fields specified in the `CarrierTemplate` configuration.


The purpose of the `CarrierPageParser` class is to extract values from an HTML page in a normalized format.

Each individual data point parsed by this class is formatted as an `IParsedField` object.


### IParsedField
Individual data field parsed from html body.

```typescript
interface IParsedField {
    fieldName: string,
    value: string | null
}
```

### IParsedPage
Collection of data fields parsed from html body and organized by data category.

`IParsedPage` is returned by `CarrierPageParser.getData()`. 
```typescript
export interface IParsedPage {
  agent: IParsedField[];
  customer: IParsedField[];
  policies: IParsedField[][];
}

```

## CarrierDataFormatter

The `CarrierDataFormatter` class takes an array of `IParsedPage` objects as an input
and transforms the data into a more readable/usable format.

Ultimately, this class orchestrates the overall formatting of page data using the following formatter classes:
`Agent`, `Customer`, `Policy`.

The `format()` method outputs the data as `IApiOutput[]`

### IApiOutput

```typescript
export interface IApiOutput {
  data: IAgent | ICustomer | IPolicy[];
  page: number;
}

export interface IApiPageOutput {
  carrier: Carriers;
  agent?: IApiOutput[];
  customer?: IApiOutput[];
  policies?: IApiOutput[];
}
```