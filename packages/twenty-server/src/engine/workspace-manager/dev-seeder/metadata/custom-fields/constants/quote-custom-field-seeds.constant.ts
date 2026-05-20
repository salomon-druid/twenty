import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const QUOTE_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Quote Number',
    name: 'quoteNumber',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    options: [
      { label: 'Draft', value: 'DRAFT', position: 0, color: 'gray' },
      { label: 'Sent', value: 'SENT', position: 1, color: 'blue' },
      { label: 'Negotiating', value: 'NEGOTIATING', position: 2, color: 'yellow' },
      { label: 'Bound', value: 'BOUND', position: 3, color: 'green' },
      { label: 'Declined', value: 'DECLINED', position: 4, color: 'red' },
      { label: 'Expired', value: 'EXPIRED', position: 5, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Valid Until',
    name: 'validUntil',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Proposed Premium',
    name: 'proposedPremium',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Negotiation Notes',
    name: 'negotiationNotes',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Bound Date',
    name: 'boundDate',
  },
];
