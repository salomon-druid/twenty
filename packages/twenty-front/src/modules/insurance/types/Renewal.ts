export type Renewal = {
  __typename: 'Renewal';
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  renewalDate: string | null;
  newPremium: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  status: string;
  notes: string | null;
  policyId: string | null;
  ownerId: string | null;
  position: number;
};
