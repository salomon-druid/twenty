import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const RENEWAL_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.DATE,
    label: 'Renewal Date',
    name: 'renewalDate',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'New Premium',
    name: 'newPremium',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    options: [
      { label: 'Pending', value: 'PENDING', position: 0, color: 'yellow' },
      { label: 'Contacted', value: 'CONTACTED', position: 1, color: 'blue' },
      { label: 'Negotiated', value: 'NEGOTIATED', position: 2, color: 'purple' },
      { label: 'Renewed', value: 'RENEWED', position: 3, color: 'green' },
      { label: 'Expired', value: 'EXPIRED', position: 4, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Notes',
    name: 'notes',
  },
];
