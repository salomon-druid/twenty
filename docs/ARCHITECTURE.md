# Twenty CRM Insurance Fork — Architecture Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Twenty CRM Architecture](#twenty-crm-architecture)
3. [Insurance Module Architecture](#insurance-module-architecture)
4. [Data Model](#data-model)
5. [Object Relationships](#object-relationships)
6. [Backend Services](#backend-services)
7. [Frontend Components](#frontend-components)
8. [Internationalization](#internationalization)
9. [Build & Deployment](#build--deployment)
10. [Development Workflow](#development-workflow)
11. [Known Limitations](#known-limitations)
12. [Phase A Improvements](#phase-a-improvements)
13. [Phase B Improvements](#phase-b-improvements)
14. [Phase C Roadmap](#phase-c-roadmap)

---

## System Overview

This is a specialized fork of [Twenty CRM](https://github.com/twentyhq/twenty) for **insurance brokers in Germany**, with a focus on **commercial and industrial insurance**.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Jotai (state), Linaria (CSS-in-JS), Vite, Lingui (i18n) |
| Backend | NestJS, TypeORM, PostgreSQL, Redis, GraphQL (Yoga), BullMQ |
| Monorepo | Nx workspace, Yarn 4 (node-modules linker) |
| Database | PostgreSQL 16 |
| Cache/Queue | Redis 7 |
| Containerization | Docker Compose |

### Repository Structure

```
twenty-crm/
├── packages/
│   ├── twenty-server/          # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/        # Business logic modules
│   │   │   │   └── insurance/  # ← Our insurance module
│   │   │   ├── engine/         # Core engine (metadata, ORM, etc.)
│   │   │   │   └── workspace-manager/dev-seeder/  # ← Dev seeder
│   │   │   └── app.module.ts   # Root module
│   │   └── .env                # Server environment
│   ├── twenty-front/           # React frontend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   └── insurance/  # ← Our frontend components
│   │   │   └── locales/        # ← i18n translations
│   │   └── .env                # Frontend environment
│   ├── twenty-shared/          # Shared types & utilities
│   ├── twenty-ui/              # Shared UI components
│   └── twenty-docker/          # Docker configs
├── docker-compose.insurance.yml # Production compose for insurance fork
├── .env.insurance.example       # Environment template
└── README.insurance.md          # Project README
```

---

## Twenty CRM Architecture

### Metadata-Driven Design

Twenty uses a **metadata-driven architecture**. Instead of creating traditional database tables and CRUD endpoints for each entity, objects are defined as metadata entries in the database. The system then auto-generates:

- Database tables (via TypeORM migrations)
- GraphQL schema (queries, mutations, subscriptions)
- Frontend types and basic CRUD UI
- Search indexes

### Key Concepts

1. **ObjectMetadata** — Defines an object (name, label, icon, etc.)
2. **FieldMetadata** — Defines fields on an object (type, label, options, etc.)
3. **WorkspaceEntity** — TypeScript class extending `BaseWorkspaceEntity` that defines the shape of the object in code
4. **DevSeeder** — Seeds custom objects and fields into workspaces at initialization time
5. **TwentyORM** — Generic ORM service that works with any workspace entity

### Module Pattern

Each feature area is a NestJS module:
```
src/modules/<feature>/
├── <feature>.module.ts                    # Module definition
├── standard-objects/                      # Entity definitions
│   └── <entity>.workspace-entity.ts       # TypeScript entity class
├── services/                              # Business logic
│   └── <entity>.service.ts
├── cron/                                  # Scheduled jobs
│   └── <job>.cron.ts
└── controllers/                           # REST/GraphQL controllers
```

### Important: No Per-Object Services/Resolvers Needed

Twenty's metadata-driven approach means you **don't** create individual GraphQL resolvers or REST controllers for each object. The system provides generic CRUD out of the box. You only create custom services for **business logic** that goes beyond basic CRUD.

---

## Insurance Module Architecture

### File Inventory

#### Backend (`packages/twenty-server/src/modules/insurance/`)

| File | Purpose |
|------|---------|
| `insurance.module.ts` | NestJS module — wires services and cron jobs |
| `standard-objects/broker.workspace-entity.ts` | Broker entity definition |
| `standard-objects/policy.workspace-entity.ts` | Policy entity definition |
| `standard-objects/claim.workspace-entity.ts` | Claim entity definition |
| `standard-objects/renewal.workspace-entity.ts` | Renewal entity definition |
| `standard-objects/risk-profile.workspace-entity.ts` | Risk Profile entity definition |
| `standard-objects/premium.workspace-entity.ts` | Premium entity definition |
| `standard-objects/provision.workspace-entity.ts` | Provision entity definition |
| `standard-objects/quote.workspace-entity.ts` | Quote entity definition |
| `standard-objects/insurance-task.workspace-entity.ts` | Insurance Task entity definition |
| `standard-objects/site.workspace-entity.ts` | Site entity definition |
| `services/renewal-generation.service.ts` | Auto-creates renewals for expiring policies |
| `services/renewal-status.service.ts` | **Deprecated.** Legacy renewal status transitions (delegates to enhanced service) |
| `services/enhanced-renewal-workflow.service.ts` | Enhanced 13-status renewal workflow with validation |
| `services/claims-workflow.service.ts` | 16-status claims workflow with litigation/recovery paths |
| `services/quote-workflow.service.ts` | 9-status quote-to-policy workflow |
| `services/insurance-notification.service.ts` | Email notifications (renewal, claim, premium, task) |
| `services/broker-dashboard.service.ts` | Broker dashboard metrics aggregation |
| `cron/renewal-scheduler.cron.ts` | Daily cron — renewal generation (Phase 1) |
| `cron/enhanced-renewal-scheduler.cron.ts` | Daily cron — renewal generation + email reminders at 90/30 days |

#### Dev Seeder (`packages/twenty-server/src/engine/workspace-manager/dev-seeder/metadata/`)

| File | Purpose |
|------|---------|
| `custom-objects/constants/broker-custom-object-seed.constant.ts` | Broker object metadata |
| `custom-objects/constants/policy-custom-object-seed.constant.ts` | Policy object metadata |
| `custom-objects/constants/claim-custom-object-seed.constant.ts` | Claim object metadata |
| `custom-objects/constants/renewal-custom-object-seed.constant.ts` | Renewal object metadata |
| `custom-objects/constants/risk-profile-custom-object-seed.constant.ts` | Risk Profile object metadata |
| `custom-objects/constants/premium-custom-object-seed.constant.ts` | Premium object metadata |
| `custom-objects/constants/provision-custom-object-seed.constant.ts` | Provision object metadata |
| `custom-objects/constants/quote-custom-object-seed.constant.ts` | Quote object metadata |
| `custom-objects/constants/insurance-task-custom-object-seed.constant.ts` | Insurance Task object metadata |
| `custom-objects/constants/site-custom-object-seed.constant.ts` | Site object metadata |
| `custom-fields/constants/broker-custom-field-seeds.constant.ts` | Broker field definitions |
| `custom-fields/constants/policy-custom-field-seeds.constant.ts` | Policy field definitions |
| `custom-fields/constants/claim-custom-field-seeds.constant.ts` | Claim field definitions |
| `custom-fields/constants/renewal-custom-field-seeds.constant.ts` | Renewal field definitions |
| `custom-fields/constants/risk-profile-custom-field-seeds.constant.ts` | Risk Profile field definitions |
| `custom-fields/constants/premium-custom-field-seeds.constant.ts` | Premium field definitions |
| `custom-fields/constants/provision-custom-field-seeds.constant.ts` | Provision field definitions |
| `custom-fields/constants/quote-custom-field-seeds.constant.ts` | Quote field definitions |
| `custom-fields/constants/insurance-task-custom-field-seeds.constant.ts` | Insurance Task field definitions |
| `custom-fields/constants/site-custom-field-seeds.constant.ts` | Site field definitions |
| `services/dev-seeder-metadata.service.ts` | Modified to register all 10 insurance objects |

#### Frontend (`packages/twenty-front/src/modules/insurance/`)

| File | Purpose |
|------|---------|
| `types/Broker.ts` | Broker TypeScript type |
| `types/Policy.ts` | Policy TypeScript type |
| `types/Claim.ts` | Claim TypeScript type |
| `types/Renewal.ts` | Renewal TypeScript type |
| `types/RiskProfile.ts` | Risk Profile TypeScript type |
| `types/Premium.ts` | Premium TypeScript type |
| `types/Provision.ts` | Provision TypeScript type |
| `types/Quote.ts` | Quote TypeScript type |
| `types/InsuranceTask.ts` | Insurance Task TypeScript type |
| `types/Site.ts` | Site TypeScript type |
| `components/RenewalWorkflowPanel.tsx` | Enhanced renewal workflow UI (13 statuses) |
| `components/ClaimsWorkflowPanel.tsx` | Claims workflow UI (16 statuses) |
| `components/ClaimsDashboard.tsx` | Claims statistics dashboard |
| `components/PremiumOverview.tsx` | Premium overview dashboard |
| `components/DocumentUpload.tsx` | Document upload widget |
| `components/BrokerDashboard.tsx` | Broker dashboard (portfolio, claims, revenue, tasks, clients) |

---

## Data Model

### Insurance Objects

#### 1. Policy (Police/Vertrag)
The core insurance contract.

| Field | Type | Options |
|-------|------|---------|
| policyNumber | TEXT | Unique identifier |
| type | SELECT | Commercial, Industrial, Liability, Property, Cyber, D&O |
| startDate | DATE | Policy start |
| endDate | DATE | Policy expiration |
| premium | CURRENCY | Annual premium amount |
| status | SELECT | Active, Expired, Cancelled, Pending |
| coverageDetails | TEXT | Coverage description |
| insurer | TEXT | Insurance company name |
| policyType | SELECT | commercial, industrial, mixed |
| sumInsured | CURRENCY | Maximum coverage amount |
| deductible | CURRENCY | Self-retention amount |
| coInsurance | NUMBER | Co-insurance percentage |
| underwriter | TEXT | Underwriter name at insurer |
| brokerageRate | NUMBER | Broker commission percentage |
| invoiceNumber | TEXT | Invoice reference |
| paymentTerms | SELECT | monthly, quarterly, semi_annual, annual, single_premium |
| industryCode | TEXT | NACE/NAICS industry classification |
| employeeCount | NUMBER | Number of insured employees |
| annualRevenue | CURRENCY | Client's annual revenue |
| company | RELATION | Many-to-one → Company |
| pointOfContact | RELATION | Many-to-one → Person |
| broker | RELATION | Many-to-one → Broker |

#### 2. Claim (Schaden)
Insurance claims filed by clients.

| Field | Type | Options |
|-------|------|---------|
| claimNumber | TEXT | Unique identifier |
| date | DATE | Claim filing date |
| amount | CURRENCY | Claim amount |
| status | SELECT | reported, acknowledged, assigned, investigation, assessment, negotiation, settlement, payment, litigation, court, judgment, recovery, subrogation, recovered, closed |
| description | TEXT | Claim description |
| resolution | TEXT | Resolution notes |
| claimType | SELECT | property_damage, liability, business_interruption, machinery_breakdown, cyber_incident, environmental, product_liability |
| dateOfLoss | DATE | When the incident occurred |
| dateReported | DATE | When the claim was reported |
| reserveAmount | CURRENCY | Estimated claim cost |
| paidAmount | CURRENCY | Amount paid out |
| recoveredAmount | CURRENCY | Amount recovered (subrogation) |
| deductibleApplied | CURRENCY | Deductible amount applied |
| adjuster | TEXT | Claims adjuster name |
| adjusterCompany | TEXT | Adjusting company |
| lawFirm | TEXT | Legal representation |
| courtCase | BOOLEAN | Whether litigation is involved |
| settlementDate | DATE | Date of settlement |
| rootCause | TEXT | Root cause analysis |
| preventionMeasures | TEXT | Recommended prevention measures |
| isReinsurance | BOOLEAN | Whether reinsurance applies |
| reinsurerShare | NUMBER | Reinsurer's percentage share |
| policy | RELATION | Many-to-one → Policy |
| company | RELATION | Many-to-one → Company |
| person | RELATION | Many-to-one → Person |
| broker | RELATION | Many-to-one → Broker |

#### 3. Renewal (Verlängerung)
Policy renewal tracking.

| Field | Type | Options |
|-------|------|---------|
| renewalDate | DATE | Expected renewal date |
| newPremium | CURRENCY | New premium amount |
| status | SELECT | draft, market_research, quote_requested, quotes_received, negotiation, client_review, bound, issued, active, renewal_due, renewal_negotiation, renewed, expired |
| notes | TEXT | Renewal notes |
| policy | RELATION | Many-to-one → Policy |
| broker | RELATION | Many-to-one → Broker |

#### 4. Risk Profile (Risikoprofil)
Client risk assessment.

| Field | Type | Options |
|-------|------|---------|
| riskCategory | SELECT | Low, Medium, High, Critical |
| assessmentDate | DATE | Assessment date |
| score | NUMBER | Numeric risk score |
| notes | TEXT | Assessment notes |
| company | RELATION | Many-to-one → Company |
| person | RELATION | Many-to-one → Person |
| broker | RELATION | Many-to-one → Broker |

#### 5. Premium (Prämie)
Premium payment tracking.

| Field | Type | Options |
|-------|------|---------|
| amount | CURRENCY | Premium amount |
| period | SELECT | Monthly, Quarterly, Semi-Annual, Annual |
| paymentStatus | SELECT | Paid, Unpaid, Overdue, Partial |
| dueDate | DATE | Payment due date |
| paidDate | DATE | Actual payment date |
| policy | RELATION | Many-to-one → Policy |
| broker | RELATION | Many-to-one → Broker |

#### 6. Provision (Provision/Bonus-Malus)
Broker commission tracking.

| Field | Type | Options |
|-------|------|---------|
| commissionRate | NUMBER | Commission percentage |
| bonusMalusTier | SELECT | Bonus 5-1, Neutral, Malus 1-3 |
| amount | CURRENCY | Commission amount |
| status | SELECT | Pending, Paid, Overdue |
| period | SELECT | Monthly, Quarterly, Annual |
| policy | RELATION | Many-to-one → Policy |
| broker | RELATION | Many-to-one → Broker |

#### 7. Broker (Makler)
Insurance broker entity.

| Field | Type | Options |
|-------|------|---------|
| name | TEXT | Broker name |
| email | TEXT | Contact email |
| phone | TEXT | Phone number |
| address | TEXT | Business address |
| licenseNumber | TEXT | License number |
| website | TEXT | Website URL |

#### 8. Quote (Angebot)
Commercial/industrial insurance quotes/proposals.

| Field | Type | Options |
|-------|------|---------|
| quoteNumber | TEXT | Unique quote identifier |
| status | SELECT | draft, sent, negotiating, bound, declined, expired |
| validUntil | DATE | Quote validity date |
| proposedPremium | CURRENCY | Proposed premium |
| negotiationNotes | TEXT | Notes from negotiations |
| boundDate | DATE | Date quote was bound |
| policy | RELATION | Many-to-one → Policy (if bound) |
| company | RELATION | Many-to-one → Company |
| person | RELATION | Many-to-one → Person |
| broker | RELATION | Many-to-one → Broker |

#### 9. Insurance Task (Aufgabe)
Broker workflow management.

| Field | Type | Options |
|-------|------|---------|
| title | TEXT | Task title |
| description | TEXT | Task description |
| dueDate | DATE | Due date |
| priority | SELECT | low, medium, high, urgent |
| status | SELECT | open, in_progress, completed, cancelled |
| type | SELECT | renewal_followup, claim_followup, client_meeting, document_request, inspection, payment_reminder, other |
| assignedTo | RELATION | Many-to-one → Workspace Member |
| relatedPolicy | RELATION | Many-to-one → Policy |
| relatedClaim | RELATION | Many-to-one → Claim |
| relatedCompany | RELATION | Many-to-one → Company |
| relatedPerson | RELATION | Many-to-one → Person |
| broker | RELATION | Many-to-one → Broker |

#### 10. Site (Standort)
Insured locations for industrial insurance.

| Field | Type | Options |
|-------|------|---------|
| name | TEXT | Site name |
| address | TEXT | Full address |
| type | SELECT | headquarters, branch, factory, warehouse, retail, construction_site |
| riskZone | SELECT | Low Risk, Medium Risk, High Risk, Critical Risk |
| constructionYear | NUMBER | Year built |
| areaSqm | NUMBER | Area in square meters |
| lastInspection | DATE | Last risk inspection date |
| company | RELATION | Many-to-one → Company |
| broker | RELATION | Many-to-one → Broker |

---

## Object Relationships

```
Company (1) ──── (N) Policy
Person (1) ──── (N) Policy (as pointOfContact)
Policy (1) ──── (N) Claim
Policy (1) ──── (N) Renewal
Policy (1) ──── (N) Premium
Policy (1) ──── (N) Provision
Company (1) ──── (N) Claim
Person (1) ──── (N) Claim
Company (1) ──── (N) RiskProfile
Person (1) ──── (N) RiskProfile
Broker (1) ──── (N) Policy
Broker (1) ──── (N) Claim
Broker (1) ──── (N) Renewal
Broker (1) ──── (N) RiskProfile
Broker (1) ──── (N) Premium
Broker (1) ──── (N) Provision
Company (1) ──── (N) Quote
Person (1) ──── (N) Quote
Broker (1) ──── (N) Quote
Company (1) ──── (N) InsuranceTask
Person (1) ──── (N) InsuranceTask
Broker (1) ──── (N) InsuranceTask
Company (1) ──── (N) Site
Broker (1) ──── (N) Site
```

All insurance objects relate to:
- **Company** (the insured business)
- **Person** (the contact person)
- **Broker** (the responsible broker)

---

## Backend Services

### RenewalGenerationService

**Purpose:** Automatically creates renewal records for policies expiring within 30 days.

**Logic:**
1. Query all active policies with `endDate` within the next 30 days
2. For each policy, check if a renewal record already exists
3. If not, create a new renewal with:
   - `renewalDate` = policy's `endDate`
   - `newPremium` = policy's current `premium`
   - `status` = 'draft' (enhanced workflow initial status)
   - `policyId` = policy's ID
   - `brokerId` = policy's broker

**Key method:** `generateUpcomingRenewals(workspaceId: string): Promise<number>`

### RenewalStatusService (Deprecated)

**Purpose:** Legacy renewal status transitions. **Use `EnhancedRenewalWorkflowService` instead.**

**Status mapping (legacy → enhanced):**
- `pending` → `draft`
- `contacted` → `market_research`
- `negotiated` → `negotiation`
- `renewed` → `renewed`
- `expired` → `expired`

**Key method:** `updateRenewalStatus(workspaceId, renewalId, newStatus): Promise<boolean>`

### EnhancedRenewalWorkflowService

**Purpose:** Manages the enhanced 13-status renewal workflow for commercial/industrial insurance.

**Workflow:**
```
draft → market_research → quote_requested → quotes_received →
negotiation → client_review → bound → issued → active
                                                    ↓
                                              renewal_due → renewal_negotiation → renewed/expired
```

**Key methods:**
- `updateRenewalStatus(workspaceId, renewalId, newStatus): Promise<boolean>`
- `getValidTransitions(currentStatus): string[]`
- `isTerminalStatus(status): boolean`
- `getAllStatuses(): string[]`
- `mapLegacyStatus(status): string` (static, for backward compat)

### ClaimsWorkflowService

**Purpose:** Manages the 16-status claims workflow with litigation and recovery paths.

**Workflow:**
```
reported → acknowledged → assigned → investigation →
assessment → negotiation → settlement → payment → closed
                                    ↓
                              litigation → court → judgment → payment → closed
                                    ↓
                              recovery → subrogation → recovered → closed
```

**Key methods:**
- `updateClaimStatus(workspaceId, claimId, newStatus): Promise<boolean>`
- `getValidTransitions(currentStatus): string[]`
- `isTerminalStatus(status): boolean`
- `getAllStatuses(): string[]`

### QuoteWorkflowService

**Purpose:** Manages the 9-status quote-to-policy workflow.

**Workflow:**
```
draft → internal_review → sent_to_client →
client_review → negotiation → bound →
policy_issued → active
```

**Key methods:**
- `updateQuoteStatus(workspaceId, quoteId, newStatus): Promise<boolean>`
- `getValidTransitions(currentStatus): string[]`
- `isTerminalStatus(status): boolean`
- `getAllStatuses(): string[]`

### InsuranceNotificationService

**Purpose:** Sends email notifications for insurance events using Twenty's `EmailService` (queued via BullMQ).

**Email types:**
- **Renewal reminders** — Sent at 90 and 30 days before policy expiry
- **Claim updates** — Sent when claim status changes
- **Premium due reminders** — Sent when premium payment is due/overdue
- **Task reminders** — Sent when tasks are due

**Configuration:**
- Uses `TwentyConfigService` for `EMAIL_FROM_NAME` and `EMAIL_FROM_ADDRESS`
- All emails are in German
- Uses `SendMailOptions` from nodemailer (via Twenty's `EmailService`)

### BrokerDashboardService

**Purpose:** Aggregates key metrics for the broker dashboard.

**Metrics computed:**
- **Portfolio:** Total/active policies, expiring in 30/60/90 days, premium volume
- **Claims:** Total/open claims, total/open claim amounts
- **Revenue:** Total/pending commission
- **Tasks:** Open/overdue task counts
- **Clients:** Unique company count

**Key method:** `getDashboardMetrics(workspaceId, brokerId?): Promise<BrokerDashboardMetrics>`

### RenewalScheduler (Phase 1)

**Purpose:** Daily cron job that triggers renewal generation for all active workspaces.

**Schedule:** Every day at midnight (`CronExpression.EVERY_DAY_AT_MIDNIGHT`)

### EnhancedRenewalScheduler

**Purpose:** Daily cron job that triggers renewal generation AND sends email reminders.

**Schedule:** Every day at midnight (`CronExpression.EVERY_DAY_AT_MIDNIGHT`)

**Logic:**
1. For each active workspace, generate upcoming renewals
2. For policies expiring in ≤90 days, send email reminders at exactly 90 and 30 days
3. Batch-loads brokers and companies to avoid N+1 queries
4. Uses `Math.round()` for day calculation to handle DST/timezone edge cases

---

## Frontend Components

### RenewalWorkflowPanel

Displays renewal status and provides action buttons for the enhanced 13-status workflow.

**Props:**
- `renewal: Renewal` — The renewal record
- `onStatusChange: (newStatus: string) => Promise<void>` — Callback for status changes

**Features:**
- Shows current status with color coding
- Shows renewal date
- Renders action buttons for valid transitions only
- Loading state during updates

### ClaimsWorkflowPanel

Displays claim status and provides action buttons for the 16-status claims workflow.

**Props:**
- `claim: Claim` — The claim record
- `onStatusChange: (newStatus: string) => Promise<void>` — Callback for status changes

**Features:**
- Shows current status with color coding
- Shows claim number, amount, type
- Renders action buttons for valid transitions only
- Loading state during updates

### BrokerDashboard

Displays key metrics for brokers across 5 sections.

**Props:**
- `metrics: BrokerDashboardMetrics` — Aggregated metrics from `BrokerDashboardService`

**Sections:**
1. **Portfolio Overview** — Total/active policies, expiring in 30/60/90 days, premium volume
2. **Claims Overview** — Total/open claims, financial amounts
3. **Revenue Overview** — Total/pending commission
4. **Task Overview** — Open/overdue tasks
5. **Client Overview** — Total unique clients

### ClaimsDashboard

Displays claims statistics and recent claims list.

**Props:**
- `stats: ClaimsStats` — Aggregated statistics
- `claims: Claim[]` — Recent claims list

**Stats shown:**
- Total / Open / Pending / Closed claim counts
- Total amount and open amount

### PremiumOverview

Displays premium statistics and recent premiums.

**Props:**
- `stats: PremiumStats` — Aggregated statistics
- `premiums: Premium[]` — Recent premiums list

**Stats shown:**
- Total / Paid / Unpaid / Overdue premium counts
- Payment rate percentage
- Financial summary (total, paid, outstanding, overdue)

### DocumentUpload

File upload widget for attaching documents to insurance records.

**Props:**
- `recordId: string` — The record to attach to
- `recordType: string` — The object type
- `onUploadComplete?: (documentId: string) => void` — Callback

**Features:**
- File input with drag-and-drop
- Upload progress indicator
- Error handling
- Supported formats: PDF, DOC, DOCX, JPG, PNG

---

## Internationalization

### Setup
- **Library:** Lingui v5
- **Default language:** German (de)
- **Config:** `packages/twenty-front/lingui.config.ts`
- **Translation files:** `packages/twenty-front/src/locales/*.po`

### German Translations
The `de-DE.po` file contains translations for:
- All insurance object labels (singular and plural) — 10 objects
- All field labels for each insurance object
- All workflow status values (renewal: 13, claims: 16, quote: 9)
- Broker dashboard UI strings
- Common insurance terms

### Adding New Translations
1. Add `msgid`/`msgstr` pairs to `de-DE.po`
2. Run `cd packages/twenty-front && npx lingui compile`
3. Use `t``message``` or `msg``message``` in components

---

## Build & Deployment

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_URL` | Backend URL | http://localhost:3000 |
| `PG_DATABASE_URL` | PostgreSQL connection | postgres://postgres:***@db:5432/default |
| `REDIS_URL` | Redis connection | redis://redis:6379 |
| `APP_SECRET` | Application secret | change-me-in-production |
| `FRONTEND_URL` | Frontend URL | http://localhost:3000 |
| `SIGN_IN_PREFILLED` | Pre-fill login form | true |
| `MESSAGE_QUEUE_TYPE` | Queue driver | pg-boss |
| `EMAIL_FROM_ADDRESS` | Sender email address | (required for notifications) |
| `EMAIL_FROM_NAME` | Sender display name | (defaults to "Twenty") |

### Build Commands

```bash
# Backend (from repo root)
npx nx build twenty-server
# Output: packages/twenty-server/dist/
# ~5884 files, ~10s with cache

# Frontend (requires 8GB+ RAM)
NODE_OPTIONS="--max-old-space-size=8192" npx nx build twenty-front
# Output: packages/twenty-front/dist/

# Frontend typecheck (lighter, no OOM risk)
npx nx typecheck twenty-front

# Full typecheck
npx nx typecheck twenty-server
npx nx typecheck twenty-front
```

### Docker Deployment

```bash
# Start all services
docker compose -f docker-compose.insurance.yml up -d

# Initialize database
docker compose -f docker-compose.insurance.yml exec server yarn database:init:prod

# View logs
docker compose -f docker-compose.insurance.yml logs -f server

# Stop all
docker compose -f docker-compose.insurance.yml down
```

### Docker Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| server | built from source | 3000 | Backend API |
| worker | built from source | — | Background jobs |
| db | postgres:16 | 5432 | Database |
| redis | redis:7 | 6379 | Cache/Queue |

---

## Development Workflow

### Adding a New Insurance Object

1. **Create workspace entity:**
   `packages/twenty-server/src/modules/insurance/standard-objects/<object>.workspace-entity.ts`

2. **Create object seed:**
   `packages/twenty-server/src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/<object>-custom-object-seed.constant.ts`

3. **Create field seeds:**
   `packages/twenty-server/src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/<object>-custom-field-seeds.constant.ts`

4. **Register in dev seeder:**
   Modify `dev-seeder-metadata.service.ts` to import and add to the seed config

5. **Create frontend type:**
   `packages/twenty-front/src/modules/insurance/types/<Object>.ts`

6. **Add German translations:**
   Update `de-DE.po` with object and field labels

7. **Build and verify:**
   ```bash
   npx nx build twenty-server
   npx nx typecheck twenty-front
   ```

### Adding a New Field to an Existing Object

1. Add field to workspace entity (`.workspace-entity.ts`)
2. Add field seed to field seeds constant
3. Add German translation to `de-DE.po`
4. Rebuild and verify

### Adding a New Service

1. Create service in `packages/twenty-server/src/modules/insurance/services/`
2. Register in `insurance.module.ts` providers
3. Build and verify

### Code Style

- **Named exports only** (no default exports)
- **Types over interfaces** (except extending third-party)
- **String literals over enums** (except GraphQL enums)
- **No `any` type**
- **camelCase** for variables/functions
- **PascalCase** for types/classes
- **kebab-case** for files/directories
- **Short comments** (`//`), explain WHY not WHAT
- **Components under 300 lines**, services under 500 lines

---

## Known Limitations

### Current Limitations

1. **Frontend build OOMs on 8GB RAM** — Full `npx nx build twenty-front` requires >8GB RAM. Use `typecheck` instead for verification.

2. **Frontend components use basic HTML** — Components are functional but not yet integrated with Twenty's UI component library (twenty-ui).

3. **Document upload uses basic fetch** — Not yet integrated with Twenty's attachment system.

4. **No automated tests** — No unit, integration, or E2E tests for insurance features.

5. **No CI/CD pipeline** — No automated build/test/deploy pipeline.

6. **No dashboard routing** — Frontend components exist but aren't routed/accessible from the main navigation.

7. **No multi-tenant enforcement** — The `brokerId` field exists but there's no row-level security enforcement yet.

8. **Email requires configuration** — `EMAIL_FROM_ADDRESS` must be set in environment for notifications to work.

### Technical Debt

- Frontend components need styling (Linaria) — Phase C item
- Need to integrate with Twenty's generic record page system — Phase C item
- Need to add proper error handling and loading states
- Need to add confirmation dialogs for destructive actions
- Need to add proper accessibility (a11y) attributes
- Need to add unit tests for services, integration tests for APIs

---

## Phase A Improvements (Commercial/Industrial Insurance)

### Changes Made

#### 1. Renewal Status Alignment
- **Before:** Dev seeder had `Pending, Accepted, Declined, Expired` but workflow service used `pending, contacted, negotiated, renewed, expired`
- **After:** Dev seeder updated to match workflow: `Pending, Contacted, Negotiated, Renewed, Expired`

#### 2. Policy — Commercial/Industrial Fields Added
New fields: `policyType`, `sumInsured`, `deductible`, `coInsurance`, `underwriter`, `brokerageRate`, `invoiceNumber`, `paymentTerms`, `industryCode`, `employeeCount`, `annualRevenue`

#### 3. Claim — Commercial/Industrial Fields Added
New fields: `claimType`, `dateOfLoss`, `dateReported`, `reserveAmount`, `paidAmount`, `recoveredAmount`, `deductibleApplied`, `adjuster`, `adjusterCompany`, `lawFirm`, `courtCase`, `settlementDate`, `rootCause`, `preventionMeasures`, `isReinsurance`, `reinsurerShare`

#### 4. New Object: Quote (Angebot)
- Fields: `quoteNumber`, `status` (Draft/Sent/Negotiating/Bound/Declined/Expired), `validUntil`, `proposedPremium`, `negotiationNotes`, `boundDate`
- Relations: `policy`, `company`, `person`, `broker`
- Junction: Company → Quotes, Person → Quotes

#### 5. New Object: Insurance Task
- Fields: `title`, `description`, `dueDate`, `priority` (Low/Medium/High/Urgent), `status` (Open/In Progress/Completed/Cancelled), `type` (Renewal Follow-up/Claim Follow-up/Client Meeting/Document Request/Inspection/Payment Reminder/Other)
- Relations: `assignedTo` (workspace member), `policy`, `claim`, `company`, `person`, `broker`
- Junction: Company → Tasks, Person → Tasks

#### 6. New Object: Site (Location)
- Fields: `name`, `address`, `type` (Headquarters/Branch/Factory/Warehouse/Retail/Construction Site), `riskZone` (Low/Medium/High/Critical), `constructionYear`, `areaSqm`, `lastInspection`
- Relations: `company`, `policies`, `broker`
- Junction: Company → Sites

### Updated Object Count
- **Before:** 7 insurance objects (Policy, Claim, Renewal, RiskProfile, Premium, Provision, Broker)
- **After Phase A:** 10 insurance objects (+ Quote, InsuranceTask, Site)

---

## Phase B Improvements (Enhanced Workflows & Notifications)

### Changes Made

#### 1. Enhanced Renewal Workflow (13 statuses)
- New `EnhancedRenewalWorkflowService` with 13-status workflow
- Backward-compatible with legacy 5-status workflow via `mapLegacyStatus()`
- Old `RenewalStatusService` deprecated but kept for compatibility

#### 2. Claims Workflow (16 statuses)
- New `ClaimsWorkflowService` with 16-status workflow
- Supports litigation path (litigation → court → judgment)
- Supports recovery path (recovery → subrogation → recovered)

#### 3. Quote-to-Policy Workflow (9 statuses)
- New `QuoteWorkflowService` with 9-status workflow
- Covers full lifecycle from draft to active policy

#### 4. Email Notifications
- New `InsuranceNotificationService` with 4 email types
- Uses Twenty's `EmailService` (BullMQ-queued)
- Configurable sender via `EMAIL_FROM_NAME` / `EMAIL_FROM_ADDRESS`
- All templates in German

#### 5. Broker Dashboard
- New `BrokerDashboardService` aggregating 5 metric categories
- New `BrokerDashboard.tsx` frontend component

#### 6. Enhanced Renewal Scheduler
- New `EnhancedRenewalScheduler` cron (daily midnight)
- Generates renewals + sends email reminders at 90/30 days
- Batch-loads brokers/companies to avoid N+1 queries

#### 7. Frontend Workflow Panels
- Updated `RenewalWorkflowPanel` for 13-status workflow
- New `ClaimsWorkflowPanel` for 16-status workflow
- New `BrokerDashboard` component

#### 8. German Translations
- Added translations for all new workflow statuses (38 new status values)
- Added translations for broker dashboard UI strings

### Code Review Fixes Applied
- Added `TwentyConfigService` injection + `from` field to `InsuranceNotificationService`
- Deprecated `RenewalStatusService` with legacy→enhanced status mapping
- Fixed N+1 queries in `EnhancedRenewalScheduler` (batch-load pattern)
- Fixed date comparison (`Math.round` + `includes` instead of `===`)
- Replaced `Record<string, unknown>` WHERE clauses with typed `find()` calls
- Added `mapLegacyStatus()` for backward compatibility with existing DB data

---

## Phase C Roadmap

### Planned Items

1. **Reinsurance Object** — New insurance object for treaty/cession tracking
2. **Client Dashboard** — Per-company dashboard showing policies, claims, risk, renewals
3. **Standard Reports** — Portfolio summary, claims analysis, revenue report, renewal calendar
4. **Navigation Improvements** — Dedicated insurance menu, quick actions, routing
5. **List View Enhancements** — Customizable columns, saved filters, bulk actions, export
6. **Record Page Improvements** — Tabbed layout, timeline, related records, quick edit

### Updated Commit History
```
f4c635360b  fix(insurance): resolve Phase B code review issues
e072309a98  docs: update RESUME.md — Phase B complete, next is Phase C
0e72770390  feat(insurance): Phase B — enhanced workflows, email notifications, broker dashboard
444feff22b  docs: update ARCHITECTURE.md and RESUME.md with Phase A improvements
d4d576ad62  feat(insurance): Phase A5+A6 — create Task and Site objects
b5f0bfd463  feat(insurance): Phase A4 — create Quote/Angebot object
95ae8894f2  feat(insurance): Phase A3 — add commercial/industrial fields to Claim
64c4a86dec  feat(insurance): Phase A1+A2 — fix renewal status + Policy fields
9fd07581bf  docs: add comprehensive architecture documentation
c6d0c8261b  feat(insurance): add Phase 6 — Docker self-hosting deployment
30afefa94e  feat(insurance): add Phase 5 insurance features
c391d4c80b  feat(insurance): add Broker entity and brokerId
67b25f6742  feat(insurance): add insurance data model (Phases 2-4)
```
