export type Policy = {
  __typename: 'Policy';
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  policyNumber: string;
  type: string;
  startDate: string | null;
  endDate: string | null;
  premium: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  status: string;
  coverageDetails: string | null;
  insurer: string | null;
  // Commercial/Industrial specific fields
  policyType: string;
  sumInsured: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  deductible: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  coInsurance: number | null;
  underwriter: string | null;
  brokerageRate: number | null;
  invoiceNumber: string | null;
  paymentTerms: string;
  industryCode: string | null;
  employeeCount: number | null;
  annualRevenue: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  // Relations
  companyId: string | null;
  pointOfContactId: string | null;
  ownerId: string | null;
  brokerId: string | null;
  position: number;
};
