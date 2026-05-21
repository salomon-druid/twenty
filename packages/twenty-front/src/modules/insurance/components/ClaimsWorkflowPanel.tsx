import { useState } from 'react';
import { t } from '@lingui/core/macro';

import { Claim } from '@/insurance/types/Claim';

const STATUS_OPTIONS = [
  { value: 'reported', label: t`Reported`, color: 'yellow' },
  { value: 'acknowledged', label: t`Acknowledged`, color: 'blue' },
  { value: 'assigned', label: t`Assigned`, color: 'purple' },
  { value: 'investigation', label: t`Investigation`, color: 'orange' },
  { value: 'assessment', label: t`Assessment`, color: 'blue' },
  { value: 'negotiation', label: t`Negotiation`, color: 'purple' },
  { value: 'settlement', label: t`Settlement`, color: 'green' },
  { value: 'payment', label: t`Payment`, color: 'green' },
  { value: 'litigation', label: t`Litigation`, color: 'red' },
  { value: 'court', label: t`Court`, color: 'red' },
  { value: 'judgment', label: t`Judgment`, color: 'orange' },
  { value: 'recovery', label: t`Recovery`, color: 'blue' },
  { value: 'subrogation', label: t`Subrogation`, color: 'purple' },
  { value: 'recovered', label: t`Recovered`, color: 'green' },
  { value: 'closed', label: t`Closed`, color: 'gray' },
];

const VALID_TRANSITIONS: Record<string, string[]> = {
  reported: ['acknowledged', 'closed'],
  acknowledged: ['assigned', 'closed'],
  assigned: ['investigation', 'closed'],
  investigation: ['assessment', 'closed'],
  assessment: ['negotiation', 'litigation', 'closed'],
  negotiation: ['settlement', 'litigation', 'closed'],
  settlement: ['payment', 'closed'],
  payment: ['closed'],
  litigation: ['court', 'settlement', 'closed'],
  court: ['judgment', 'settlement', 'closed'],
  judgment: ['payment', 'closed'],
  recovery: ['subrogation', 'closed'],
  subrogation: ['recovered', 'closed'],
  recovered: ['closed'],
  closed: [],
};

type ClaimsWorkflowPanelProps = {
  claim: Claim;
  onStatusChange: (newStatus: string) => Promise<void>;
};

export function ClaimsWorkflowPanel({
  claim,
  onStatusChange,
}: ClaimsWorkflowPanelProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const availableTransitions =
    VALID_TRANSITIONS[claim.status] || [];

  const handleTransition = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === claim.status)?.label ??
    claim.status;

  return (
    <div>
      <h3>{t`Claims Workflow`}</h3>
      <div>
        <span>{t`Claim Number:`}</span>
        <span>{claim.claimNumber}</span>
      </div>
      <div>
        <span>{t`Current Status:`}</span>
        <span>{currentStatusLabel}</span>
      </div>
      <div>
        <span>{t`Amount:`}</span>
        <span>
          {claim.amount
            ? `${(claim.amount.amountMicros ?? 0) / 1000000} ${claim.amount.currencyCode}`
            : t`N/A`}
        </span>
      </div>
      {claim.claimType && (
        <div>
          <span>{t`Claim Type:`}</span>
          <span>{claim.claimType}</span>
        </div>
      )}
      {availableTransitions.length > 0 && (
        <div>
          <span>{t`Actions:`}</span>
          {availableTransitions.map((status) => (
            <button
              key={status}
              onClick={() => handleTransition(status)}
              disabled={isUpdating}
            >
              {STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
