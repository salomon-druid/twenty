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
  // Commercial/Industrial specific fields
  {
    type: FieldMetadataType.SELECT,
    label: 'Claim Type',
    name: 'claimType',
    options: [
      { label: 'Property Damage', value: 'PROPERTY_DAMAGE', position: 0, color: 'orange' },
      { label: 'Liability', value: 'LIABILITY', position: 1, color: 'yellow' },
      { label: 'Business Interruption', value: 'BUSINESS_INTERRUPTION', position: 2, color: 'blue' },
      { label: 'Machinery Breakdown', value: 'MACHINERY_BREAKDOWN', position: 3, color: 'red' },
      { label: 'Cyber Incident', value: 'CYBER_INCIDENT', position: 4, color: 'purple' },
      { label: 'Environmental', value: 'ENVIRONMENTAL', position: 5, color: 'green' },
      { label: 'Product Liability', value: 'PRODUCT_LIABILITY', position: 6, color: 'yellow' },
    ],
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Date of Loss',
    name: 'dateOfLoss',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Date Reported',
    name: 'dateReported',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Reserve Amount',
    name: 'reserveAmount',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Paid Amount',
    name: 'paidAmount',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Recovered Amount',
    name: 'recoveredAmount',
  },
  {
    type: FieldMetadataType.CURRENCY,
    label: 'Deductible Applied',
    name: 'deductibleApplied',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Adjuster',
    name: 'adjuster',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Adjuster Company',
    name: 'adjusterCompany',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Law Firm',
    name: 'lawFirm',
  },
  {
    type: FieldMetadataType.BOOLEAN,
    label: 'Court Case',
    name: 'courtCase',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Settlement Date',
    name: 'settlementDate',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Root Cause',
    name: 'rootCause',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Prevention Measures',
    name: 'preventionMeasures',
  },
  {
    type: FieldMetadataType.BOOLEAN,
    label: 'Reinsurance',
    name: 'isReinsurance',
  },
  {
    type: FieldMetadataType.NUMBER,
    label: 'Reinsurer Share (%)',
    name: 'reinsurerShare',
  },
];
