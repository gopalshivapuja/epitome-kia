# Epitome Kia Website

Modern dealership website for Epitome Kia - Authorized Kia dealer in Bangalore with 5 showroom locations.

**Live Site**: [epitomekia.com](https://epitomekia.com) | **Staging**: [dev.epitomekia.com](https://dev.epitomekia.com)

## Features

- **Model Catalog**: Browse all Kia models with specs, pricing, and images
- **Test Drive Booking**: Schedule test drives with confirmation emails
- **Service Booking**: Book service appointments with pickup options
- **EMI Calculator**: Calculate monthly payments with adjustable terms
- **Dealer Locator**: Interactive map with 5 Bangalore locations
- **Admin Dashboard**: Manage leads, bookings, and content
- **WhatsApp Integration**: Click-to-chat support
- **Google Analytics**: Full event tracking and conversions

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes, Prisma ORM, PostgreSQL |
| Auth | NextAuth.js v5 with credentials provider |
| Email | Resend for transactional emails |
| Testing | Vitest (unit), Playwright (E2E) |
| Deployment | Railway (hosting + PostgreSQL), GitHub Actions (CI/CD) |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Docker)
- npm or yarn

### One-Command Setup

```bash
npm run setup    # Installs deps, generates Prisma client, pushes schema, seeds data
```

### Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Configure environment variables in .env.local
#    - DATABASE_URL (PostgreSQL connection string)
#    - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
#    - NEXTAUTH_URL (http://localhost:3000 for dev)

# 4. Setup database
npm run db:push      # Push schema
npm run db:seed      # Seed sample data

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Access

After seeding, login at `/admin/login`:
- **Email**: `admin@epitomekia.com`
- **Password**: `admin123`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run test:all` | Run all tests |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run deploy:check` | Pre-deployment verification |

## Project Structure

```
├── src/
│   ├── app/                  # Next.js App Router pages & API
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── layout/          # Header, Footer
│   │   ├── forms/           # Form components
│   │   ├── features/        # Feature components
│   │   └── admin/           # Admin dashboard components
│   └── lib/                  # Utilities, DB client, validations
├── tests/
│   ├── e2e/                  # Playwright E2E tests
│   └── unit/                 # Vitest unit tests
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
└── public/                   # Static assets
```

## Documentation

| Document | Description |
|----------|-------------|
| [CLAUDE.md](CLAUDE.md) | Developer guide for AI assistants (~200 lines) |
| [PRD.md](PRD.md) | Product requirements & feature roadmap |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, data flows, security |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Railway deployment guide |
| [TECH_STACK.md](TECH_STACK.md) | Technology decisions & rationale |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Phase tracking & feature status |
| [GITHUB_WORKFLOW_GUIDE.md](GITHUB_WORKFLOW_GUIDE.md) | CI/CD & branching strategy |

## Environment Variables

See [.env.example](.env.example) for all required variables:

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=re_...
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

## Deployment

The site is deployed on Railway with automatic deployments:

- Push to `main` → deploys to production (epitomekia.com)
- Push to `develop` → deploys to staging (dev.epitomekia.com)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Contributing

1. Create feature branch from `develop`: `git checkout -b feature/your-feature`
2. Make changes and test: `npm run test:all`
3. Create PR to `develop`
4. After review, merge to `develop` (auto-deploys to staging)
5. Merge `develop` to `main` for production release

## License

Proprietary - Epitome Automobiles Private Limited
