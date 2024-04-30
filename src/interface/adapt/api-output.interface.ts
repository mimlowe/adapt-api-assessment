import { Carriers } from '../../enum';
import { IAgent } from './agent.interface';
import { ICustomer } from './customer.interface';
import { IPolicy } from './policy.interface';

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
