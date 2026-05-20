import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const CLAIM_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Claim Number',
    name: 'claimNumber',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Date',
    name: 'date',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Amount',
    name: 'amount',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    options: [
      { label: 'Open', value: 'OPEN', position: 0, color: 'yellow' },
      { label: 'In Review', value: 'IN_REVIEW', position: 1, color: 'blue' },
      { label: 'Approved', value: 'APPROVED', position: 2, color: 'green' },
      { label: 'Rejected', value: 'REJECTED', position: 3, color: 'red' },
      { label: 'Closed', value: 'CLOSED', position: 4, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Description',
    name: 'description',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Resolution',
    name: 'resolution',
  },
];
