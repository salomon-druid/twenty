import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataSeed } from 'src/engine/workspace-manager/dev-seeder/metadata/types/field-metadata-seed.type';

export const INSURANCE_TASK_CUSTOM_FIELD_SEEDS: FieldMetadataSeed[] = [
  {
    type: FieldMetadataType.TEXT,
    label: 'Title',
    name: 'title',
  },
  {
    type: FieldMetadataType.TEXT,
    label: 'Description',
    name: 'description',
  },
  {
    type: FieldMetadataType.DATE,
    label: 'Due Date',
    name: 'dueDate',
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Priority',
    name: 'priority',
    options: [
      { label: 'Low', value: 'LOW', position: 0, color: 'green' },
      { label: 'Medium', value: 'MEDIUM', position: 1, color: 'yellow' },
      { label: 'High', value: 'HIGH', position: 2, color: 'orange' },
      { label: 'Urgent', value: 'URGENT', position: 3, color: 'red' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Status',
    name: 'status',
    options: [
      { label: 'Open', value: 'OPEN', position: 0, color: 'blue' },
      { label: 'In Progress', value: 'IN_PROGRESS', position: 1, color: 'yellow' },
      { label: 'Completed', value: 'COMPLETED', position: 2, color: 'green' },
      { label: 'Cancelled', value: 'CANCELLED', position: 3, color: 'gray' },
    ],
  },
  {
    type: FieldMetadataType.SELECT,
    label: 'Type',
    name: 'type',
    options: [
      { label: 'Renewal Follow-up', value: 'RENEWAL_FOLLOWUP', position: 0, color: 'blue' },
      { label: 'Claim Follow-up', value: 'CLAIM_FOLLOWUP', position: 1, color: 'orange' },
      { label: 'Client Meeting', value: 'CLIENT_MEETING', position: 2, color: 'green' },
      { label: 'Document Request', value: 'DOCUMENT_REQUEST', position: 3, color: 'yellow' },
      { label: 'Inspection', value: 'INSPECTION', position: 4, color: 'purple' },
      { label: 'Payment Reminder', value: 'PAYMENT_REMINDER', position: 5, color: 'red' },
      { label: 'Other', value: 'OTHER', position: 6, color: 'gray' },
    ],
  },
];
