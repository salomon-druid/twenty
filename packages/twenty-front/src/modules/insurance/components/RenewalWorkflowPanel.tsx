import { useState } from 'react';
import { msg, t } from '@lingui/core/macro';

import { Renewal } from '@/insurance/types/Renewal';

// Enhanced renewal workflow statuses
const STATUS_OPTIONS = [
  { value: 'draft', label: t`Draft`, color: 'gray' },
  { value: 'market_research', label: t`Market Research`, color: 'blue' },
  { value: 'quote_requested', label: t`Quote Requested`, color: 'yellow' },
  { value: 'quotes_received', label: t`Quotes Received`, color: 'green' },
  { value: 'negotiation', label: t`Negotiation`, color: 'purple' },
  { value: 'client_review', label: t`Client Review`, color: 'orange' },
  { value: 'bound', label: t`Bound`, color: 'green' },
  { value: 'issued', label: t`Issued`, color: 'blue' },
  { value: 'active', label: t`Active`, color: 'green' },
  { value: 'renewal_due', label: t`Renewal Due`, color: 'yellow' },
  { value: 'renewal_negotiation', label: t`Renewal Negotiation`, color: 'purple' },
  { value: 'renewed', label: t`Renewed`, color: 'green' },
  { value: 'expired', label: t`Expired`, color: 'red' },
];

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['market_research', 'expired'],
  market_research: ['quote_requested', 'expired'],
  quote_requested: ['quotes_received', 'expired'],
  quotes_received: ['negotiation', 'expired'],
  negotiation: ['client_review', 'expired'],
  client_review: ['bound', 'negotiation', 'expired'],
  bound: ['issued'],
  issued: ['active'],
  active: ['renewal_due'],
  renewal_due: ['renewal_negotiation', 'expired'],
  renewal_negotiation: ['renewed', 'expired'],
  renewed: [],
  expired: [],
};

type RenewalWorkflowPanelProps = {
  renewal: Renewal;
  onStatusChange: (newStatus: string) => Promise<void>;
};

export function RenewalWorkflowPanel({
  renewal,
  onStatusChange,
}: RenewalWorkflowPanelProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const availableTransitions =
    VALID_TRANSITIONS[renewal.status] || [];

  const handleTransition = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === renewal.status)?.label ??
    renewal.status;

  return (
    <div>
      <h3>{t`Renewal Workflow`}</h3>
      <div>
        <span>{t`Current Status:`}</span>
        <span>{currentStatusLabel}</span>
      </div>
      <div>
        <span>{t`Renewal Date:`}</span>
        <span>{renewal.renewalDate ?? t`Not set`}</span>
      </div>
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
