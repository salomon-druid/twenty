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
  policyId: string | null;
  companyId: string | null;
  personId: string | null;
  ownerId: string | null;
  brokerId: string | null;
  position: number;
};
