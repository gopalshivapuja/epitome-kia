# Implementation Plan — Epitome Kia Website

## Overview

This document outlines the implementation plan aligned with the PRD phases, structured for **weekly shipping** after the initial Railway deployment.

---

## Current Status: Phase 1 Complete

| PRD Phase | Status | Description |
|-----------|--------|-------------|
| **Phase 1: Foundation** | ✅ **COMPLETE** | Core website, lead capture, admin dashboard |
| Phase 2: AI & Engagement | 🔜 Next | Chatbot, 360° viewer, content sync |
| Phase 3: Self-Service & DMS | ⏳ Planned | Customer portal, DMS integration |
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

### Database & API Layer

| Endpoint | Methods | Status |
|----------|---------|--------|
| `/api/models` | GET | ✅ |
| `/api/models/[slug]` | GET | ✅ |
| `/api/leads` | GET, POST | ✅ |
| `/api/leads/[id]` | GET, PATCH, DELETE | ✅ |
| `/api/test-drive` | GET, POST | ✅ |
| `/api/test-drive/[id]` | GET, PATCH, DELETE | ✅ |
| `/api/service-booking` | GET, POST | ✅ |
| `/api/service-booking/[id]` | GET, PATCH, DELETE | ✅ |
| `/api/offers` | GET, POST | ✅ |
| `/api/offers/[id]` | GET, PATCH, DELETE | ✅ |
| `/api/pages` | GET, POST | ✅ |
| `/api/pages/[id]` | GET, PATCH, DELETE | ✅ |
| `/api/blog-posts` | GET, POST | ✅ |
| `/api/blog-posts/[id]` | GET, PATCH, DELETE | ✅ |
| `/api/emi` | POST | ✅ |
| `/api/newsletter` | POST | ✅ |
| `/api/health` | GET | ✅ |
| `/api/auth/*` | NextAuth | ✅ |

---

## Weekly Shipping Schedule

After Phase 1 deployment, features will ship on a weekly cadence.

### Week 1: Production Deployment
**Target**: Deploy Phase 1 to Railway

| Task | Description | Status |
|------|-------------|--------|
| Railway setup | Create project, add PostgreSQL | ⏳ |
| Environment variables | NEXTAUTH_SECRET, RESEND_API_KEY | ⏳ |
| Database migration | Run `prisma migrate deploy` | ⏳ |
| Seed data | Run `prisma db seed` | ⏳ |
| Verify health check | GET /api/health returns 200 | ⏳ |
| Test all forms | Test drive, service, contact | ⏳ |
| Admin login test | Verify auth flow | ⏳ |
| Custom domain | Configure DNS (optional) | ⏳ |

### Week 2: Content Management UI
**Target**: Admin can create/edit content without code

| Task | Description | Priority |
|------|-------------|----------|
| Rich text editor | Install Tiptap or TinyMCE | HIGH |
| Offer create/edit form | Admin UI for offers | HIGH |
| Page create/edit form | Admin UI for static pages | HIGH |
| Blog post editor | Admin UI for blog posts | MEDIUM |
| Image upload | S3/Cloudinary integration | MEDIUM |

### Week 3: Performance & Images
**Target**: Production-ready performance

| Task | Description | Priority |
|------|-------------|----------|
| Real model images | Upload Kia vehicle images | HIGH |
| Image optimization | WebP conversion, sizing | HIGH |
| Lighthouse audit | Target 90+ score | HIGH |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1 | HIGH |
| Error tracking | Sentry integration | MEDIUM |

### Week 4: Notifications & Email
**Target**: Full email notification system

| Task | Description | Priority |
|------|-------------|----------|
| Email templates | Styled HTML emails | HIGH |
| Lead notifications | Email to sales team | HIGH |
| Customer confirmations | Booking confirmation emails | HIGH |
| SMS integration | Twilio for SMS (optional) | LOW |

### Week 5+: Phase 2 Features
**Target**: Begin AI & Engagement phase

| Feature | Description | Priority |
|---------|-------------|----------|
| AI Chatbot | Vercel AI SDK + Claude | HIGH |
| 360° Vehicle Viewer | Pannellum integration | HIGH |
| Competitor comparison | Side-by-side specs | MEDIUM |
| Personalized recommendations | Based on browsing | MEDIUM |

---

## Phase 2: AI & Engagement (Weeks 5-10)

**PRD Alignment**: Phase 2 features from PRD.md

| Feature | PRD Priority | Status |
|---------|--------------|--------|
| AI Chatbot (text-based) | P1 | ⏳ Week 5-6 |
| 360° Vehicle Viewer | P1 | ⏳ Week 6-7 |
| Personalized recommendations | P1 | ⏳ Week 7-8 |
| Kia India content auto-sync | P1 | ⏳ Week 8-9 |
| Competitor comparison tool | P1 | ⏳ Week 9-10 |
| AI Blog content generation | P2 | ⏳ Week 10+ |
| RAG-based manual query | P2 | ⏳ Future |
| Google Sign-On | P2 | ⏳ Future |
| Customer reviews integration | P2 | ⏳ Future |

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

### Outstanding

| Issue | Priority | Notes |
|-------|----------|-------|
| Placeholder model images | HIGH | Need real Kia vehicle images |
| CAPTCHA on forms | MEDIUM | Add reCAPTCHA for production |
| Rich text editor | HIGH | Needed for content management |
| Image upload to cloud | MEDIUM | S3/Cloudinary setup |
| Accessibility audit | MEDIUM | WCAG 2.1 AA compliance |

---

## Success Metrics

### Phase 1 KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load time | < 3s | Lighthouse |
| Mobile score | > 90 | Lighthouse |
| Form submission rate | > 5% | GA4 conversions |
| Admin response time | < 24h | Internal SLA |

### Weekly Review Checklist

- [ ] All forms working in production
- [ ] No critical errors in logs
- [ ] Lighthouse score maintained
- [ ] New features documented
- [ ] User feedback reviewed

---

## How to Use This Plan

1. **Week 1**: Deploy to Railway following DEPLOYMENT.md
2. **Weekly**: Pick tasks from current week's section
3. **Review**: Update status after each feature ships
4. **Adapt**: Reprioritize based on user feedback
5. **Document**: Update CLAUDE.md with new patterns

---

## Changelog

| Date | Update |
|------|--------|
| Dec 2024 | Phase 1 marked complete, added weekly shipping structure |
| Dec 2024 | Aligned with PRD phases |
| Dec 2024 | Added Google Maps URLs for all locations |
| Dec 2024 | Created ARCHITECTURE.md |
| Dec 2024 | Added newsletter, FAQ, compare, E2E tests, unit tests |
| Dec 2024 | Fixed Google Maps API key exposure, added sitemap/robots |
| Dec 2024 | Updated all documentation for Phase 2 readiness |
