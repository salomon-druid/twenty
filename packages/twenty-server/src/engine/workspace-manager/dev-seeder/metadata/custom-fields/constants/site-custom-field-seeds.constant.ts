import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const SITE_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Name',
    name: 'name',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Address',
    name: 'address',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Type',
    name: 'type',
    options: [
      { label: 'Headquarters', value: 'HEADQUARTERS', position: 0, color: 'blue' },
      { label: 'Branch', value: 'BRANCH', position: 1, color: 'green' },
      { label: 'Factory', value: 'FACTORY', position: 2, color: 'orange' },
      { label: 'Warehouse', value: 'WAREHOUSE', position: 3, color: 'yellow' },
      { label: 'Retail', value: 'RETAIL', position: 4, color: 'purple' },
      { label: 'Construction Site', value: 'CONSTRUCTION', position: 5, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Risk Zone',
    name: 'riskZone',
    options: [
      { label: 'Low Risk', value: 'LOW', position: 0, color: 'green' },
      { label: 'Medium Risk', value: 'MEDIUM', position: 1, color: 'yellow' },
      { label: 'High Risk', value: 'HIGH', position: 2, color: 'orange' },
      { label: 'Critical Risk', value: 'CRITICAL', position: 3, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Construction Year',
    name: 'constructionYear',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Area (sqm)',
    name: 'areaSqm',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Last Inspection',
    name: 'lastInspection',
  },
];
