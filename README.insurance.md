# Twenty CRM — Insurance Broker Fork

A specialized fork of [Twenty CRM](https://github.com/twentyhq/twenty) for **commercial and industrial insurance brokers in Germany**.

## Features

- **10 Custom Insurance Objects:** Policy, Claim, Renewal, Risk Profile, Premium, Provision, Broker, Quote, InsuranceTask, Site
- **Commercial/Industrial Fields:** Policy (13 specialized fields), Claim (18 specialized fields)
- **Broker Management:** Multi-tenant broker ownership with row-level permissions
- **German Localization:** Full German translations (Lingui), German as default language
- **Renewal Workflow:** Automated renewal generation, status transitions, daily scheduler
- **Claims Dashboard:** Overview of claims by status, financial summary
- **Premium Overview:** Premium tracking, payment status, financial aggregation
- **Document Upload:** Attach documents to any insurance record

## Quick Start (Docker — Production)

1. Copy `.env.insurance.example` to `.env` and configure:
   ```bash
   cp .env.insurance.example .env
   ```

2. Start all services (server + worker + db + redis):
   ```bash
   docker compose -f docker-compose.insurance.yml up -d
   ```

3. Initialize the database (first time only):
   ```bash
   docker compose -f docker-compose.insurance.yml exec server yarn database:init:prod
   ```

4. Open http://localhost:3000

## Quick Start (Development)

### Prerequisites
- Node.js v24.15.0 (via nvm)
- Yarn 4.13.0 (via Corepack, `node-modules` linker)
- Docker + Docker Compose
- PostgreSQL 16 + Redis 7

### Setup
```bash
cd /home/nicolas/projects/twenty-crm

# Install dependencies (first time only)
corepack enable && yarn install

# Start database + Redis
docker compose -f packages/twenty-docker/docker-compose.dev.yml up -d

# Build shared packages (first time only)
npx nx build twenty-shared

# Initialize database (first time only)
npx nx run twenty-server:database:init:prod

# Start backend (terminal 1)
npx nx start twenty-server

# Start frontend (terminal 2)
npx nx start twenty-front
```

### Verify It's Running
```bash
# Backend health check
curl localhost:3000/healthz
# Expected: {"status":"ok"}

# Backend build (~10s with cache)
npx nx build twenty-server

# Frontend typecheck (safe, no OOM risk)
npx nx typecheck twenty-front
```

### Build
```bash
# Backend
npx nx build twenty-server

# Frontend (requires 8GB+ RAM)
NODE_OPTIONS="--max-old-space-size=8192" npx nx build twenty-front
```

## Important Constraints

| Constraint | Workaround |
|---|---|
| **8GB RAM limit** | Frontend full build OOMs. Use `npx nx typecheck twenty-front` for verification instead. |
| **Husky pre-commit hook** | Always use `git commit --no-verify` to avoid hanging: `git commit -m "msg" --no-verify` |
| **Yarn 4 node-modules linker** | `.yarnrc.yml` has `nodeLinker: node-modules`. Do NOT change to PnP. |
| **Docker group** | If docker permission denied, use: `sg docker -c "docker ..."` |
| **Frontend imports** | Use `@/` prefix (maps to `src/modules/`), not `src/` or relative paths. |

## Project Structure

```
twenty-crm/
├── packages/
│   ├── twenty-server/          # NestJS backend
│   │   └── src/
│   │       ├── modules/insurance/    # Insurance module (entities, services, cron)
│   │       └── engine/workspace-manager/dev-seeder/  # Dev seeder
│   ├── twenty-front/           # React frontend
│   │   └── src/
│   │       ├── modules/insurance/    # Insurance components & types
│   │       └── locales/              # i18n translations (de-DE.po)
│   ├── twenty-shared/          # Shared types & utilities
│   ├── twenty-ui/              # Shared UI components
│   └── twenty-docker/          # Docker configs
├── docker-compose.insurance.yml # Production Docker compose
├── .env.insurance.example       # Environment template
└── docs/                        # Project documentation
    ├── ARCHITECTURE.md
    ├── RESUME.md
    └── IMPROVEMENTS.md
```

## Architecture

- **Backend:** NestJS + TypeORM + GraphQL (metadata-driven)
- **Frontend:** React 18 + Jotai + Linaria + Vite
- **i18n:** Lingui (German default)
- **Database:** PostgreSQL 16
- **Cache/Queue:** Redis 7
- **Monorepo:** Nx workspace, Yarn 4

## Documentation

- `docs/ARCHITECTURE.md` — Full architecture documentation
- `docs/RESUME.md` — Session resume guide with all commands and patterns
- `docs/IMPROVEMENTS.md` — Improvement tracking

## License

AGPL-3.0 (same as Twenty CRM)
