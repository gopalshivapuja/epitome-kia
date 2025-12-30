# Architecture Overview — Epitome Kia Website

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Browser (React/Next.js)                                                    │
│  ├── Public Pages: /, /models, /offers, /test-drive, /service, /contact    │
│  ├── Admin Dashboard: /admin/* (protected)                                  │
│  └── Floating Components: WhatsApp Button, Cookie Consent                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (/api/*)                                                │
│  ├── /api/models          - Car model catalog                               │
│  ├── /api/leads           - Customer lead capture                           │
│  ├── /api/test-drive      - Test drive requests                             │
│  ├── /api/service-booking - Service appointments                            │
│  ├── /api/offers          - Promotional offers                              │
│  ├── /api/newsletter      - Newsletter subscriptions                        │
│  ├── /api/emi             - EMI calculations                                │
│  ├── /api/auth/*          - NextAuth.js authentication                      │
│  └── /api/health          - Health check endpoint                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Prisma ORM                                                                 │
│  └── PostgreSQL Database (Railway)                                          │
│      ├── car_models, variants, specifications                               │
│      ├── customer_leads, test_drive_requests, service_bookings              │
│      ├── offers, pages, blog_posts, faqs                                    │
│      └── admin_users (authentication)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ├── Resend        - Email notifications (leads, confirmations)             │
│  ├── Google Analytics 4 - User tracking & conversion events                 │
│  ├── Google Maps   - Dealer locator with embedded maps                      │
│  └── WhatsApp      - Click-to-chat (direct links)                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 14 (App Router) | SSR, SSG, API routes, React Server Components |
| **Language** | TypeScript | Type safety across frontend and backend |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with pre-built components |
| **Database** | PostgreSQL | Relational data storage |
| **ORM** | Prisma 5 | Type-safe database queries, migrations |
| **Auth** | NextAuth.js v5 (beta) | Admin authentication with JWT sessions |
| **Forms** | React Hook Form + Zod | Form handling and validation |
| **Email** | Resend | Transactional email notifications |
| **Analytics** | Google Analytics 4 | Web analytics and conversion tracking |
| **Hosting** | Railway | App hosting, PostgreSQL, CI/CD |

---

## Directory Structure

```
epitome-kia/
├── prisma/
│   ├── schema.prisma      # Database schema (source of truth)
│   ├── migrations/        # Database migration files
│   └── seed.ts            # Seed data (models, locations, admin user)
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, analytics, WhatsApp)
│   │   ├── page.tsx                  # Homepage
│   │   ├── models/                   # /models, /models/[slug]
│   │   ├── offers/                   # /offers, /offers/[slug]
│   │   ├── test-drive/               # /test-drive booking form
│   │   ├── service/                  # /service booking form
│   │   ├── contact/                  # /contact with locations
│   │   ├── emi-calculator/           # EMI calculator page
│   │   ├── blog/                     # /blog, /blog/[slug]
│   │   ├── privacy/                  # Privacy policy
│   │   ├── terms/                    # Terms of service
│   │   ├── insurance/                # Insurance info page
│   │   ├── admin/                    # Admin routes
│   │   │   ├── login/                # Admin login page
│   │   │   └── (dashboard)/          # Protected dashboard layout
│   │   │       ├── page.tsx          # Dashboard home
│   │   │       ├── leads/            # Lead management
│   │   │       ├── test-drives/      # Test drive requests
│   │   │       ├── service-bookings/ # Service bookings
│   │   │       ├── offers/           # Offer management
│   │   │       └── content/          # CMS content
│   │   └── api/                      # API routes
│   │       ├── auth/[...nextauth]/   # Auth endpoints
│   │       ├── models/               # Model CRUD
│   │       ├── leads/                # Lead CRUD
│   │       ├── test-drive/           # Test drive CRUD
│   │       ├── service-booking/      # Service booking CRUD
│   │       ├── offers/               # Offer CRUD
│   │       ├── pages/                # Page CRUD
│   │       ├── blog-posts/           # Blog CRUD
│   │       ├── emi/                  # EMI calculation
│   │       └── health/               # Health check
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layout/                   # Header, Footer, navigation
│   │   ├── forms/                    # Contact, TestDrive, Service forms
│   │   ├── features/                 # EMI calculator, WhatsApp, Cookie consent
│   │   ├── admin/                    # Admin action components
│   │   └── analytics/                # Google Analytics component
│   │
│   ├── lib/
│   │   ├── db.ts                     # Prisma client singleton
│   │   ├── auth.ts                   # NextAuth configuration
│   │   ├── validations.ts            # Zod schemas for API validation
│   │   ├── api-utils.ts              # API response helpers
│   │   ├── email.ts                  # Email sending via Resend
│   │   ├── rate-limit.ts             # Rate limiting for APIs
│   │   ├── company-data.ts           # Static company/location data
│   │   └── utils.ts                  # General utilities (cn, etc.)
│   │
│   ├── middleware.ts                 # Auth middleware + security headers
│   └── types/                        # TypeScript type definitions
│
├── public/                           # Static assets
├── .env.example                      # Environment variable template
├── package.json                      # Dependencies and scripts
├── tailwind.config.ts                # Tailwind configuration
├── next.config.mjs                   # Next.js configuration
└── tsconfig.json                     # TypeScript configuration
```

---

## Data Flow

### 1. Lead Capture Flow

```
User fills form → Client validation (Zod) → POST /api/leads
    → Rate limit check
    → Server validation (Zod)
    → Prisma: Create CustomerLead
    → Resend: Send notification email (async)
    → Return success response
```

### 2. Test Drive Booking Flow

```
User selects model + date → POST /api/test-drive
    → Find or create CustomerLead
    → Create TestDriveRequest (linked to lead + model)
    → Send email notifications (customer + sales team)
    → Return confirmation with booking details
```

### 3. Admin Authentication Flow

```
Admin visits /admin/* → Middleware checks session
    → No session? Redirect to /admin/login
    → Has session? Allow access

Login: POST credentials → NextAuth authorize()
    → Verify password (bcrypt)
    → Create JWT session (24h expiry)
    → Redirect to /admin dashboard
```

---

## Database Schema (Key Entities)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   CarModel      │────▶│    Variant      │────▶│ Specification   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (UUID)       │     │ id (UUID)       │     │ id (UUID)       │
│ name            │     │ carModelId      │     │ variantId       │
│ slug (unique)   │     │ name            │     │ specKey         │
│ modelYear       │     │ slug (unique)   │     │ specValue       │
│ description     │     │ basePrice       │     │ unit            │
│ isActive        │     │ isActive        │     └─────────────────┘
│ deletedAt       │     │ deletedAt       │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ CustomerLead    │────▶│TestDriveRequest │     │ ServiceBooking  │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (UUID)       │     │ id (UUID)       │     │ id (UUID)       │
│ fullName        │     │ customerLeadId  │     │ customerLeadId  │
│ email           │     │ carModelId      │     │ carModelId      │
│ phone           │     │ preferredDate   │     │ serviceDate     │
│ source          │     │ status          │     │ serviceType     │
│ notes           │     │ deletedAt       │     │ status          │
│ deletedAt       │     └─────────────────┘     │ deletedAt       │
└─────────────────┘                             └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Offer       │     │     Page        │     │   BlogPost      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (UUID)       │     │ id (UUID)       │     │ id (UUID)       │
│ carModelId      │     │ title           │     │ title           │
│ title           │     │ slug (unique)   │     │ slug (unique)   │
│ slug (unique)   │     │ content         │     │ content         │
│ startAt         │     │ isPublished     │     │ isPublished     │
│ endAt           │     │ publishedAt     │     │ publishedAt     │
│ isActive        │     │ deletedAt       │     │ authorName      │
│ deletedAt       │     └─────────────────┘     │ deletedAt       │
└─────────────────┘                             └─────────────────┘

┌─────────────────┐
│   AdminUser     │
├─────────────────┤
│ id (UUID)       │
│ email (unique)  │
│ passwordHash    │
│ fullName        │
│ role            │  ← admin, sales_manager, service_advisor, staff
│ isActive        │
│ lastLoginAt     │
│ deletedAt       │
└─────────────────┘
```

---

## Authentication & Authorization

### Auth Configuration
- **Provider**: NextAuth.js v5 (Credentials)
- **Session Strategy**: JWT (24-hour expiry)
- **Password Hashing**: bcrypt
- **Protected Routes**: `/admin/*` (except `/admin/login`)

### Role-Based Access
| Role | Access Level |
|------|--------------|
| `admin` | Full access, including `/admin/settings` |
| `sales_manager` | Leads, test drives, offers |
| `service_advisor` | Service bookings |
| `staff` | Read-only dashboard |

### Middleware Protection
```typescript
// src/middleware.ts
- Adds security headers (CSP, X-Frame-Options, etc.)
- Redirects unauthenticated users from /admin/* to /admin/login
- Redirects authenticated users from /admin/login to /admin
- Role-based route protection for /admin/settings
```

---

## Security Features

| Feature | Implementation |
|---------|----------------|
| **HTTPS** | Enforced by Railway |
| **CSP** | Content-Security-Policy headers |
| **XSS Protection** | X-XSS-Protection header |
| **Clickjacking** | X-Frame-Options: DENY |
| **MIME Sniffing** | X-Content-Type-Options: nosniff |
| **Rate Limiting** | In-memory rate limiter on form APIs |
| **Input Validation** | Zod schemas on all API endpoints |
| **Soft Deletes** | `deletedAt` field on all tables |
| **Password Security** | bcrypt hashing for admin users |

---

## Environment Variables

```bash
# Database (auto-injected by Railway)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication (required)
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.railway.app

# Email notifications (required for production)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Analytics (optional but recommended)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Maps (required for dealer locator)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key

# Environment
NODE_ENV=production
```

---

## API Response Format

All API endpoints return consistent JSON responses:

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: "message", errors?: { field: ["error"] } }
```

### Pagination Response
```typescript
{
  success: true,
  data: T[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  }
}
```

---

## Key Integration Points

### 1. Resend (Email)
- **File**: `src/lib/email.ts`
- **Usage**: Lead notifications, booking confirmations
- **Env**: `RESEND_API_KEY`

### 2. Google Analytics 4
- **File**: `src/components/analytics/google-analytics.tsx`
- **Events**: `test_drive`, `service_booking`, `contact`, `lead`
- **Env**: `NEXT_PUBLIC_GA_ID`

### 3. WhatsApp Business
- **File**: `src/components/features/WhatsAppButton.tsx`
- **Method**: Direct `wa.me` links with pre-filled message
- **Number**: +91-8047363737

### 4. Google Maps
- **File**: `src/components/features/DealerLocator.tsx`
- **Usage**: Embedded maps for 5 dealership locations
- **Env**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## Performance Considerations

1. **Server Components**: Used for data fetching (no client JS)
2. **Static Generation**: Model pages pre-rendered at build time
3. **Image Optimization**: Next.js Image component with lazy loading
4. **Code Splitting**: Automatic via Next.js App Router
5. **Caching**: Prisma query caching, ISR for model pages

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Railway                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────┐          ┌─────────────────┐          │
│   │   Next.js App   │◀────────▶│   PostgreSQL    │          │
│   │   (Node.js)     │          │   (Database)    │          │
│   └─────────────────┘          └─────────────────┘          │
│           │                                                  │
│           │ Auto-deploy on push to main                      │
│           │                                                  │
└───────────┼──────────────────────────────────────────────────┘
            │
            ▼
    GitHub Actions (CI)
    - Lint
    - Type check
    - Build verification
```

---

## Testing Infrastructure

### Test Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **E2E Testing** | Playwright | Browser automation, user flows |
| **Unit Testing** | Vitest | Fast unit tests, component tests |
| **Test Runner** | GitHub Actions | CI pipeline, automated testing |

### Test Commands

```bash
npm run test         # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
npm run test:all     # Run all tests
```

### E2E Test Coverage

```
tests/e2e/
├── homepage.spec.ts      # Homepage loads, navigation works
├── header.spec.ts        # Header links, navigation
├── newsletter.spec.ts    # Newsletter signup form
├── compare.spec.ts       # Model comparison tool
├── faq.spec.ts           # FAQ accordion functionality
└── brochure.spec.ts      # Brochure download flow
```

### Unit Test Coverage

```
tests/unit/
├── api/
│   └── leads.test.ts     # Lead API validation
├── components/
│   ├── Button.test.tsx   # Button component
│   └── EMICalculator.test.tsx
└── utils.test.ts         # Utility functions
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    - npm run lint
    - npm run type-check
    - npm run test
    - npm run build
```

---

## Future Enhancements (from PRD)

| Phase | Features | Status |
|-------|----------|--------|
| Phase 1 | Core website, lead capture, admin | ✅ Complete (Dec 2024) |
| Phase 2 | AI Chatbot, 360° viewer, content sync | Planned |
| Phase 3 | DMS integration, customer portal | Future |
| Phase 4 | Accessories store, insurance | Future |
| Phase 5 | Mobile app, AR features | Future |
