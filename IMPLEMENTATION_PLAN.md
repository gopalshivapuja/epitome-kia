# Implementation Plan — Epitome Kia Website

## Overview

This document outlines the step-by-step implementation plan for building the Epitome Kia dealership website. Each phase has clear deliverables and checkpoints for review before proceeding.

---

## Phase 1: Project Foundation

**Goal**: Set up the development environment, project structure, and core infrastructure.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 1.1 | Initialize Next.js project | Create Next.js 14 app with TypeScript, App Router |
| 1.2 | Configure Tailwind CSS | Set up Tailwind with Kia brand color palette |
| 1.3 | Install shadcn/ui | Add component library and configure theme |
| 1.4 | Set up Prisma | Initialize Prisma, create schema from existing SQL |
| 1.5 | Configure ESLint & Prettier | Code quality and formatting rules |
| 1.6 | Create folder structure | Organize src/ with app, components, lib, types |
| 1.7 | Environment configuration | Create .env.example with required variables |
| 1.8 | Add base layout | Header, footer, navigation components |

### Deliverables

- [ ] Working Next.js application at `http://localhost:3000`
- [ ] Prisma schema matching `db/schema.sql`
- [ ] Base layout with header/footer
- [ ] Configured linting and formatting

### Checkpoint 1 Review

```
Before proceeding to Phase 2, verify:
- [ ] `npm run dev` starts without errors
- [ ] `npm run lint` passes
- [ ] `npx prisma validate` succeeds
- [ ] Base layout renders correctly
```

---

## Phase 2: Database & API Layer

**Goal**: Establish database connectivity and create the API foundation.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 2.1 | Database connection | Configure PostgreSQL connection via Prisma |
| 2.2 | Generate Prisma client | Run migrations, generate typed client |
| 2.3 | Create API utilities | Database helpers, error handling, validation |
| 2.4 | Seed data script | Sample car models, variants, offers for development |
| 2.5 | API route: GET /api/models | List car models with filtering |
| 2.6 | API route: GET /api/models/[slug] | Get single model with variants/specs |
| 2.7 | API route: GET /api/offers | List active offers |
| 2.8 | API route: POST /api/leads | Create customer lead |

### Deliverables

- [ ] Database connected and migrations applied
- [ ] Seed data populated for development
- [ ] Working API endpoints for models, offers, leads
- [ ] API error handling and validation

### Checkpoint 2 Review

```
Before proceeding to Phase 3, verify:
- [ ] `npx prisma db push` succeeds
- [ ] `npx prisma db seed` populates data
- [ ] API routes return expected JSON responses
- [ ] Lead creation saves to database
```

---

## Phase 3: Public Pages — Model Catalog

**Goal**: Build the customer-facing model browsing experience.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 3.1 | Homepage | Hero section, featured models, CTAs |
| 3.2 | Model catalog page | Grid/list view, filters (type, price, fuel) |
| 3.3 | Model detail page | Gallery, specs, variants, pricing |
| 3.4 | Image optimization | Next.js Image component, placeholders |
| 3.5 | Model comparison (basic) | Side-by-side spec comparison |
| 3.6 | Responsive design | Mobile-first, tablet, desktop breakpoints |
| 3.7 | Loading states | Skeletons, suspense boundaries |

### Deliverables

- [ ] Homepage with hero and featured models
- [ ] Searchable/filterable model catalog
- [ ] Model detail pages with full specs
- [ ] Responsive across all device sizes

### Checkpoint 3 Review

```
Before proceeding to Phase 4, verify:
- [ ] Homepage loads with real data from database
- [ ] Model filters work correctly
- [ ] Model detail shows all variants and specs
- [ ] Pages are responsive on mobile/tablet/desktop
- [ ] Core Web Vitals: LCP < 2.5s on model pages
```

---

## Phase 4: Offers & EMI Tools

**Goal**: Display promotional offers and provide financing calculators.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 4.1 | Offers listing page | All active offers with filters |
| 4.2 | Offer detail page | Full terms, eligibility, CTA |
| 4.3 | Offer badges on models | Show applicable offers on model cards |
| 4.4 | EMI calculator component | Interactive loan calculator |
| 4.5 | EMI on model detail | Integrate calculator with model pricing |
| 4.6 | Save/share EMI results | Generate shareable calculation link |
| 4.7 | Disclaimers | Legal text for offers and EMI |

### Deliverables

- [ ] Offers page with active promotions
- [ ] EMI calculator with adjustable parameters
- [ ] EMI integrated into model detail pages
- [ ] Legal disclaimers displayed appropriately

### Checkpoint 4 Review

```
Before proceeding to Phase 5, verify:
- [ ] Offers display with correct validity dates
- [ ] Expired offers are hidden automatically
- [ ] EMI calculator produces accurate results
- [ ] EMI formula matches standard amortization
- [ ] Disclaimers are visible and compliant
```

---

## Phase 5: Lead Capture Forms

**Goal**: Implement test drive scheduling and inquiry forms.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 5.1 | Lead form component | Reusable form with validation |
| 5.2 | Test drive request form | Model, date, time, location selection |
| 5.3 | API route: POST /api/test-drive | Save test drive request |
| 5.4 | Get quote form | Quick inquiry for pricing |
| 5.5 | Contact form | General inquiries |
| 5.6 | Form validation | Zod schemas, error messages |
| 5.7 | Success confirmations | Thank you messages, next steps |
| 5.8 | CAPTCHA integration | Spam protection on forms |

### Deliverables

- [ ] Test drive scheduling form
- [ ] Get quote inquiry form
- [ ] Contact form for general inquiries
- [ ] All forms save leads to database
- [ ] CAPTCHA protection enabled

### Checkpoint 5 Review

```
Before proceeding to Phase 6, verify:
- [ ] Test drive form submits successfully
- [ ] Lead appears in database with all fields
- [ ] Validation errors display correctly
- [ ] CAPTCHA blocks automated submissions
- [ ] Confirmation messages show after submit
```

---

## Phase 6: Service Booking

**Goal**: Enable customers to book vehicle service appointments.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 6.1 | Service page | Overview of service offerings |
| 6.2 | Service booking form | Service type, date, time, vehicle info |
| 6.3 | Pickup/drop-off options | Address input for pickup service |
| 6.4 | API route: POST /api/service-booking | Save service booking |
| 6.5 | API route: POST /api/pickup-request | Save pickup request |
| 6.6 | Dealer location selector | Choose service center |
| 6.7 | Booking confirmation | Summary and confirmation number |

### Deliverables

- [ ] Service information page
- [ ] Service booking form with date/time selection
- [ ] Pickup request option
- [ ] Dealer location selection
- [ ] Booking confirmation with reference number

### Checkpoint 6 Review

```
Before proceeding to Phase 7, verify:
- [ ] Service booking saves to database
- [ ] Pickup request saves with address
- [ ] Dealer locations display correctly
- [ ] Confirmation shows booking reference
- [ ] Date/time picker works on mobile
```

---

## Phase 7: Authentication & Admin Foundation

**Goal**: Set up admin authentication and basic dashboard structure.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 7.1 | NextAuth.js setup | Configure authentication provider |
| 7.2 | Admin user model | Add users table to schema |
| 7.3 | Login page | Admin login form |
| 7.4 | Session management | Protected routes, middleware |
| 7.5 | Admin layout | Sidebar navigation, header |
| 7.6 | Dashboard home | Overview stats, recent activity |
| 7.7 | Role-based access | Admin, sales_manager, service_advisor roles |

### Deliverables

- [ ] Admin login functionality
- [ ] Protected admin routes
- [ ] Admin dashboard layout
- [ ] Role-based access control
- [ ] Session persistence

### Checkpoint 7 Review

```
Before proceeding to Phase 8, verify:
- [ ] Admin can log in with credentials
- [ ] Unauthenticated users redirected to login
- [ ] Dashboard displays after login
- [ ] Roles restrict access appropriately
- [ ] Session persists across page refreshes
```

---

## Phase 8: Lead Management Dashboard

**Goal**: Build admin interface for managing customer leads.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 8.1 | Leads list page | Table with sorting, filtering, pagination |
| 8.2 | Lead detail view | Full lead information, history |
| 8.3 | Lead status updates | Mark as contacted, qualified, converted |
| 8.4 | Test drive requests list | View and manage test drive bookings |
| 8.5 | Service bookings list | View and manage service appointments |
| 8.6 | Lead export | CSV export of leads |
| 8.7 | Lead assignment | Assign leads to staff members |

### Deliverables

- [ ] Searchable/filterable leads table
- [ ] Lead detail view with full history
- [ ] Status update functionality
- [ ] Test drive and service booking management
- [ ] CSV export capability

### Checkpoint 8 Review

```
Before proceeding to Phase 9, verify:
- [ ] Leads table loads with pagination
- [ ] Filters work (date range, status, source)
- [ ] Status updates save to database
- [ ] Export downloads valid CSV file
- [ ] Staff can only see assigned leads (if applicable)
```

---

## Phase 9: Content Management

**Goal**: Enable admin users to manage offers, pages, and blog content.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 9.1 | Offers management | CRUD for offers with date validation |
| 9.2 | Rich text editor | Tiptap or similar for content editing |
| 9.3 | Pages management | CRUD for static pages |
| 9.4 | Blog post management | Create, edit, publish blog posts |
| 9.5 | FAQ management | Add/edit FAQs per page |
| 9.6 | Media upload | Image upload and management |
| 9.7 | SEO fields | Meta title, description, OG tags |
| 9.8 | Preview mode | Preview unpublished content |

### Deliverables

- [ ] Offer creation and editing
- [ ] Page content management
- [ ] Blog post editor with rich text
- [ ] FAQ management
- [ ] Image upload functionality
- [ ] SEO metadata editing

### Checkpoint 9 Review

```
Before proceeding to Phase 10, verify:
- [ ] New offers appear on public site
- [ ] Page edits reflect on frontend
- [ ] Blog posts can be drafted and published
- [ ] Images upload and display correctly
- [ ] SEO meta tags render in page head
```

---

## Phase 10: Chatbot Integration

**Goal**: Implement AI-powered chatbot for customer assistance.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 10.1 | Chat UI component | Floating chat widget |
| 10.2 | Chat API route | Streaming chat endpoint |
| 10.3 | AI integration | Vercel AI SDK + Claude |
| 10.4 | System prompt | Dealership context, FAQ knowledge |
| 10.5 | Lead capture in chat | Collect contact info during conversation |
| 10.6 | Chat session storage | Save conversations to database |
| 10.7 | Handoff to human | Flag for staff follow-up |
| 10.8 | Chat admin view | View chat transcripts |

### Deliverables

- [ ] Floating chat widget on all pages
- [ ] AI responses for common questions
- [ ] Lead capture during chat
- [ ] Chat history saved to database
- [ ] Admin view of chat transcripts

### Checkpoint 10 Review

```
Before proceeding to Phase 11, verify:
- [ ] Chat widget opens and closes correctly
- [ ] AI responds to model, offer, service questions
- [ ] Lead info captured and saved
- [ ] Chat transcripts viewable in admin
- [ ] Handoff flag creates notification
```

---

## Phase 11: Notifications & Integrations

**Goal**: Set up email/SMS notifications and CRM integration.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 11.1 | Email service setup | SendGrid configuration |
| 11.2 | Lead notification email | Alert staff of new leads |
| 11.3 | Confirmation emails | Customer confirmation for bookings |
| 11.4 | SMS service setup | Twilio configuration |
| 11.5 | SMS confirmations | Booking reminders via SMS |
| 11.6 | CRM webhook | Send leads to external CRM |
| 11.7 | Webhook retry logic | Handle failed webhook deliveries |
| 11.8 | Notification preferences | Admin settings for notifications |

### Deliverables

- [ ] Email notifications for new leads
- [ ] Customer confirmation emails
- [ ] SMS booking confirmations
- [ ] CRM webhook integration
- [ ] Notification settings in admin

### Checkpoint 11 Review

```
Before proceeding to Phase 12, verify:
- [ ] Staff receives email on new lead
- [ ] Customer receives confirmation email
- [ ] SMS sends for service bookings
- [ ] CRM webhook delivers lead data
- [ ] Failed webhooks are retried
```

---

## Phase 12: Analytics & Tracking

**Goal**: Implement comprehensive analytics for measuring KPIs.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 12.1 | Google Analytics 4 | Page views, events setup |
| 12.2 | Conversion tracking | Form submissions as conversions |
| 12.3 | Event tracking | Button clicks, scroll depth, video plays |
| 12.4 | PostHog integration | Product analytics, session recordings |
| 12.5 | Admin analytics dashboard | Internal KPI display |
| 12.6 | UTM parameter handling | Campaign tracking |
| 12.7 | Cookie consent | GDPR/CCPA compliant consent banner |

### Deliverables

- [ ] GA4 tracking on all pages
- [ ] Conversion goals configured
- [ ] Event tracking for key interactions
- [ ] Cookie consent banner
- [ ] Admin analytics overview

### Checkpoint 12 Review

```
Before proceeding to Phase 13, verify:
- [ ] Page views appear in GA4
- [ ] Form submissions tracked as conversions
- [ ] Cookie consent shows on first visit
- [ ] Consent choice is remembered
- [ ] Admin dashboard shows key metrics
```

---

## Phase 13: AI Blog & Content Generation

**Goal**: Implement AI-assisted blog content creation with review workflow.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 13.1 | AI content generation | Generate blog drafts from prompts |
| 13.2 | Content review workflow | Draft → In Review → Approved/Rejected |
| 13.3 | Editorial UI | Review and edit AI content |
| 13.4 | Publish workflow | Approved content to blog |
| 13.5 | Content templates | Pre-defined prompt templates |
| 13.6 | SEO optimization | Auto-generate meta descriptions |
| 13.7 | Audit trail | Track content changes and approvals |

### Deliverables

- [ ] AI blog content generation
- [ ] Multi-step review workflow
- [ ] Editorial editing interface
- [ ] Publish to live blog
- [ ] Audit trail of all changes

### Checkpoint 13 Review

```
Before proceeding to Phase 14, verify:
- [ ] AI generates relevant blog content
- [ ] Review workflow status updates work
- [ ] Editor can modify AI content
- [ ] Approved content publishes to blog
- [ ] Audit trail records all actions
```

---

## Phase 14: Performance Optimization

**Goal**: Optimize for Core Web Vitals and overall performance.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 14.1 | Image optimization | WebP/AVIF, lazy loading, sizing |
| 14.2 | Code splitting | Dynamic imports, bundle analysis |
| 14.3 | Caching strategy | ISR, SWR, API caching |
| 14.4 | Font optimization | Subset fonts, font-display |
| 14.5 | Critical CSS | Above-the-fold CSS inlining |
| 14.6 | Performance monitoring | Real user metrics tracking |
| 14.7 | Lighthouse audits | Score improvements |

### Deliverables

- [ ] LCP < 2.5s on all pages
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse Performance score > 90
- [ ] Bundle size optimized

### Checkpoint 14 Review

```
Before proceeding to Phase 15, verify:
- [ ] Core Web Vitals pass on PageSpeed Insights
- [ ] Lighthouse score > 90 for Performance
- [ ] Images serve in modern formats
- [ ] No layout shifts on page load
- [ ] Time to Interactive < 3s
```

---

## Phase 15: Security & Compliance

**Goal**: Ensure application security and regulatory compliance.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 15.1 | Security headers | CSP, HSTS, X-Frame-Options |
| 15.2 | Input sanitization | XSS prevention |
| 15.3 | SQL injection prevention | Parameterized queries (Prisma handles) |
| 15.4 | Rate limiting | API endpoint protection |
| 15.5 | HTTPS enforcement | SSL/TLS configuration |
| 15.6 | Data privacy audit | PII handling, retention policies |
| 15.7 | Accessibility audit | WCAG 2.1 AA compliance |
| 15.8 | Security testing | OWASP top 10 checks |

### Deliverables

- [ ] Security headers configured
- [ ] Rate limiting on sensitive endpoints
- [ ] HTTPS enforced
- [ ] Privacy policy implemented
- [ ] Accessibility audit passed
- [ ] No critical security vulnerabilities

### Checkpoint 15 Review

```
Before proceeding to Phase 16, verify:
- [ ] Security headers present (check securityheaders.com)
- [ ] Rate limiting blocks excessive requests
- [ ] No XSS vulnerabilities found
- [ ] Accessibility score > 90 on Lighthouse
- [ ] Privacy policy and terms pages exist
```

---

## Phase 16: Launch Preparation

**Goal**: Final testing, content migration, and production deployment.

### Tasks

| # | Task | Description |
|---|------|-------------|
| 16.1 | End-to-end testing | Full user journey tests |
| 16.2 | Cross-browser testing | Chrome, Firefox, Safari, Edge |
| 16.3 | Mobile device testing | iOS Safari, Android Chrome |
| 16.4 | Content migration | Load production content |
| 16.5 | DNS configuration | Domain setup, SSL certificates |
| 16.6 | Production environment | Final environment variables |
| 16.7 | Monitoring setup | Error tracking, uptime monitoring |
| 16.8 | Soft launch | Limited release for final testing |
| 16.9 | Go live | Full production launch |

### Deliverables

- [ ] All E2E tests passing
- [ ] Cross-browser compatibility verified
- [ ] Production content loaded
- [ ] Domain configured and SSL active
- [ ] Monitoring and alerts configured
- [ ] Site live at production URL

### Checkpoint 16 (Final) Review

```
Launch readiness checklist:
- [ ] All previous checkpoints passed
- [ ] E2E tests pass in production environment
- [ ] Content reviewed and approved
- [ ] SSL certificate valid
- [ ] Error tracking active
- [ ] Uptime monitoring configured
- [ ] Rollback plan documented
- [ ] Team trained on admin functions
```

---

## Summary Timeline

| Phase | Name | Key Deliverable |
|-------|------|-----------------|
| 1 | Project Foundation | Next.js app with Prisma |
| 2 | Database & API | Working API endpoints |
| 3 | Model Catalog | Public browsing experience |
| 4 | Offers & EMI | Promotions and calculators |
| 5 | Lead Capture | Test drive and inquiry forms |
| 6 | Service Booking | Service appointment scheduling |
| 7 | Auth & Admin | Admin login and dashboard |
| 8 | Lead Management | Lead tracking interface |
| 9 | Content Management | CMS for offers and blog |
| 10 | Chatbot | AI-powered customer support |
| 11 | Notifications | Email, SMS, CRM integration |
| 12 | Analytics | Tracking and reporting |
| 13 | AI Blog | Content generation workflow |
| 14 | Performance | Core Web Vitals optimization |
| 15 | Security | Compliance and hardening |
| 16 | Launch | Production deployment |

---

## How to Use This Plan

1. **Review each phase** before starting implementation
2. **Complete all tasks** within a phase before the checkpoint
3. **Run checkpoint verification** to confirm readiness
4. **Get approval** before proceeding to next phase
5. **Document any issues** or deviations from plan

---

## Approval

**Approve to begin Phase 1?**

- [ ] Yes, proceed with implementation
- [ ] No, modifications needed (specify below)

**Notes/Modifications:**

```
[Add any modifications or notes here]
```
