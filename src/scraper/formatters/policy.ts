import { IParsedField, IPolicy } from '../../interface';

export class Policy implements IPolicy {
  public id: string = '';
  public premium: string = '';
  public status: string = '';
  public effectiveDate: string = '';
  public terminationDate: string = '';
  public lastPaymentDate: string = '';
  public commissionRate: string = '';
  public numberInsured: string = '';

  public static withParsedFields(fields: IParsedField[]): Policy {
    const policy: Policy = new Policy();

    for (const key of Object.keys(policy) as (keyof IPolicy)[]) {
      const field: IParsedField | undefined = fields.find(
        (el: IParsedField): boolean => el.fieldName === key,
      );
      if (field && field.value) {
        if (policy.hasOwnProperty(key)) {
          policy[key] = field.value;
        }
      }
    }
    return policy;
  }
  public toObject(): IPolicy {
    const obj: IPolicy = {
      id: this.id,
      premium: Number(this.premium),
      status: this.status,
      effectiveDate: new Date(this.effectiveDate),
      terminationDate: new Date(this.terminationDate),
      lastPaymentDate: new Date(this.lastPaymentDate),
      commissionRate: this.commissionRate,
      numberInsured:
        this.numberInsured !== '' ? Number(this.numberInsured) : '',
    } as IPolicy;

    this.deleteUndefined(obj);
    return obj;
  }

  private deleteUndefined(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === '') {
        delete obj[key];
      }
    });
  }
}
