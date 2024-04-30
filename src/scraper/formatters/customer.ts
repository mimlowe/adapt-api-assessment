import { ICustomer, IParsedField } from '../../interface';

export class Customer implements ICustomer {
  public name: string = '';
  public address: string = '';
  public email: string = '';
  public id: string = '';

  public static withParsedFields(fields: IParsedField[]): Customer {
    const customer: Customer = new Customer();

    for (const key of Object.keys(customer) as (keyof ICustomer)[]) {
      const field: IParsedField | undefined = fields.find(
        (el: IParsedField): boolean => el.fieldName === key,
      );
      if (field && field.value) {
        customer[key] = field.value;
      }
    }
    return customer;
  }

  public toObject(): ICustomer {
    return {
      name: this.name,
      id: this.id,
      email: this.email,
      address: this.address,
    } as ICustomer;
  }
}
