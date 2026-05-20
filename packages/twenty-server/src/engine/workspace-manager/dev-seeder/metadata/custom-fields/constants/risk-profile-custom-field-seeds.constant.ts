import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const RISK_PROFILE_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.SELECT,
    label: 'Risk Category',
    name: 'riskCategory',
    options: [
      { label: 'Low', value: 'LOW', position: 0, color: 'green' },
      { label: 'Medium', value: 'MEDIUM', position: 1, color: 'yellow' },
      { label: 'High', value: 'HIGH', position: 2, color: 'orange' },
      { label: 'Critical', value: 'CRITICAL', position: 3, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Assessment Date',
    name: 'assessmentDate',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Score',
    name: 'score',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Notes',
    name: 'notes',
  },
];
