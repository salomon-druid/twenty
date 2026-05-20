import { useState } from 'react';
import { msg, t } from '@lingui/core/macro';

import { Renewal } from '@/insurance/types/Renewal';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'contacted', label: 'Contacted', color: 'blue' },
  { value: 'negotiated', label: 'Negotiated', color: 'purple' },
  { value: 'renewed', label: 'Renewed', color: 'green' },
  { value: 'expired', label: 'Expired', color: 'red' },
];

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['contacted', 'expired'],
  contacted: ['negotiated', 'expired'],
  negotiated: ['renewed', 'expired'],
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

  return (
    <div>
      <h3>{t`Renewal Workflow`}</h3>
      <div>
        <span>{t`Current Status:`}</span>
        <span>
          {STATUS_OPTIONS.find((s) => s.value === renewal.status)?.label ?? renewal.status}
        </span>
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
