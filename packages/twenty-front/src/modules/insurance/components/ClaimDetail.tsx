import { t } from '@lingui/core/macro';

import { Claim } from '@/insurance/types/Claim';
import { Policy } from '@/insurance/types/Policy';

type ClaimDetailProps = {
  claim: Claim;
  policy: Policy | null;
  onEdit: () => void;
  onStatusUpdate: (status: string) => void;
};

function formatCurrency(amountMicros: number | null, currencyCode = 'EUR'): string {
  if (amountMicros == null) return t`N/A`;
  return `${(amountMicros / 1000000).toFixed(2)} ${currencyCode}`;
}

function formatDate(date: string | null): string {
  if (!date) return t`N/A`;
  return new Date(date).toLocaleDateString('de-DE');
}

const CLAIM_STATUS_STEPS = [
  'reported',
  'acknowledged',
  'assigned',
  'investigation',
  'assessment',
  'negotiation',
  'settlement',
  'payment',
  'closed',
];

export function ClaimDetail({
  claim,
  policy,
  onEdit,
  onStatusUpdate,
}: ClaimDetailProps) {
  const currentStepIndex = CLAIM_STATUS_STEPS.indexOf(claim.status ?? '');
  const isClosed = claim.status === 'closed' || claim.status === 'rejected';
  const isLitigation = claim.status === 'litigation';
  const isRecovery = claim.status === 'recovery';

  return (
    <div>
      <div>
        <h2>{claim.claimNumber}</h2>
        <span>{claim.status}</span>
        <button onClick={onEdit}>{t`Edit`}</button>
      </div>

      {/* Workflow Progress */}
      {!isClosed && !isLitigation && !isRecovery && (
        <div>
          <h3>{t`Claim Progress`}</h3>
          <div>
            {CLAIM_STATUS_STEPS.map((step, index) => (
              <div
                key={step}
                style={{
                  fontWeight: index <= currentStepIndex ? 'bold' : 'normal',
                  opacity: index <= currentStepIndex ? 1 : 0.5,
                }}
              >
                <span>{step}</span>
                {index <= currentStepIndex && <span>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Status Actions */}
      {!isClosed && (
        <div>
          <h3>{t`Quick Actions`}</h3>
          {claim.status === 'reported' && (
            <button onClick={() => onStatusUpdate('acknowledged')}>
              {t`Acknowledge`}
            </button>
          )}
          {claim.status === 'acknowledged' && (
            <button onClick={() => onStatusUpdate('assigned')}>
              {t`Assign`}
            </button>
          )}
          {claim.status === 'assigned' && (
            <button onClick={() => onStatusUpdate('investigation')}>
              {t`Start Investigation`}
            </button>
          )}
          {claim.status === 'investigation' && (
            <button onClick={() => onStatusUpdate('assessment')}>
              {t`Complete Assessment`}
            </button>
          )}
          {claim.status === 'assessment' && (
            <button onClick={() => onStatusUpdate('negotiation')}>
              {t`Start Negotiation`}
            </button>
          )}
          {claim.status === 'negotiation' && (
            <>
              <button onClick={() => onStatusUpdate('settlement')}>
                {t`Settle`}
              </button>
              <button onClick={() => onStatusUpdate('litigation')}>
                {t`Escalate to Litigation`}
              </button>
            </>
          )}
          {claim.status === 'settlement' && (
            <button onClick={() => onStatusUpdate('payment')}>
              {t`Process Payment`}
            </button>
          )}
          {claim.status === 'payment' && (
            <button onClick={() => onStatusUpdate('closed')}>
              {t`Close Claim`}
            </button>
          )}
          {isLitigation && (
            <>
              <button onClick={() => onStatusUpdate('negotiation')}>
                {t`Return to Negotiation`}
              </button>
              <button onClick={() => onStatusUpdate('recovery')}>
                {t`Start Recovery`}
              </button>
            </>
          )}
          {isRecovery && (
            <button onClick={() => onStatusUpdate('closed')}>
              {t`Close Claim`}
            </button>
          )}
        </div>
      )}

      {/* Claim Summary */}
      <div>
        <h3>{t`Claim Summary`}</h3>
        <div>
          <span>{t`Claim Type`}</span>
          <span>{claim.claimType ?? t`N/A`}</span>
        </div>
        <div>
          <span>{t`Date of Loss`}</span>
          <span>{formatDate(claim.dateOfLoss)}</span>
        </div>
        <div>
          <span>{t`Date Reported`}</span>
          <span>{formatDate(claim.dateReported)}</span>
        </div>
        <div>
          <span>{t`Claim Amount`}</span>
          <span>{formatCurrency(claim.amount?.amountMicros ?? null, claim.amount?.currencyCode)}</span>
        </div>
        <div>
          <span>{t`Reserve Amount`}</span>
          <span>{formatCurrency(claim.reserveAmount?.amountMicros ?? null, claim.reserveAmount?.currencyCode)}</span>
        </div>
        <div>
          <span>{t`Paid Amount`}</span>
          <span>{formatCurrency(claim.paidAmount?.amountMicros ?? null, claim.paidAmount?.currencyCode)}</span>
        </div>
        <div>
          <span>{t`Recovered Amount`}</span>
          <span>{formatCurrency(claim.recoveredAmount?.amountMicros ?? null, claim.recoveredAmount?.currencyCode)}</span>
        </div>
        <div>
          <span>{t`Deductible Applied`}</span>
          <span>{formatCurrency(claim.deductibleApplied?.amountMicros ?? null, claim.deductibleApplied?.currencyCode)}</span>
        </div>
      </div>

      {/* Policy Information */}
      {policy && (
        <div>
          <h3>{t`Policy Information`}</h3>
          <div>
            <span>{t`Policy Number`}</span>
            <span>{policy.policyNumber}</span>
          </div>
          <div>
            <span>{t`Policy Type`}</span>
            <span>{policy.policyType ?? t`N/A`}</span>
          </div>
          <div>
            <span>{t`Insurer`}</span>
            <span>{policy.insurer ?? t`N/A`}</span>
          </div>
          <div>
            <span>{t`Sum Insured`}</span>
            <span>{formatCurrency(policy.sumInsured?.amountMicros ?? null, policy.sumInsured?.currencyCode)}</span>
          </div>
        </div>
      )}

      {/* Adjuster Information */}
      <div>
        <h3>{t`Adjuster Information`}</h3>
        <div>
          <span>{t`Adjuster`}</span>
          <span>{claim.adjuster ?? t`N/A`}</span>
        </div>
        <div>
          <span>{t`Adjuster Company`}</span>
          <span>{claim.adjusterCompany ?? t`N/A`}</span>
        </div>
      </div>

      {/* Litigation */}
      {isLitigation && (
        <div>
          <h3>{t`Litigation`}</h3>
          <div>
            <span>{t`Law Firm`}</span>
            <span>{claim.lawFirm ?? t`N/A`}</span>
          </div>
          <div>
            <span>{t`Court Case`}</span>
            <span>{claim.courtCase ?? t`N/A`}</span>
          </div>
        </div>
      )}

      {/* Settlement */}
      <div>
        <h3>{t`Settlement & Resolution`}</h3>
        <div>
          <span>{t`Settlement Date`}</span>
          <span>{formatDate(claim.settlementDate)}</span>
        </div>
        <div>
          <span>{t`Root Cause`}</span>
          <span>{claim.rootCause ?? t`N/A`}</span>
        </div>
        <div>
          <span>{t`Prevention Measures`}</span>
          <span>{claim.preventionMeasures ?? t`N/A`}</span>
        </div>
      </div>

      {/* Reinsurance */}
      <div>
        <h3>{t`Reinsurance`}</h3>
        <div>
          <span>{t`Reinsurance Claim`}</span>
          <span>{claim.isReinsurance ? t`Yes` : t`No`}</span>
        </div>
        {claim.isReinsurance && (
          <div>
            <span>{t`Reinsurer Share`}</span>
            <span>{claim.reinsurerShare != null ? `${claim.reinsurerShare}%` : t`N/A`}</span>
          </div>
        )}
      </div>
    </div>
  );
}
