export type RiskProfile = {
  __typename: 'RiskProfile';
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  riskCategory: string;
  assessmentDate: string | null;
  score: number | null;
  notes: string | null;
  companyId: string | null;
  personId: string | null;
  ownerId: string | null;
  brokerId: string | null;
  position: number;
};
