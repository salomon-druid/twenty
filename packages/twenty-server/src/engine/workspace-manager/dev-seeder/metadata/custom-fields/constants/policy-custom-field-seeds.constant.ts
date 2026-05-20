import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const POLICY_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Policy Number',
    name: 'policyNumber',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Type',
    name: 'type',
    options: [
      { label: 'Commercial', value: 'COMMERCIAL', position: 0, color: 'blue' },
      { label: 'Industrial', value: 'INDUSTRIAL', position: 1, color: 'green' },
      { label: 'Liability', value: 'LIABILITY', position: 2, color: 'yellow' },
      { label: 'Property', value: 'PROPERTY', position: 3, color: 'orange' },
      { label: 'Cyber', value: 'CYBER', position: 4, color: 'red' },
      { label: 'Directors & Officers', value: 'D_AND_O', position: 5, color: 'purple' },
    ],
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Start Date',
    name: 'startDate',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'End Date',
    name: 'endDate',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Premium',
    name: 'premium',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    options: [
      { label: 'Active', value: 'ACTIVE', position: 0, color: 'green' },
      { label: 'Expired', value: 'EXPIRED', position: 1, color: 'red' },
      { label: 'Cancelled', value: 'CANCELLED', position: 2, color: 'gray' },
      { label: 'Pending', value: 'PENDING', position: 3, color: 'yellow' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Coverage Details',
    name: 'coverageDetails',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Insurer',
    name: 'insurer',
  },
];
