# Epitome Kia Website

Modern dealership website for Epitome Kia - Authorized Kia dealer in Bangalore with 5 showroom locations.

**Live Site**: [epitomekia.com](https://epitomekia.com) | **Staging**: [dev.epitomekia.com](https://dev.epitomekia.com)

## Current Status: Phase 2 Complete

| Phase | Status | Features |
|-------|--------|----------|
| **Phase 1: Foundation** | ✅ Complete | Core website, lead capture, admin dashboard |
| **Phase 2: AI & Engagement** | ✅ Complete | Chatbot, configurator, recommendations, alerts |
| Phase 3: Self-Service & DMS | 🔜 Next | Customer portal, DMS integration |

## Features

### Phase 1 - Foundation
- **Model Catalog**: Browse all Kia models with specs, pricing, and images
- **Test Drive Booking**: Schedule test drives with confirmation emails
- **Service Booking**: Book service appointments with pickup options
- **EMI Calculator**: Calculate monthly payments with adjustable terms
- **Dealer Locator**: Interactive map with 5 Bangalore locations
- **Admin Dashboard**: Manage leads, bookings, and content
- **WhatsApp Integration**: Click-to-chat support
- **Google Analytics**: Full event tracking and conversions
- **Model Comparison**: Compare Kia models side-by-side

### Phase 2 - AI & Engagement (NEW)
- **AI Chatbot**: RAG-powered chatbot with Kia knowledge base
- **Vehicle Configurator**: Build your perfect Kia (Model → Variant → Color → Accessories)
- **Competitor Comparison**: Compare Kia vs competitors (Hyundai, Tata, etc.)
- **Google Sign-On**: Customer accounts with Google OAuth
- **Price Alerts**: Email notifications for price drops and availability
- **360° Vehicle Viewer**: Interactive drag-to-rotate image viewer
- **Personalized Recommendations**: AI-powered model suggestions based on browsing
- **Smart Nudges**: Context-aware prompts (exit intent, scroll triggers)
- **Recently Viewed**: Track and display browsing history
- **Kia India Auto-Sync**: Automatic data sync from kia.com/in

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes, Prisma ORM, PostgreSQL |
| Auth | NextAuth.js v5 (Admin credentials + Customer Google OAuth) |
| AI | OpenAI GPT-4o-mini, text-embedding-3-small |
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
#    - OPENAI_API_KEY (for AI features)
#    - GOOGLE_CLIENT_ID/SECRET (for customer OAuth)

# 4. Setup database
npm run db:push      # Push schema
npm run db:seed      # Seed sample data

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Access

After seeding, login at `/admin/login`:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@epitomekia.in` | `admin123` |
| Sales Manager | `sales@epitomekia.in` | `staff123` |
| Service Advisor | `service@epitomekia.in` | `staff123` |

### Customer Access

Customers can sign in with Google at `/login` to:
- Save favorite models
- Configure vehicles
- Set price alerts
- View personalized recommendations

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
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── api/             # API routes
│   │   ├── configure/       # Vehicle configurator
│   │   ├── compare/         # Model comparison
│   │   ├── login/           # Customer login
│   │   └── profile/         # Customer profile
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── layout/          # Header, Footer
│   │   ├── forms/           # Form components
│   │   ├── features/        # Feature components (AI Chat, 360 Viewer, etc.)
│   │   ├── auth/            # Auth components (Google Sign-In, UserMenu)
│   │   └── admin/           # Admin dashboard components
│   ├── lib/                 # Utilities, DB client, validations
│   │   ├── tracking/        # User behavior tracking
│   │   ├── sync/            # Kia India auto-sync
│   │   └── notifications/   # Email notifications
│   └── hooks/               # Custom React hooks
├── tests/
│   ├── e2e/                 # Playwright E2E tests
│   └── unit/                # Vitest unit tests
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
└── public/                  # Static assets
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

### Required (Phase 1)
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=re_...
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

### Required (Phase 2 - AI & Engagement)
```bash
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_PLACES_API_KEY=...
```

## Deployment

The site is deployed on Railway with automatic deployments:

- Push to `main` → deploys to production (epitomekia.com)
- Push to `develop` → deploys to staging (dev.epitomekia.com)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## CI/CD Pipeline

GitHub Actions runs on every push:
1. **Lint & Type Check** - ESLint + TypeScript
2. **Unit Tests** - Vitest
3. **E2E Tests** - Playwright (on `main` branch)
4. **Build** - Next.js production build
5. **Deploy** - Railway (automatic)

## Contributing

1. Create feature branch from `develop`: `git checkout -b feature/your-feature`
2. Make changes and test: `npm run test:all`
3. Create PR to `develop`
4. After review, merge to `develop` (auto-deploys to staging)
5. Merge `develop` to `main` for production release

## License

Proprietary - Epitome Automobiles Private Limited
