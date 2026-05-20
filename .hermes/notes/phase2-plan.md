# Phase 2 Execution Plan — Insurance Data Model

## Approach
Twenty uses a metadata-driven architecture. New objects are created by:
1. Creating ObjectMetadata entries (defines the object)
2. Creating FieldMetadata entries (defines fields on the object)
3. The system auto-generates DB tables, GraphQL types, and frontend types

## Pattern (from studying existing code)
1. **Object seed** — defines nameSingular, namePlural, labelSingular, labelPlural, icon
2. **Field seeds** — array of { type, label, name, options?, settings? }
3. **Workspace entity** — TypeScript class extending BaseWorkspaceEntity
4. **Register via DevSeederMetadataService** — add to workspace seed config

## Objects to Create

### 1. Policy (Police/Vertrag)
- nameSingular: 'policy', namePlural: 'policies'
- Fields: policyNumber(TEXT), type(SELECT), startDate(DATE), endDate(DATE), premium(CURRENCY), status(SELECT), coverageDetails(TEXT), insurer(TEXT)
- Relations: company(MANY_TO_ONE), person(MANY_TO_ONE)

### 2. Claim (Schaden)
- nameSingular: 'claim', namePlural: 'claims'
- Fields: claimNumber(TEXT), date(DATE), amount(CURRENCY), status(SELECT), description(TEXT), resolution(TEXT)
- Relations: policy(MANY_TO_ONE), company(MANY_TO_ONE), person(MANY_TO_ONE)

### 3. Renewal (Verlängerung)
- nameSingular: 'renewal', namePlural: 'renewals'
- Fields: renewalDate(DATE), newPremium(CURRENCY), status(SELECT), notes(TEXT)
- Relations: policy(MANY_TO_ONE)

### 4. Risk Profile (Risikoprofil)
- nameSingular: 'riskProfile', namePlural: 'riskProfiles'
- Fields: riskCategory(SELECT), assessmentDate(DATE), score(NUMBER), notes(TEXT)
- Relations: company(MANY_TO_ONE), person(MANY_TO_ONE)

### 5. Premium (Prämie)
- nameSingular: 'premium', namePlural: 'premiums'
- Fields: amount(CURRENCY), period(SELECT), paymentStatus(SELECT), dueDate(DATE), paidDate(DATE)
- Relations: policy(MANY_TO_ONE)

### 6. Provision (Provision/Bonus-Malus)
- nameSingular: 'provision', namePlural: 'provisions'
- Fields: commissionRate(NUMBER), bonusMalusTier(SELECT), amount(CURRENCY), status(SELECT), period(SELECT)
- Relations: policy(MANY_TO_ONE), workspaceMember(MANY_TO_ONE)

## Files to Create (per object)
1. `packages/twenty-server/src/modules/insurance/standard-objects/<object>.workspace-entity.ts`
2. `packages/twenty-server/src/engine/workspace-manager/dev-seeder/metadata/custom-objects/constants/<object>-custom-object-seed.constant.ts`
3. `packages/twenty-server/src/engine/workspace-manager/dev-seeder/metadata/custom-fields/constants/<object>-custom-field-seeds.constant.ts`

## Files to Modify
1. `packages/twenty-server/src/engine/workspace-manager/dev-seeder/metadata/services/dev-seeder-metadata.service.ts` — add insurance objects to seed config
2. `packages/twenty-front/src/modules/insurance/types/<Object>.ts` — frontend type definitions

## Execution Order
1. Create all 6 object seed files
2. Create all 6 field seed files
3. Create all 6 workspace entity files
4. Register in dev-seeder-metadata.service.ts
5. Create frontend type files
6. Build and test
