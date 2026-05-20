# Twenty CRM — Insurance Broker Fork

A specialized fork of [Twenty CRM](https://github.com/twentyhq/twenty) for insurance brokers in Germany.

## Features

- **6 Custom Insurance Objects:** Policy, Claim, Renewal, Risk Profile, Premium, Provision
- **Broker Management:** Multi-tenant broker ownership with row-level permissions
- **German Localization:** Full German translations (Lingui), German as default language
- **Renewal Workflow:** Automated renewal generation, status transitions, daily scheduler
- **Claims Dashboard:** Overview of claims by status, financial summary
- **Premium Overview:** Premium tracking, payment status, financial aggregation
- **Document Upload:** Attach documents to any insurance record

## Quick Start (Docker)

1. Copy `.env.insurance.example` to `.env` and configure:
   ```bash
   cp .env.insurance.example .env
   ```

2. Start all services:
   ```bash
   docker compose -f docker-compose.insurance.yml up -d
   ```

3. Initialize the database:
   ```bash
   docker compose -f docker-compose.insurance.yml exec server yarn database:init:prod
   ```

4. Open http://localhost:3000

## Development

### Prerequisites
- Node.js v24+
- Yarn 4+
- Docker + Docker Compose
- PostgreSQL 16 + Redis 7

### Setup
```bash
# Install dependencies
yarn install

# Start database + Redis
docker compose -f packages/twenty-docker/docker-compose.dev.yml up -d

# Build shared packages
npx nx build twenty-shared

# Initialize database
npx nx run twenty-server:database:init:prod

# Start backend
npx nx start twenty-server

# Start frontend (separate terminal)
npx nx start twenty-front
```

### Build
```bash
# Backend
npx nx build twenty-server

# Frontend
NODE_OPTIONS="--max-old-space-size=8192" npx nx build twenty-front
```

## Architecture

- **Backend:** NestJS + TypeORM + GraphQL (metadata-driven)
- **Frontend:** React 18 + Jotai + Linaria + Vite
- **i18n:** Lingui (German default)
- **Database:** PostgreSQL 16
- **Cache/Queue:** Redis 7

## License

AGPL-3.0 (same as Twenty CRM)
