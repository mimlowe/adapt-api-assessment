export interface IPolicy {
  id: string;
  premium: string | number;
  status: string;
  effectiveDate: string | Date;
  terminationDate: string | Date;
  lastPaymentDate: string | Date;
  commissionRate?: string;
  numberInsured?: string | number;
}
