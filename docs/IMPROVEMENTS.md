# Twenty CRM Insurance Fork — Improvement Plan

## For Commercial & Industrial Insurance Brokers

---

## 1. Data Model Improvements

### 1.1 Policy Enhancements

**Current gaps for commercial/industrial insurance:**

| New Field | Type | Purpose |
|-----------|------|---------|
| `policyType` | SELECT | `commercial`, `industrial`, `mixed` |
| `coverageType` | MULTI_SELECT | `liability`, `property`, `business_interruption`, `machinery`, `cyber`, `dno`, `fleet`, `environmental`, `product_liability`, `professional_indemnity` |
| `sumInsured` | CURRENCY | Maximum coverage amount |
| `deductible` | CURRENCY | Self-retention amount |
| `coInsurance` | NUMBER | Co-insurance percentage |
| `underwriter` | TEXT | Underwriter name at insurer |
| `brokerageRate` | NUMBER | Broker commission percentage |
| `policyDocument` | FILE | Policy document (PDF) |
| `invoiceNumber` | TEXT | Invoice reference |
| `paymentTerms` | SELECT | `monthly`, `quarterly`, `semi_annual`, `annual`, `single_premium` |
| `riskZone` | SELECT | Geographic risk classification |
| `employeeCount` | NUMBER | Number of insured employees |
| `annualRevenue` | CURRENCY | Client's annual revenue (for risk assessment) |
| `industryCode` | TEXT | NACE/NAICS industry classification |
| `siteAddresses` | TEXT | Multiple site addresses (JSON) |

### 1.2 Claim Enhancements

**Current gaps for commercial/industrial claims:**

| New Field | Type | Purpose |
|-----------|------|---------|
| `claimType` | SELECT | `property_damage`, `liability`, `business_interruption`, `machinery_breakdown`, `cyber_incident`, `environmental`, `product_liability` |
| `dateOfLoss` | DATE | When the incident occurred |
| `dateReported` | DATE | When the claim was reported |
| `reserveAmount` | CURRENCY | Estimated claim cost |
| `paidAmount` | CURRENCY | Amount paid out |
| `recoveredAmount` | CURRENCY | Amount recovered (subrogation) |
| `deductibleApplied` | CURRENCY | Deductible amount applied |
| `adjuster` | TEXT | Claims adjuster name |
| `adjusterCompany` | TEXT | Adjusting company |
| `lawFirm` | TEXT | Legal representation |
| `courtCase` | BOOLEAN | Whether litigation is involved |
| `settlementDate` | DATE | Date of settlement |
| `rootCause` | TEXT | Root cause analysis |
| `preventionMeasures` | TEXT | Recommended prevention measures |
| `isReinsurance` | BOOLEAN | Whether reinsurance applies |
| `reinsurerShare` | NUMBER | Reinsurer's percentage share |

### 1.3 New Object: Quote/Angebot

Commercial/industrial brokers need a quote/proposal system:

| Field | Type | Purpose |
|-------|------|---------|
| `quoteNumber` | TEXT | Unique quote identifier |
| `status` | SELECT | `draft`, `sent`, `negotiating`, `bound`, `declined`, `expired` |
| `validUntil` | DATE | Quote validity date |
| `proposedPremium` | CURRENCY | Proposed premium |
| `competitorQuotes` | TEXT | JSON array of competitor quotes |
| `negotiationNotes` | TEXT | Notes from negotiations |
| `boundDate` | DATE | Date quote was bound |
| `policy` | RELATION | Link to resulting policy (if bound) |
| `company` | RELATION | Client company |
| `person` | RELATION | Contact person |
| `broker` | RELATION | Responsible broker |

### 1.4 New Object: Site/Location

Industrial insurance often covers multiple sites:

| Field | Type | Purpose |
|-------|------|---------|
| `name` | TEXT | Site name |
| `address` | TEXT | Full address |
| `type` | SELECT | `headquarters`, `branch`, `factory`, `warehouse`, `retail`, `construction_site` |
| `riskZone` | SELECT | Risk classification |
| `constructionYear` | NUMBER | Year built |
| `areaSqm` | NUMBER | Area in square meters |
| `securitySystems` | MULTI_SELECT | `alarm`, `cctv`, `sprinkler`, `access_control`, `fire_detection` |
| `lastInspection` | DATE | Last risk inspection date |
| `inspectionReport` | FILE | Inspection report (PDF) |
| `company` | RELATION | Parent company |
| `policies` | RELATION | Policies covering this site |

### 1.5 New Object: Reinsurance

For large commercial/industrial risks:

| Field | Type | Purpose |
|-------|------|---------|
| `treatyNumber` | TEXT | Reinsurance treaty number |
| `type` | SELECT | `quota_share`, `surplus`, `excess_of_loss`, `stop_loss` |
| `reinsurer` | TEXT | Reinsurer name |
| `cededPercentage` | NUMBER | Percentage ceded to reinsurer |
| `cededAmount` | CURRENCY | Amount ceded |
| `commission` | NUMBER | Reinsurance commission |
| `validFrom` | DATE | Treaty start date |
| `validTo` | DATE | Treaty end date |
| `policy` | RELATION | Related policy |

### 1.6 New Object: Task/Reminder

For broker workflow management:

| Field | Type | Purpose |
|-------|------|---------|
| `title` | TEXT | Task title |
| `description` | TEXT | Task description |
| `dueDate` | DATE | Due date |
| `priority` | SELECT | `low`, `medium`, `high`, `urgent` |
| `status` | SELECT | `open`, `in_progress`, `completed`, `cancelled` |
| `type` | SELECT | `renewal_followup`, `claim_followup`, `client_meeting`, `document_request`, `inspection`, `payment_reminder`, `other` |
| `assignedTo` | RELATION | Workspace member |
| `relatedPolicy` | RELATION | Related policy |
| `relatedClaim` | RELATION | Related claim |
| `relatedCompany` | RELATION | Related company |
| `relatedPerson` | RELATION | Related person |

---

## 2. Workflow Improvements

### 2.1 Renewal Workflow (Enhanced)

**Current:** Basic status transitions (pending → contacted → negotiated → renewed/expired)

**Improved for commercial/industrial:**

```
draft → market_research → quote_requested → quotes_received →
negotiation → client_review → bound → issued → active
                                                    ↓
                                              renewal_due → renewal_negotiation → renewed/expired
```

**Key additions:**
- **Market research phase** — Check insurer capacity, market conditions
- **Quote request** — Send RFQ to multiple insurers
- **Quote comparison** — Side-by-side comparison of quotes
- **Client review** — Present options to client
- **Binding** — Formal binding process

### 2.2 Claims Workflow (New)

```
reported → acknowledged → assigned → investigation →
assessment → negotiation → settlement → payment → closed
                                    ↓
                              litigation → court → judgment → payment → closed
                                    ↓
                              recovery → subrogation → recovered → closed
```

### 2.3 Quote-to-Policy Workflow (New)

```
draft → internal_review → sent_to_client →
client_review → negotiation → bound →
policy_issued → active
```

---

## 3. Dashboard Improvements

### 3.1 Broker Dashboard

**Key metrics for commercial/industrial brokers:**

1. **Portfolio Overview**
   - Total policies by type (commercial vs industrial)
   - Total sum insured
   - Total premium volume
   - Policies expiring in 30/60/90 days

2. **Claims Overview**
   - Open claims count and amount
   - Claims by type (property, liability, etc.)
   - Average claim amount
   - Claims ratio (claims/premiums)
   - Largest open claims

3. **Revenue Overview**
   - Total commission earned
   - Commission by insurer
   - Commission by policy type
   - Outstanding provisions
   - Monthly/quarterly revenue trend

4. **Client Overview**
   - Top clients by premium
   - Top clients by claims ratio
   - Clients without recent contact
   - New clients this quarter

5. **Task Overview**
   - Overdue tasks
   - Upcoming renewals
   - Pending claim follow-ups
   - Scheduled client meetings

### 3.2 Client Dashboard (per company)

- All policies for the client
- Claims history
- Risk profile
- Premium payment status
- Upcoming renewals
- Contact history
- Documents

---

## 4. Email Notifications

### 4.1 Automated Emails

| Trigger | Recipient | Content |
|---------|-----------|---------|
| Policy expiring in 90 days | Broker | Renewal reminder |
| Policy expiring in 30 days | Broker + Client | Urgent renewal notice |
| Claim status changed | Client | Claim update |
| Premium due in 14 days | Client | Payment reminder |
| Premium overdue | Client + Broker | Overdue notice |
| New claim reported | Broker | Claim notification |
| Quote expiring in 7 days | Client | Quote validity reminder |
| Task due tomorrow | Assigned broker | Task reminder |

### 4.2 Email Templates

All templates should be:
- Bilingual (German/English)
- Professional format
- Include broker branding
- Include all relevant policy/claim details
- Include next steps / call to action

---

## 5. Document Management

### 5.1 Document Types

| Type | Description |
|------|-------------|
| Policy document | Insurance policy (PDF) |
| Certificate | Insurance certificate |
| Quote | Quote/proposal document |
| Claim form | Claim filing form |
| Claim report | Claims adjuster report |
| Inspection report | Risk inspection report |
| Correspondence | Email/letter archive |
| Invoice | Premium invoice |
| Reinsurance treaty | Reinsurance contract |
| Client contract | Brokerage agreement |

### 5.2 Document Features

- **Version control** — Track document versions
- **OCR** — Extract text from scanned documents
- **Full-text search** — Search within documents
- **Templates** — Document templates for common communications
- **E-signature** — Electronic signature support

---

## 6. Reporting

### 6.1 Standard Reports

| Report | Description |
|--------|-------------|
| Portfolio summary | All policies with key metrics |
| Claims analysis | Claims by type, status, client |
| Revenue report | Commission by period, insurer, client |
| Renewal calendar | Upcoming renewals by month |
| Client analysis | Client profitability, claims ratio |
| Insurer analysis | Business volume by insurer |
| Broker performance | Individual broker metrics |

### 6.2 Report Features

- Export to PDF/Excel
- Scheduled generation
- Custom date ranges
- Filtering and grouping
- Charts and visualizations

---

## 7. Integration Points

### 7.1 External Systems

| System | Integration |
|--------|-------------|
| Insurer portals | Policy/claim data exchange |
| Accounting | Invoice/payment sync |
| Calendar | Meeting/reminder sync |
| Email | Outlook/Gmail integration |
| Document storage | SharePoint/Google Drive |
| E-signature | DocuSign/Adobe Sign |
| Regulatory | BaFin reporting |

### 7.2 APIs

- **Insurer APIs** — Real-time policy/claim status
- **Credit check** — Company creditworthiness
| **Geocoding** — Address validation, risk zone lookup
| **Weather data** — Natural disaster risk assessment
| **Industry data** — NACE codes, company registers

---

## 8. UI/UX Improvements

### 8.1 Navigation

- **Insurance menu** — Dedicated top-level menu for insurance objects
- **Quick actions** — Create new policy, claim, quote from dashboard
- **Favorites** — Pin frequently accessed records
- **Recent items** — Recently viewed records

### 8.2 List Views

- **Customizable columns** — Show/hide/reorder columns
- **Saved filters** — Save frequently used filter combinations
- **Bulk actions** — Update multiple records at once
- **Export** — Export list to Excel/CSV

### 8.3 Record Pages

- **Tabbed layout** — Overview, related records, documents, timeline, notes
- **Timeline** — Chronological activity history
- **Related records** — Show all related objects
- **Quick edit** — Inline editing of key fields
- **Print view** — Print-friendly layout

---

## 9. Compliance & Regulatory

### 9.1 German Insurance Regulations

- **VVG** — Insurance Contract Act compliance
- **IDD** — Insurance Distribution Directive compliance
- **GDPR** — Data protection compliance
- **BaFin** — Regulatory reporting requirements
- **GoBD** — GoBD-compliant document storage

### 9.2 Audit Trail

- All changes logged with timestamp and user
- Document access logging
- Export audit log
- Retention policy enforcement

---

## 10. Implementation Priority

### Phase A — Critical (Week 1-2)
1. Fix renewal status options alignment
2. Add commercial/industrial-specific fields to Policy
3. Add claim-specific fields to Claim
4. Create Quote object
5. Create Task/Reminder object
6. Integrate frontend components with Twenty UI

### Phase B — Important (Week 3-4)
1. Create Site/Location object
2. Enhanced renewal workflow
3. Claims workflow
4. Email notifications
5. Broker dashboard
6. Document management improvements

### Phase C — Valuable (Week 5-6)
1. Reinsurance object
2. Client dashboard
3. Standard reports
4. Navigation improvements
5. List view enhancements
6. Record page improvements

### Phase D — Nice to Have (Week 7+)
1. External system integrations
2. E-signature
3. OCR
4. Advanced analytics
5. Mobile optimization
6. Compliance features

---

## 11. Technical Debt to Address

1. **Renewal status mismatch** — Align dev seeder options with workflow service
2. **Frontend styling** — Replace basic HTML with Twenty UI components
3. **Import paths** — Standardize on `@/` prefix for all frontend imports
4. **Error handling** — Add proper error boundaries and user feedback
5. **Loading states** — Add skeleton loaders and spinners
6. **Accessibility** — Add ARIA labels, keyboard navigation, screen reader support
7. **Tests** — Add unit tests for services, integration tests for APIs
8. **Type safety** — Remove any `any` types, add proper type guards
