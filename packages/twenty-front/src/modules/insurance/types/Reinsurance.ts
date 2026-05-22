export type Reinsurance = {
  __typename: 'Reinsurance';
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  treatyNumber: string;
  type: string;
  reinsurer: string;
  cededPercentage: number | null;
  cededAmount: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  commission: number | null;
  validFrom: string | null;
  validTo: string | null;
  policyId: string | null;
  ownerId: string | null;
  brokerId: string | null;
  position: number;
};
