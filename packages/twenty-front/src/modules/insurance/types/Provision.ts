export type Provision = {
  __typename: 'Provision';
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  commissionRate: number | null;
  bonusMalusTier: string;
  amount: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  status: string;
  period: string;
  policyId: string | null;
  brokerId: string | null;
  ownerId: string | null;
  position: number;
};
