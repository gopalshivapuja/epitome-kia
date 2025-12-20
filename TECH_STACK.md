# Tech Stack & Implementation Plan — Epitome Kia Website

## Executive Summary

This document outlines the recommended technology stack and implementation strategy for the Epitome Kia dealership website. The stack is designed to support lead capture, model discovery, service booking, and content management while ensuring high performance, scalability, and maintainability.

---

## Technology Stack Overview

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 14 (App Router) | SEO-critical, React ecosystem, excellent performance |
| Styling | Tailwind CSS | Rapid development, consistent design system |
| Backend | Node.js with tRPC or REST | Type-safe APIs, seamless frontend integration |
| Database | PostgreSQL | Already defined schema, robust relational model |
| ORM | Prisma | Type-safe queries, migrations, schema management |
| CMS | Payload CMS or custom admin | Headless CMS with approval workflows |
| Auth | NextAuth.js | Admin authentication, role-based access |
| Chatbot | Vercel AI SDK + OpenAI/Claude | Conversational AI for lead qualification |
| Hosting | Vercel or AWS | Edge functions, CDN, scalable infrastructure |
| Analytics | GA4 + PostHog | Web analytics and product analytics |
| Email/SMS | SendGrid + Twilio | Transactional notifications |
| Media | Cloudinary or S3 | Image optimization and CDN delivery |

---

## 1. Frontend Architecture

### Framework: Next.js 14 (App Router)

**Why Next.js:**
- Server-side rendering (SSR) and static generation (SSG) for SEO-critical pages
- React Server Components for optimal performance
- Built-in image optimization for vehicle galleries
- API routes for backend functionality
- Excellent developer experience and ecosystem

**Key Frontend Features:**

```
src/
├── app/
│   ├── (public)/                 # Public-facing pages
│   │   ├── page.tsx              # Homepage
│   │   ├── models/
│   │   │   ├── page.tsx          # Model catalog
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Model detail
│   │   ├── offers/
│   │   │   ├── page.tsx          # Offers listing
│   │   │   └── [slug]/page.tsx   # Offer detail
│   │   ├── test-drive/
│   │   │   └── page.tsx          # Test drive form
│   │   ├── service/
│   │   │   └── page.tsx          # Service booking
│   │   ├── emi-calculator/
│   │   │   └── page.tsx          # EMI tools
│   │   └── blog/
│   │       ├── page.tsx          # Blog listing
│   │       └── [slug]/page.tsx   # Blog post
│   ├── (admin)/                  # Admin dashboard
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── offers/
│   │   ├── content/
│   │   └── settings/
│   └── api/                      # API routes
│       ├── leads/
│       ├── test-drive/
│       ├── service-booking/
│       ├── chat/
│       └── webhooks/
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── forms/                    # Form components
│   ├── layout/                   # Layout components
│   └── features/                 # Feature-specific components
├── lib/
│   ├── db/                       # Database utilities
│   ├── api/                      # API client
│   └── utils/                    # Shared utilities
└── types/                        # TypeScript types
```

### Styling: Tailwind CSS + shadcn/ui

- **Tailwind CSS**: Utility-first CSS for rapid development
- **shadcn/ui**: High-quality, accessible component library
- **Design tokens**: Custom color palette aligned with Kia brand guidelines
- **Responsive**: Mobile-first design approach

### State Management

- **Server Components**: Primary data fetching via RSC
- **React Query (TanStack Query)**: Client-side caching and mutations
- **Zustand**: Lightweight client state (cart, UI state)
- **React Hook Form + Zod**: Form handling and validation

---

## 2. Backend Architecture

### API Layer: tRPC or REST API Routes

**Option A: tRPC (Recommended)**
- End-to-end type safety with frontend
- Automatic TypeScript inference
- Simpler than GraphQL for this use case

**Option B: REST API Routes**
- Standard RESTful endpoints
- Easier for external integrations
- OpenAPI/Swagger documentation

### ORM: Prisma

```prisma
// Example Prisma schema mapping to existing SQL
model CarModel {
  id          String    @id @default(uuid()) @db.Uuid
  name        String
  slug        String    @unique
  modelYear   Int       @map("model_year")
  description String?
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  variants    Variant[]
  offers      Offer[]

  @@map("car_models")
}
```

### API Endpoints Structure

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/models` | GET | List all car models with filters |
| `/api/models/[slug]` | GET | Get model details |
| `/api/offers` | GET | List active offers |
| `/api/leads` | POST | Create customer lead |
| `/api/test-drive` | POST | Submit test drive request |
| `/api/service-booking` | POST | Submit service booking |
| `/api/chat` | POST | Handle chatbot messages |
| `/api/emi/calculate` | POST | Calculate EMI |
| `/api/admin/*` | Various | Admin CRUD operations |

### Authentication & Authorization

**NextAuth.js Configuration:**
- Email/password for dealership staff
- Role-based access control (RBAC):
  - `admin`: Full access
  - `sales_manager`: Leads, offers, content
  - `service_advisor`: Service bookings, pickup requests
  - `content_editor`: Blog, pages, AI content review

---

## 3. Database Strategy

### PostgreSQL (Already Defined)

The schema in `db/schema.sql` provides a solid foundation. Additional considerations:

**Migrations Strategy:**
```bash
# Using Prisma migrations
npx prisma migrate dev --name init
npx prisma migrate deploy  # Production
```

**Indexes for Performance:**
- Already defined on foreign keys and active flags
- Consider adding full-text search indexes for model/offer search

**Connection Pooling:**
- Use PgBouncer or Prisma Accelerate for production
- Connection limit management for serverless

### Data Sync Strategy

```
┌─────────────────┐     ┌─────────────────┐
│  Kia National   │────▶│   Sync Service  │
│  Content Feed   │     │  (Cron/Webhook) │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │   (car_models,  │
                        │    variants,    │
                        │    specs)       │
                        └─────────────────┘
```

---

## 4. Chatbot Architecture

### Stack: Vercel AI SDK + Claude/OpenAI

```typescript
// Example chatbot implementation
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

  const result = await streamText({
    model: anthropic('claude-3-haiku-20240307'),
    system: `You are a helpful assistant for Epitome Kia dealership.
      Help customers with:
      - Model information and comparisons
      - Current offers and promotions
      - Test drive scheduling
      - Service booking
      - EMI/financing questions

      Collect lead information when appropriate: name, phone, email.`,
    messages,
  });

  // Store messages to database
  await storeMessages(sessionId, messages);

  return result.toDataStreamResponse();
}
```

### Lead Qualification Flow

1. Greet customer and understand intent
2. Provide relevant information (models, offers, services)
3. Qualify lead (buying timeline, budget, trade-in)
4. Capture contact details
5. Handoff to sales/service team or schedule callback

---

## 5. CMS & Admin Dashboard

### Option A: Payload CMS (Recommended)

**Why Payload:**
- Built on Node.js, integrates seamlessly with Next.js
- Rich text editing with blocks
- Built-in authentication and access control
- API-first, headless architecture
- Approval workflows for content

### Option B: Custom Admin Dashboard

Build on Next.js with:
- shadcn/ui components
- Data tables with TanStack Table
- Form builders with React Hook Form
- Rich text with Tiptap or Slate

### Admin Features

| Feature | Description |
|---------|-------------|
| Lead Management | View, filter, export leads; assign to staff |
| Offer Management | CRUD offers with validity dates |
| Content Management | Pages, blog posts, FAQs |
| AI Content Review | Approve/reject AI-generated content |
| Analytics Dashboard | KPIs, conversion funnels |
| User Management | Staff accounts, roles, permissions |
| Audit Log | Track all content changes |

---

## 6. Integrations

### CRM/DMS Integration

```typescript
// Example CRM webhook
export async function POST(req: Request) {
  const lead = await req.json();

  // Send to dealership CRM
  await fetch(process.env.CRM_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CRM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source: 'epitome-kia-website',
      ...lead
    })
  });

  return Response.json({ success: true });
}
```

### Analytics Setup

**Google Analytics 4:**
- Page views, events, conversions
- E-commerce tracking for lead value

**PostHog:**
- Session recordings
- Feature flags
- A/B testing

### Notification Services

| Service | Use Case |
|---------|----------|
| SendGrid | Confirmation emails, lead notifications |
| Twilio | SMS confirmations, reminders |
| Push Notifications | Service reminders (future) |

---

## 7. Infrastructure & DevOps

### Hosting: Vercel (Recommended)

**Why Vercel:**
- Optimized for Next.js
- Edge functions for low latency
- Automatic preview deployments
- Built-in analytics
- Easy environment management

**Alternative: AWS**
- More control over infrastructure
- ECS/EKS for containerized deployment
- CloudFront CDN
- RDS for PostgreSQL

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment Configuration

```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:pass@host:5432/epitome_kia

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://epitome-kia.com

# AI/Chatbot
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Integrations
CRM_WEBHOOK_URL=
CRM_API_KEY=
SENDGRID_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Analytics
NEXT_PUBLIC_GA_ID=
POSTHOG_API_KEY=

# Media
CLOUDINARY_URL=
```

---

## 8. Security Considerations

### Application Security

- **HTTPS Everywhere**: Enforced via hosting platform
- **CSRF Protection**: Built into Next.js
- **Input Validation**: Zod schemas on all inputs
- **Rate Limiting**: API route rate limiting
- **CAPTCHA**: reCAPTCHA or hCaptcha on public forms
- **Content Security Policy**: Strict CSP headers

### Data Privacy

- **Cookie Consent**: GDPR/CCPA compliant banner
- **Data Retention**: Automated cleanup per policy
- **Encryption**: At rest (DB) and in transit (TLS)
- **Access Logs**: Audit trail for sensitive operations

---

## 9. Performance Optimization

### Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

### Optimization Strategies

1. **Image Optimization**
   - Next.js Image component with automatic optimization
   - WebP/AVIF format serving
   - Responsive images with srcset
   - Lazy loading for below-fold images

2. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based code splitting (automatic in App Router)

3. **Caching**
   - Static page generation for model/offer pages
   - Incremental Static Regeneration (ISR)
   - API response caching with stale-while-revalidate

4. **CDN**
   - Static assets served from edge
   - Geographically distributed content

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

| Week | Deliverables |
|------|--------------|
| 1 | Project setup, Next.js scaffold, Prisma integration, CI/CD |
| 2 | Design system implementation, component library, layouts |
| 3 | Homepage, model catalog, model detail pages |
| 4 | Offers pages, EMI calculator |

### Phase 2: Lead Capture (Weeks 5-7)

| Week | Deliverables |
|------|--------------|
| 5 | Lead forms, test drive scheduling |
| 6 | Service booking, pickup request |
| 7 | CRM integration, email/SMS notifications |

### Phase 3: Admin & Content (Weeks 8-10)

| Week | Deliverables |
|------|--------------|
| 8 | Admin dashboard, authentication, user management |
| 9 | Content management, offer management |
| 10 | Lead management dashboard, analytics integration |

### Phase 4: AI Features (Weeks 11-13)

| Week | Deliverables |
|------|--------------|
| 11 | Chatbot implementation, FAQ coverage |
| 12 | Lead qualification flow, handoff to staff |
| 13 | AI blog generation, review workflow |

### Phase 5: Launch Prep (Weeks 14-16)

| Week | Deliverables |
|------|--------------|
| 14 | Performance optimization, Core Web Vitals |
| 15 | Security audit, penetration testing |
| 16 | UAT, content migration, soft launch |

---

## 11. Cost Estimates

### Monthly Infrastructure Costs

| Service | Tier | Est. Monthly Cost |
|---------|------|-------------------|
| Vercel | Pro | $20-50 |
| PostgreSQL (Supabase/Neon) | Pro | $25-50 |
| Cloudinary | Plus | $89 |
| SendGrid | Essentials | $20 |
| Twilio | Pay-as-you-go | ~$50 |
| Anthropic/OpenAI | Usage-based | ~$100-300 |
| PostHog | Scale | $0-450 |
| **Total** | | **~$300-1,000/mo** |

### Development Resources

| Role | Allocation |
|------|------------|
| Full-stack Developer | 1-2 FTE |
| UI/UX Designer | 0.5 FTE |
| QA Engineer | 0.5 FTE |
| Project Manager | 0.25 FTE |

---

## 12. Technical Decisions Summary

### Confirmed Choices

| Decision | Choice | Confidence |
|----------|--------|------------|
| Frontend Framework | Next.js 14 | High |
| Styling | Tailwind CSS + shadcn/ui | High |
| Database | PostgreSQL | High (already defined) |
| ORM | Prisma | High |
| Hosting | Vercel | High |
| Auth | NextAuth.js | High |

### Decisions Requiring Input

| Decision | Options | Recommendation |
|----------|---------|----------------|
| CMS | Payload CMS vs Custom | Payload for faster delivery |
| API Style | tRPC vs REST | tRPC for type safety |
| AI Provider | Claude vs OpenAI | Claude for better reasoning |
| Analytics | GA4 only vs GA4 + PostHog | Both for comprehensive insight |

---

## 13. Next Steps

1. **Validate Stack Choices**: Review with stakeholders and confirm decisions
2. **Environment Setup**: Initialize repository, configure CI/CD
3. **Design System**: Create Figma designs aligned with Kia brand
4. **Database Migration**: Generate Prisma schema from existing SQL
5. **Sprint Planning**: Break Phase 1 into two-week sprints

---

## Appendix

### A. Package Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^5.0.0",
    "@trpc/server": "^10.0.0",
    "@trpc/client": "^10.0.0",
    "zod": "^3.22.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "ai": "^3.0.0",
    "@ai-sdk/anthropic": "^0.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "vitest": "^1.0.0"
  }
}
```

### B. Repository Structure

```
epitome-kia/
├── .github/
│   └── workflows/
├── db/
│   └── schema.sql
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── server/
│   └── types/
├── tests/
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### C. References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [NextAuth.js](https://next-auth.js.org)
