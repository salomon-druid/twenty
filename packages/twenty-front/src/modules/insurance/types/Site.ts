export type Site = {
  __typename: 'Site';
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  name: string;
  address: string | null;
  type: string;
  riskZone: string;
  constructionYear: number | null;
  areaSqm: number | null;
  lastInspection: string | null;
  companyId: string | null;
  ownerId: string | null;
  brokerId: string | null;
  position: number;
};
