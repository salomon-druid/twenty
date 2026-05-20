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
  companyId: string | null;
  pointOfContactId: string | null;
  ownerId: string | null;
  position: number;
};
