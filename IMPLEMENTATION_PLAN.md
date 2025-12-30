# Implementation Plan — Epitome Kia Website

## Overview

This document outlines the implementation plan aligned with the PRD phases, structured for **weekly shipping** after the initial Railway deployment.

---

## Current Status: Phase 2 Complete

| PRD Phase | Status | Description |
|-----------|--------|-------------|
| **Phase 1: Foundation** | ✅ **COMPLETE** | Core website, lead capture, admin dashboard |
| **Phase 2: AI & Engagement** | ✅ **COMPLETE** | Chatbot, 360° viewer, configurator, recommendations |
| Phase 3: Self-Service & DMS | 🔜 Next | Customer portal, DMS integration |
| Phase 4: Commerce & Insurance | ⏳ Planned | Accessories store, insurance |
| Phase 5: Advanced Experience | ⏳ Future | Mobile app, AR features |

---

## Phase 1: Foundation ✅ COMPLETED

**Goal**: Essential dealership website with lead capture and admin dashboard.

### Completed Features

| Feature | Status | Location |
|---------|--------|----------|
| Model catalog with specs, pricing | ✅ | `/models`, `/models/[slug]` |
| Test drive scheduling | ✅ | `/test-drive`, `/api/test-drive` |
| Service booking | ✅ | `/service`, `/api/service-booking` |
| EMI calculator | ✅ | `/emi-calculator`, embedded on models |
| Contact forms and lead capture | ✅ | `/contact`, `/api/leads` |
| WhatsApp integration (click-to-chat) | ✅ | Floating button in layout |
| Basic admin dashboard | ✅ | `/admin/(dashboard)/*` |
| Google Analytics integration | ✅ | Layout component |
| Mobile-responsive design | ✅ | All pages |
| SEO optimization | ✅ | Meta tags, semantic HTML |
| Social media links | ✅ | Footer component |
| Google Maps dealer locator | ✅ | Contact page, all 5 locations |
| Privacy policy & Terms | ✅ | `/privacy`, `/terms` |
| Cookie consent banner | ✅ | CookieConsent component |
| Security headers | ✅ | Middleware (CSP, X-Frame-Options) |
| Rate limiting | ✅ | API routes |
| Authentication (Admin) | ✅ | NextAuth.js v5 |
| Newsletter subscription | ✅ | Footer + `/api/newsletter` |
| FAQ page | ✅ | `/faq` with accordion UI |
| Model comparison tool | ✅ | `/compare` page |
| SEO sitemap & robots | ✅ | `sitemap.ts`, `robots.ts` |
| E2E testing (Playwright) | ✅ | `tests/e2e/` |
| Unit testing (Vitest) | ✅ | `tests/unit/` |
| Tesla-inspired redesign | ✅ | White theme, fullscreen sections |

---

## Phase 2: AI & Engagement ✅ COMPLETED (Dec 2024)

**Goal**: AI-powered features, engagement tools, and content management.

### Completed Features

| Feature | Status | Location | Description |
|---------|--------|----------|-------------|
| AI Chatbot (RAG-based) | ✅ | `/components/features/AIChat` | OpenAI GPT-4 with Kia knowledge base |
| Customer Reviews Integration | ✅ | `/components/features/GoogleReviews` | Google Places API integration |
| AI Blog Curation | ✅ | `/blog`, `/admin/blog` | AI-curated external articles |
| Google Sign-On | ✅ | `/login`, `/profile` | Google OAuth for customers |
| Price/Availability Alerts | ✅ | `/api/alerts`, `PriceAlertButton` | Email notification subscriptions |
| Competitor Comparison Tool | ✅ | `/compare` | Compare Kia vs competitors |
| 360° Vehicle Viewer | ✅ | `Vehicle360Viewer` component | Drag-to-rotate, fullscreen gallery |
| Vehicle Configurator | ✅ | `/configure/[slug]` | Model → Variant → Color → Accessories |
| Personalized Recommendations | ✅ | `lib/tracking/`, `SmartNudge` | Behavior tracking, AI suggestions |
| Kia India Auto-Sync | ✅ | `/api/admin/sync`, `SyncDashboard` | Scraper for kia.com/in data |

### New API Endpoints (Phase 2)

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/chat` | POST | AI chatbot with RAG |
| `/api/auth/customer/[...nextauth]` | * | Customer Google OAuth |
| `/api/customer` | GET, PATCH | Customer profile management |
| `/api/alerts` | GET, POST, PATCH, DELETE | Price/availability alerts |
| `/api/recommendations` | POST | AI-powered recommendations |
| `/api/configure` | GET, POST | Save/load vehicle configurations |
| `/api/admin/sync` | POST | Trigger Kia India sync |
| `/api/admin/sync/status` | GET | Get sync logs and status |
| `/api/competitors` | GET | Competitor model data |

### New Components (Phase 2)

| Component | Location | Purpose |
|-----------|----------|---------|
| `AIChat` | `components/features/AIChat.tsx` | Floating AI chatbot |
| `GoogleReviews` | `components/features/GoogleReviews.tsx` | Display Google reviews |
| `Vehicle360Viewer` | `components/features/Vehicle360Viewer.tsx` | 360° image viewer |
| `PriceAlertButton` | `components/features/PriceAlertButton.tsx` | Alert subscription modal |
| `SmartNudge` | `components/features/SmartNudge.tsx` | Context-aware prompts |
| `RecentlyViewed` | `components/features/RecentlyViewed.tsx` | Browsing history bar |
| `RecommendationBar` | `components/features/RecommendationBar.tsx` | AI recommendations |
| `SyncDashboard` | `components/admin/SyncDashboard.tsx` | Admin sync management |
| `GoogleSignInButton` | `components/auth/GoogleSignInButton.tsx` | OAuth login button |
| `UserMenu` | `components/auth/UserMenu.tsx` | Customer account dropdown |

### New Database Models (Phase 2)

```prisma
- Customer (Google OAuth users)
- AlertSubscription (price/availability alerts)
- VehicleConfiguration (saved configurations)
- CompetitorModel (competitor data)
- UserPreference (tracking data)
- SyncLog (sync audit trail)
- CarModelImage (360° images)
```

---

## Phase 3: Self-Service & DMS (Future)

**PRD Alignment**: Phase 3 features from PRD.md

| Feature | PRD Priority | Notes |
|---------|--------------|-------|
| Kia DMS Integration | P1 | Requires dealership DMS access |
| Customer Portal (My Garage) | P1 | After DMS integration |
| Service history & tracking | P1 | Depends on DMS |
| AI Voice Agent | P1 | Sarvam AI integration |
| Car Exchange Estimator | P1 | OBV API integration |
| Social Media Management | P2 | Admin scheduling tools |

---

## Phase 4: Commerce & Insurance (Future)

**PRD Alignment**: Phase 4 features from PRD.md

| Feature | PRD Priority | Notes |
|---------|--------------|-------|
| Kia Accessories ecommerce | P1 | Razorpay integration |
| SMC Insurance integration | P1 | API partnership required |
| Order management dashboard | P1 | After ecommerce |
| Shiprocket logistics | P1 | After ecommerce |

---

## Phase 5: Advanced Experience (Future)

| Feature | PRD Priority | Notes |
|---------|--------------|-------|
| Mobile App (React Native) | P2 | Long-term |
| AR vehicle visualization | P2 | WebXR or native |
| Virtual test drive | P3 | Future consideration |
| Loyalty program | P2 | Requires customer accounts |

---

## Technical Debt & Known Issues

### Resolved ✅

| Issue | Resolution | Date |
|-------|------------|------|
| Missing Google Maps URLs | Added all 5 locations | Dec 2024 |
| Contact form field mismatch | Fixed `name` → `fullName` | Dec 2024 |
| Placeholder phone numbers | Updated with real numbers | Dec 2024 |
| GA not rendered in layout | Added to JSX | Dec 2024 |
| Non-functional admin buttons | Wired to API endpoints | Dec 2024 |
| E2E tests missing | Added Playwright test suite | Dec 2024 |
| Unit tests missing | Added Vitest with component tests | Dec 2024 |
| Missing sitemap | Added `src/app/sitemap.ts` | Dec 2024 |
| Missing robots.txt | Added `src/app/robots.ts` | Dec 2024 |
| Google Maps API key exposed | Moved to environment variable | Dec 2024 |
| Missing .env.example | Created with all required vars | Dec 2024 |
| ESLint conditional hooks error | Moved useMemo before early return | Dec 2024 |

### Outstanding

| Issue | Priority | Notes |
|-------|----------|-------|
| Placeholder model images | HIGH | Need real Kia vehicle images |
| CAPTCHA on forms | MEDIUM | Add reCAPTCHA for production |
| Rich text editor | HIGH | Needed for content management |
| Image upload to cloud | MEDIUM | S3/Cloudinary setup |
| Accessibility audit | MEDIUM | WCAG 2.1 AA compliance |
| 360° images for viewer | MEDIUM | Need multi-angle photos per model |

---

## Success Metrics

### Phase 1 KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load time | < 3s | Lighthouse |
| Mobile score | > 90 | Lighthouse |
| Form submission rate | > 5% | GA4 conversions |
| Admin response time | < 24h | Internal SLA |

### Phase 2 KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Chatbot engagement | > 10% visitors | Analytics |
| Configurator completions | > 5% | Conversion tracking |
| Alert subscriptions | > 100/month | Database count |
| Recommendation click rate | > 3% | Tracking events |

---

## Environment Variables Required

### Phase 1
```env
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
RESEND_API_KEY
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

### Phase 2 (Additional)
```env
OPENAI_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_PLACES_API_KEY
```

---

## Changelog

| Date | Update |
|------|--------|
| Dec 2024 | Phase 1 marked complete |
| Dec 2024 | Phase 2 started - AI features, engagement tools |
| Dec 30, 2024 | **Phase 2 COMPLETE** - All features implemented |
| Dec 30, 2024 | Added: AI Chatbot, Google Sign-On, Vehicle Configurator |
| Dec 30, 2024 | Added: Price Alerts, Competitor Comparison, 360° Viewer |
| Dec 30, 2024 | Added: Personalized Recommendations, Kia India Auto-Sync |
| Dec 30, 2024 | Fixed ESLint errors for CI deployment |
