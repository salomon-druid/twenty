export type Quote = {
  __typename: 'Quote';
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  quoteNumber: string;
  status: string;
  validUntil: string | null;
  proposedPremium: {
    __typename?: 'Currency';
    amountMicros: number | null;
    currencyCode: string;
  } | null;
  negotiationNotes: string | null;
  boundDate: string | null;
  policyId: string | null;
  companyId: string | null;
  personId: string | null;
  ownerId: string | null;
  brokerId: string | null;
  position: number;
};
