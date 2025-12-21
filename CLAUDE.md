# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Production build
npm run lint             # ESLint
npm run type-check       # TypeScript type checking

# Database (Prisma)
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes (dev)
npm run db:migrate       # Create and apply migrations
npm run db:seed          # Seed with sample data
npm run db:studio        # Open Prisma Studio GUI
npm run db:reset         # Reset database (dev only)

# Full setup from scratch
npm run setup            # install + prisma generate + db push + seed

# Pre-deployment verification
npm run deploy:check     # lint + type-check + build
```

## Architecture Overview

**Stack**: Next.js 14 (App Router) + Prisma ORM + PostgreSQL + NextAuth.js v5 + Tailwind CSS + shadcn/ui

### Route Structure

```
src/app/
├── (public)/            # Public pages (models, offers, test-drive, service, emi-calculator)
├── admin/               # Protected admin routes
│   ├── login/           # Admin login (public)
│   └── (dashboard)/     # Dashboard pages (leads, offers, test-drives, service-bookings)
└── api/                 # API routes
    ├── models/          # GET /api/models, GET /api/models/[slug]
    ├── leads/           # POST /api/leads, GET/PATCH/DELETE /api/leads/[id]
    ├── test-drive/      # POST /api/test-drive, PATCH/DELETE /api/test-drive/[id]
    ├── service-booking/ # POST /api/service-booking, PATCH/DELETE /api/service-booking/[id]
    ├── offers/          # GET/POST /api/offers, PATCH/DELETE /api/offers/[id]
    ├── blog-posts/      # GET/POST /api/blog-posts, PATCH/DELETE /api/blog-posts/[id]
    ├── pages/           # GET/POST /api/pages, PATCH/DELETE /api/pages/[id]
    ├── emi/             # POST /api/emi
    ├── admin/sync/      # POST - sync data from Kia India
    ├── health/          # GET - health check endpoint
    └── auth/[...nextauth]/
```

### Key Files

- `src/lib/db.ts` - Prisma client singleton
- `src/lib/auth.ts` - NextAuth.js v5 config with credentials provider and type augmentation
- `src/lib/validations.ts` - Zod schemas for all form inputs
- `src/lib/api-utils.ts` - API response helpers (`successResponse`, `errorResponse`, `handleApiError`)
- `src/middleware.ts` - Auth protection for `/admin/*` routes with security headers (CSP, X-Frame-Options, etc.)
- `prisma/schema.prisma` - Database schema (source of truth)
- `prisma/seed.ts` - Seed data for development

### Authentication

NextAuth.js v5 (beta) with credentials provider. Admin users stored in `AdminUser` table with bcrypt-hashed passwords. JWT session strategy (24h expiry). Roles: `admin`, `sales_manager`, `service_advisor`, `staff`. Only `admin` role can access `/admin/settings`.

### API Response Pattern

All API routes use consistent response helpers from `src/lib/api-utils.ts`:
```typescript
successResponse(data, status?)     // { success: true, data }
errorResponse(message, status?)    // { success: false, error }
handleApiError(error)              // Handles ZodError, Error, and unknown
```

### Component Organization

- `src/components/ui/` - shadcn/ui base components
- `src/components/layout/` - Header variants, Footer, FullscreenSection
- `src/components/forms/` - Form components with React Hook Form + Zod
- `src/components/admin/` - Admin dashboard components
- `src/components/features/` - Feature-specific components (CookieConsent, etc.)

## Database Conventions

- **Primary Keys**: UUID with `@default(uuid())` and `@db.Uuid`
- **Soft Deletes**: All tables have `deletedAt` field - always filter with `deletedAt: null`
- **Audit Fields**: `createdAt`, `updatedAt` on all tables
- **Naming**: Prisma uses camelCase, DB tables use snake_case via `@@map()`
- **Timestamps**: Use `@db.Timestamptz` for timezone-aware timestamps

### Core Models

- `CarModel` → `Variant` → `Specification` (hierarchical vehicle data)
- `CustomerLead` → links to `TestDriveRequest`, `ServiceBooking`, `PickupRequest`
- `Offer` → optional links to `CarModel` or `Variant`
- `Page`, `BlogPost`, `FAQ` (content management)
- `AdminUser` (authentication)

## Key Business Rules

1. **Lead Capture**: `CustomerLead` requires either email OR phone (Zod refinement in validations.ts)
2. **Offers**: Can be linked to either a `CarModel` or `Variant` (both optional)
3. **Publishing**: Pages/BlogPosts require `publishedAt` when `isPublished = true`
4. **Status Values**: `pending`, `scheduled`, `completed`, `cancelled` for requests
5. **Date Validation**: Test drives and service bookings require dates today or in the future

## Environment Variables

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<32-char-base64>
NEXTAUTH_URL=https://your-domain.com
RESEND_API_KEY=re_...  # Email notifications
```

## Kia Brand Colors (Tailwind)

Use `kia-*` color utilities: `kia-red` (#BB162B), `kia-red-dark` (#8B1120), `kia-black` (#05141F), `kia-graphite`, `kia-silver`
