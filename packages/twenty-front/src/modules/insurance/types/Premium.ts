export type Premium = {
  __typename: 'Premium';
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  amount: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  period: string;
  paymentStatus: string;
  dueDate: string | null;
  paidDate: string | null;
  policyId: string | null;
  ownerId: string | null;
  brokerId: string | null;
  position: number;
};
