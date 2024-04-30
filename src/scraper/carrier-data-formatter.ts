// Nest
import { Injectable } from '@nestjs/common';

// Interface
import {
  IApiOutput,
  ICarrierTemplateSchema,
  IParsedSchema,
  IParsedSchemaList,
} from '../interface';

@Injectable()
export class CarrierDataFormatter {
  public format(
    parsedPages: Array<IParsedSchema | IParsedSchemaList>,
    templateSchema: ICarrierTemplateSchema,
    isList: boolean = false,
  ): IApiOutput[] {
    const output: IApiOutput[] = [];

    parsedPages.forEach(
      (page: IParsedSchema | IParsedSchemaList, index: number) => {
        if (isList) {
          const formattedList = page.data.map((d: any) => {
            return templateSchema.formatter(d);
          });
          output.push({
            page: index + 1,
            data: formattedList,
          });
        } else {
          const formatted = templateSchema.formatter(page.data);
          output.push({
            page: index + 1,
            data: formatted,
          });
        }
      },
    );

    return output;
  }
}
