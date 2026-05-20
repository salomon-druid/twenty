export type Claim = {
  __typename: 'Claim';
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  claimNumber: string;
  date: string | null;
  amount: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  status: string;
  description: string | null;
  resolution: string | null;
  // Commercial/Industrial specific fields
  claimType: string;
  dateOfLoss: string | null;
  dateReported: string | null;
  reserveAmount: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  paidAmount: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  recoveredAmount: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  deductibleApplied: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  adjuster: string | null;
  adjusterCompany: string | null;
  lawFirm: string | null;
  courtCase: boolean;
  settlementDate: string | null;
  rootCause: string | null;
  preventionMeasures: string | null;
  isReinsurance: boolean;
  reinsurerShare: number | null;
  // Relations
  policyId: string | null;
  companyId: string | null;
  personId: string | null;
  ownerId: string | null;
  brokerId: string | null;
  position: number;
};
