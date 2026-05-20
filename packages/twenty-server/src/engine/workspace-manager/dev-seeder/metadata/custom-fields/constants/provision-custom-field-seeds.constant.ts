import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const PROVISION_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.NUMBER,
    label: 'Commission Rate (%)',
    name: 'commissionRate',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Bonus-Malus Tier',
    name: 'bonusMalusTier',
    options: [
      { label: 'Bonus 5', value: 'BONUS_5', position: 0, color: 'green' },
      { label: 'Bonus 4', value: 'BONUS_4', position: 1, color: 'green' },
      { label: 'Bonus 3', value: 'BONUS_3', position: 2, color: 'green' },
      { label: 'Bonus 2', value: 'BONUS_2', position: 3, color: 'green' },
      { label: 'Bonus 1', value: 'BONUS_1', position: 4, color: 'green' },
      { label: 'Neutral', value: 'NEUTRAL', position: 5, color: 'gray' },
      { label: 'Malus 1', value: 'MALUS_1', position: 6, color: 'red' },
      { label: 'Malus 2', value: 'MALUS_2', position: 7, color: 'red' },
      { label: 'Malus 3', value: 'MALUS_3', position: 8, color: 'red' },
    ],
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
      { label: 'Pending', value: 'PENDING', position: 0, color: 'yellow' },
      { label: 'Paid', value: 'PAID', position: 1, color: 'green' },
      { label: 'Overdue', value: 'OVERDUE', position: 2, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Period',
    name: 'period',
    options: [
      { label: 'Monthly', value: 'MONTHLY', position: 0, color: 'blue' },
      { label: 'Quarterly', value: 'QUARTERLY', position: 1, color: 'green' },
      { label: 'Annual', value: 'ANNUAL', position: 2, color: 'orange' },
    ],
  },
];
