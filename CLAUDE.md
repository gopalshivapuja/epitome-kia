# CLAUDE.md - Epitome Kia Developer Guide

AI assistant context file for Claude Code. This provides essential project context in ~200 lines.
For detailed documentation, see the [Documentation Index](#documentation-index) below.

## Current Status

**Phase 1: Complete** (Dec 2024) | **Phase 2: AI & Engagement** (Starting)

Phase 1 delivered: Model catalog, test drive booking, service booking, EMI calculator, admin dashboard, WhatsApp integration, Google Analytics, responsive design, SEO optimization.

## Quick Start

```bash
# First-time setup
npm run setup              # Install + generate Prisma + push schema + seed

# Development
npm run dev                # Start dev server at localhost:3000
npm run build              # Production build
npm run lint               # ESLint
npm run type-check         # TypeScript check

# Database
npm run db:push            # Push schema changes
npm run db:seed            # Seed sample data
npm run db:studio          # Open Prisma Studio GUI

# Testing
npm run test               # Unit tests (Vitest)
npm run test:e2e           # E2E tests (Playwright)
npm run test:all           # Run all tests

# Deployment
npm run deploy:check       # Lint + type-check + build
```

## Tech Stack

**Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
**Backend**: Next.js API Routes + Prisma ORM + PostgreSQL + NextAuth.js v5
**Testing**: Vitest (unit) + Playwright (E2E)
**Deployment**: Railway (hosting + PostgreSQL) + GitHub Actions (CI/CD)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Homepage (Tesla-style sections)
│   ├── models/             # /models, /models/[slug]
│   ├── test-drive/         # Test drive booking
│   ├── service/            # Service booking
│   ├── contact/            # Contact + dealer locator
│   ├── compare/            # Model comparison
│   ├── faq/                # FAQ page
│   ├── admin/              # Protected admin dashboard
│   ├── api/                # API routes (19 endpoints)
│   ├── sitemap.ts          # SEO sitemap
│   └── robots.ts           # SEO robots.txt
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, Footer, FullscreenSection
│   ├── forms/              # ContactForm, TestDriveForm, ServiceBookingForm
│   ├── features/           # WhatsAppButton, DealerLocator, GoogleReviews
│   └── admin/              # Dashboard tables and components
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── auth.ts             # NextAuth.js v5 config
│   ├── validations.ts      # Zod schemas
│   ├── api-utils.ts        # API response helpers
│   ├── company-data.ts     # Locations, models, social links
│   └── utils.ts            # cn() helper and utilities
tests/
├── e2e/                    # Playwright E2E tests
└── unit/                   # Vitest unit tests
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed data
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/auth.ts` | NextAuth.js v5 config with credentials provider |
| `src/lib/validations.ts` | Zod schemas for all form inputs |
| `src/lib/api-utils.ts` | `successResponse()`, `errorResponse()`, `handleApiError()` |
| `src/middleware.ts` | Auth protection + security headers (CSP, X-Frame-Options) |
| `prisma/schema.prisma` | Database schema (source of truth) |
| `.env.example` | Environment variables template |

## API Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/models` | GET, POST | Car models CRUD |
| `/api/leads` | GET, POST | Customer leads |
| `/api/test-drive` | GET, POST | Test drive bookings |
| `/api/service-booking` | GET, POST | Service appointments |
| `/api/offers` | GET, POST | Promotional offers |
| `/api/newsletter` | POST | Newsletter subscriptions |
| `/api/emi` | POST | EMI calculations |
| `/api/health` | GET | Health check |

## Database Conventions

- **Primary Keys**: UUID with `@default(uuid())` and `@db.Uuid`
- **Soft Deletes**: All tables have `deletedAt` - filter with `{ deletedAt: null }`
- **Audit Fields**: `createdAt`, `updatedAt` on all tables
- **Timestamps**: Use `@db.Timestamptz` for timezone-aware timestamps

## API Response Pattern

```typescript
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

// Success: { success: true, data: {...} }
return successResponse(data, 200)

// Error: { success: false, error: "message" }
return errorResponse("Not found", 404)

// Catch-all error handler (handles ZodError, etc.)
catch (error) { return handleApiError(error) }
```

## Authentication

NextAuth.js v5 with credentials provider. Admin users in `AdminUser` table with bcrypt passwords.
Roles: `admin`, `sales_manager`, `service_advisor`, `staff`

Default admin login (from seed): `admin@epitomekia.com` / `admin123`

## Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - 32-char secret for JWT
- `NEXTAUTH_URL` - Your domain URL
- `RESEND_API_KEY` - Email notifications
- `NEXT_PUBLIC_GA_ID` - Google Analytics 4
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps Embed API

## Kia Brand Colors (Tailwind)

```
kia-red: #BB162B       kia-red-dark: #8B1120
kia-black: #05141F     kia-graphite: #58595B
kia-silver: #C4C4C4
```

## Business Rules

1. **Lead Capture**: `CustomerLead` requires email OR phone
2. **Offers**: Can link to `CarModel` or `Variant` (both optional)
3. **Publishing**: Pages/BlogPosts need `publishedAt` when `isPublished = true`
4. **Status Values**: `pending`, `scheduled`, `completed`, `cancelled`
5. **Date Validation**: Test drives/service require future dates

## Documentation Index

| Document | Description |
|----------|-------------|
| **[PRD.md](PRD.md)** | Product requirements, phases, features, KPIs |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System design, data flows, security |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Railway deployment guide |
| **[TECH_STACK.md](TECH_STACK.md)** | Technology choices and rationale |
| **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** | Phase tracking, feature status |
| **[GITHUB_WORKFLOW_GUIDE.md](GITHUB_WORKFLOW_GUIDE.md)** | CI/CD, branching strategy |

## Common Tasks

### Add a new API endpoint
1. Create route file: `src/app/api/[resource]/route.ts`
2. Add Zod schema in `src/lib/validations.ts`
3. Use `successResponse`/`errorResponse` helpers

### Add a new page
1. Create page: `src/app/[route]/page.tsx`
2. Add metadata export for SEO
3. Update `src/app/sitemap.ts` if public

### Add a form component
1. Create in `src/components/forms/`
2. Use React Hook Form + Zod resolver
3. Submit to corresponding API endpoint

### Run database migrations
```bash
npm run db:push      # Development (direct push)
npm run db:migrate   # Production (create migration)
```

### Deploy to Railway
```bash
git push origin main  # Triggers automatic deployment
```

## Git Workflow

- `main` → Production (epitomekia.com)
- `develop` → Staging (dev.epitomekia.com)
- `feature/*` → Feature branches (PR to develop)

See [GITHUB_WORKFLOW_GUIDE.md](GITHUB_WORKFLOW_GUIDE.md) for details.
