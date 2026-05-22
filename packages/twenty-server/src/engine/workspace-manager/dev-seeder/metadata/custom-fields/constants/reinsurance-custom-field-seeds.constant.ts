import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const REINSURANCE_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Treaty Number',
    name: 'treatyNumber',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Type',
    name: 'type',
    options: [
      {
        label: 'Quota Share',
        value: 'QUOTA_SHARE',
        position: 0,
        color: 'blue',
      },
      {
        label: 'Surplus',
        value: 'SURPLUS',
        position: 1,
        color: 'green',
      },
      {
        label: 'Excess of Loss',
        value: 'EXCESS_OF_LOSS',
        position: 2,
        color: 'orange',
      },
      {
        label: 'Stop Loss',
        value: 'STOP_LOSS',
        position: 3,
        color: 'red',
      },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Reinsurer',
    name: 'reinsurer',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Ceded Percentage',
    name: 'cededPercentage',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Ceded Amount',
    name: 'cededAmount',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Commission',
    name: 'commission',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Valid From',
    name: 'validFrom',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Valid To',
    name: 'validTo',
  },
];
