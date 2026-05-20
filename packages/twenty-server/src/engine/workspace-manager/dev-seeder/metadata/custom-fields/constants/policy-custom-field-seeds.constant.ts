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
  // Commercial/Industrial specific fields
  {
    type: FieldMetadataType.SELECT,
    label: 'Policy Type',
    name: 'policyType',
    options: [
      { label: 'Commercial', value: 'COMMERCIAL', position: 0, color: 'blue' },
      { label: 'Industrial', value: 'INDUSTRIAL', position: 1, color: 'orange' },
      { label: 'Mixed', value: 'MIXED', position: 2, color: 'purple' },
    ],
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Sum Insured',
    name: 'sumInsured',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Deductible',
    name: 'deductible',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Co-Insurance (%)',
    name: 'coInsurance',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Underwriter',
    name: 'underwriter',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Brokerage Rate (%)',
    name: 'brokerageRate',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Invoice Number',
    name: 'invoiceNumber',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Payment Terms',
    name: 'paymentTerms',
    options: [
      { label: 'Monthly', value: 'MONTHLY', position: 0, color: 'blue' },
      { label: 'Quarterly', value: 'QUARTERLY', position: 1, color: 'green' },
      { label: 'Semi-Annual', value: 'SEMI_ANNUAL', position: 2, color: 'yellow' },
      { label: 'Annual', value: 'ANNUAL', position: 3, color: 'orange' },
      { label: 'Single Premium', value: 'SINGLE', position: 4, color: 'purple' },
    ],
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Industry Code',
    name: 'industryCode',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Employee Count',
    name: 'employeeCount',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Annual Revenue',
    name: 'annualRevenue',
  },
];
