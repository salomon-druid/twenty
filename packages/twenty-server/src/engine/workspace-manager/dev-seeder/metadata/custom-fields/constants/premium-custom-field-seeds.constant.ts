import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const PREMIUM_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Amount',
    name: 'amount',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Period',
    name: 'period',
    options: [
      { label: 'Monthly', value: 'MONTHLY', position: 0, color: 'blue' },
      { label: 'Quarterly', value: 'QUARTERLY', position: 1, color: 'green' },
      { label: 'Semi-Annual', value: 'SEMI_ANNUAL', position: 2, color: 'yellow' },
      { label: 'Annual', value: 'ANNUAL', position: 3, color: 'orange' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Payment Status',
    name: 'paymentStatus',
    options: [
      { label: 'Paid', value: 'PAID', position: 0, color: 'green' },
      { label: 'Unpaid', value: 'UNPAID', position: 1, color: 'red' },
      { label: 'Overdue', value: 'OVERDUE', position: 2, color: 'orange' },
      { label: 'Partial', value: 'PARTIAL', position: 3, color: 'yellow' },
    ],
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Due Date',
    name: 'dueDate',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Paid Date',
    name: 'paidDate',
  },
];
