# Phase 2 Development Plan — Epitome Kia Website

## Overview

This plan covers all remaining features from Phase 1 deferrals plus new customer-delighting innovations. Features are prioritized by impact and complexity.

---

## What Was Deferred from Phase 1

### Partially Completed
| Feature | Status | What's Missing |
|---------|--------|----------------|
| Lead Management (Phase 8) | 70% | Lead detail view, status updates, CSV export, assignment |
| Content Management (Phase 9) | 30% | Rich text editor, CRUD forms, media upload, SEO fields |
| Email Notifications (Phase 11) | 60% | SMS via Twilio, CRM webhooks, notification preferences |
| Analytics (Phase 12) | 40% | Event tracking, conversion goals, cookie consent, admin dashboard |

### Not Started
| Feature | Phase | Priority |
|---------|-------|----------|
| AI Chatbot | 10 | HIGH |
| AI Blog & Content Generation | 13 | MEDIUM |
| Model Comparison Tool | 3 | MEDIUM |
| CAPTCHA Integration | 5 | HIGH |
| Pickup/Drop-off Service | 6 | LOW |
| Performance Optimization | 14 | HIGH |
| Security Hardening | 15 | HIGH |
| E2E Testing | 16 | MEDIUM |

---

## Phase 2 Development Modules

### Module A: AI Chatbot (HIGH PRIORITY)
**Estimated Effort: 3-4 days**

The chatbot is a key differentiator. [Studies show](https://www.turbomarketingsolutions.com/single-post/2024-car-dealerships-evolving-consumer-expectations-and-future-trends) AI chatbots offering 24/7 service are valuable since many shoppers browse after business hours.

| Task | Description |
|------|-------------|
| A.1 | Create floating chat widget component |
| A.2 | Build streaming chat API route using Vercel AI SDK |
| A.3 | Integrate Claude/OpenAI for responses |
| A.4 | Create dealership-specific system prompt with model/offer knowledge |
| A.5 | Implement lead capture flow within chat |
| A.6 | Save chat sessions to database |
| A.7 | Add "Request callback" handoff to human |
| A.8 | Build admin chat transcript viewer |

**API Keys Required:**
- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`

**Deliverables:**
- [ ] Chat widget appears on all public pages
- [ ] Bot answers questions about models, offers, service, financing
- [ ] Captures leads during conversation
- [ ] Chat history viewable in admin

---

### Module B: Complete Lead Management (MEDIUM PRIORITY)
**Estimated Effort: 2 days**

| Task | Description |
|------|-------------|
| B.1 | Lead detail page with full information and activity history |
| B.2 | Status workflow (new → contacted → qualified → converted/lost) |
| B.3 | Add notes to leads |
| B.4 | Lead assignment to staff members |
| B.5 | CSV export functionality |
| B.6 | Email/call logging |
| B.7 | Bulk status updates |

**Deliverables:**
- [ ] Click lead → see full detail with timeline
- [ ] Update status with dropdowns
- [ ] Export leads to CSV
- [ ] Assign leads to team members

---

### Module C: Full Content Management System (MEDIUM PRIORITY)
**Estimated Effort: 3 days**

| Task | Description |
|------|-------------|
| C.1 | Install Tiptap rich text editor |
| C.2 | Offers CRUD (create, edit, delete) with form validation |
| C.3 | Blog post CRUD with draft/publish workflow |
| C.4 | Pages CRUD for static content |
| C.5 | FAQ management per page |
| C.6 | Media library with image upload (Cloudinary/R2) |
| C.7 | SEO fields (meta title, description, OG image) |
| C.8 | Preview mode for unpublished content |

**Deliverables:**
- [ ] Create/edit offers from admin
- [ ] Write blog posts with rich formatting
- [ ] Upload and manage images
- [ ] Edit SEO metadata

---

### Module D: AI Content Generation (MEDIUM PRIORITY)
**Estimated Effort: 2 days**

[AI-driven content generation](https://blog.vehiso.com/10-must-have-features-for-a-car-dealership-website-in-2025/) helps dealerships maintain fresh content.

| Task | Description |
|------|-------------|
| D.1 | AI blog post generator from prompts |
| D.2 | Content templates (new model launch, tips, promotions) |
| D.3 | Review workflow (draft → in_review → approved/rejected) |
| D.4 | Editorial editing interface |
| D.5 | Auto-generate meta descriptions |
| D.6 | Audit trail for all content changes |

**Deliverables:**
- [ ] Generate blog draft from topic prompt
- [ ] Multi-step approval workflow
- [ ] Publish approved content to blog

---

### Module E: SMS Notifications & CRM Integration (MEDIUM PRIORITY)
**Estimated Effort: 1-2 days**

| Task | Description |
|------|-------------|
| E.1 | Twilio SMS integration |
| E.2 | SMS confirmations for test drives and service bookings |
| E.3 | SMS reminders (day before appointment) |
| E.4 | CRM webhook integration (send leads to external CRM) |
| E.5 | Webhook retry logic with exponential backoff |
| E.6 | Notification preferences in admin settings |

**API Keys Required:**
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `CRM_WEBHOOK_URL` (optional)

**Deliverables:**
- [ ] Customers receive SMS booking confirmations
- [ ] Leads sync to external CRM
- [ ] Admin can configure notification settings

---

### Module F: Advanced Analytics (MEDIUM PRIORITY)
**Estimated Effort: 1-2 days**

| Task | Description |
|------|-------------|
| F.1 | Enhanced GA4 event tracking (button clicks, form interactions) |
| F.2 | Conversion goals for test drives, service bookings, leads |
| F.3 | UTM parameter capture and storage with leads |
| F.4 | Cookie consent banner (GDPR/CCPA compliant) |
| F.5 | Admin analytics dashboard with KPI cards |
| F.6 | PostHog integration for session recordings (optional) |

**Deliverables:**
- [ ] Track all key user interactions
- [ ] Cookie consent before analytics
- [ ] Admin sees conversion metrics

---

### Module G: Security & Compliance (HIGH PRIORITY)
**Estimated Effort: 1-2 days**

| Task | Description |
|------|-------------|
| G.1 | reCAPTCHA on all public forms |
| G.2 | Security headers (CSP, HSTS, X-Frame-Options) |
| G.3 | API rate limiting |
| G.4 | Input sanitization audit |
| G.5 | Privacy policy page |
| G.6 | Terms of service page |
| G.7 | Accessibility audit (WCAG 2.1 AA) |

**Deliverables:**
- [ ] Forms protected from spam
- [ ] Security headers pass securityheaders.com
- [ ] Privacy policy and terms pages

---

### Module H: Performance Optimization (HIGH PRIORITY)
**Estimated Effort: 1-2 days**

[53% of users abandon sites taking >3 seconds to load](https://www.turbomarketingsolutions.com/single-post/2024-car-dealerships-evolving-consumer-expectations-and-future-trends).

| Task | Description |
|------|-------------|
| H.1 | Image optimization (WebP/AVIF, responsive sizes) |
| H.2 | Bundle analysis and code splitting |
| H.3 | Lazy loading for below-fold content |
| H.4 | Font subsetting and optimization |
| H.5 | Caching headers and ISR configuration |
| H.6 | Core Web Vitals monitoring |

**Deliverables:**
- [ ] Lighthouse Performance score > 90
- [ ] LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## NEW Customer-Delighting Features

Based on [2024-2025 automotive industry trends](https://insidea.com/blog/marketing/car-dealerships/website-design-ideas-for-automotive-industry/):

### Module I: 360° Vehicle Viewer (HIGH IMPACT)
**Estimated Effort: 2-3 days**

[Dealerships with VR/AR experiences see 20% higher conversions](https://www.krishtechnolabs.com/blog/role-of-ar-vr-in-automotive-dealerships/).

| Task | Description |
|------|-------------|
| I.1 | 360° exterior spin viewer for each model |
| I.2 | Interactive interior panorama |
| I.3 | Color/trim switcher with real-time preview |
| I.4 | Hotspots highlighting key features |
| I.5 | Mobile-optimized touch controls |

**Implementation Options:**
- Pannellum.js (open source, free)
- Spyne.ai API (paid, professional)
- Custom Three.js viewer

**Deliverables:**
- [ ] Users can spin vehicles 360° on model pages
- [ ] View interior from driver seat perspective
- [ ] Change colors and see preview

---

### Module J: Smart Vehicle Comparison (MEDIUM IMPACT)
**Estimated Effort: 1-2 days**

| Task | Description |
|------|-------------|
| J.1 | Compare up to 3 models side-by-side |
| J.2 | Highlight differences in specs |
| J.3 | Price comparison with EMI estimates |
| J.4 | Share comparison via link |
| J.5 | "Add to compare" from model cards |

**Deliverables:**
- [ ] Compare page at /compare
- [ ] Side-by-side spec table
- [ ] Shareable comparison links

---

### Module K: Personalized Recommendations (HIGH IMPACT)
**Estimated Effort: 2 days**

[79% of dealers believe digital personalization improves efficiency](https://www.spyne.ai/blogs/virtual-car-showroom).

| Task | Description |
|------|-------------|
| K.1 | Track user browsing behavior (models viewed, time spent) |
| K.2 | "Recommended for you" section on homepage |
| K.3 | Personalized offer suggestions based on viewed models |
| K.4 | "Recently viewed" component |
| K.5 | Email follow-up with personalized content |

**Deliverables:**
- [ ] Homepage shows personalized model recommendations
- [ ] Recently viewed models sidebar
- [ ] Targeted offers based on interests

---

### Module L: WhatsApp Integration (HIGH IMPACT - India)
**Estimated Effort: 1 day**

| Task | Description |
|------|-------------|
| L.1 | WhatsApp click-to-chat button |
| L.2 | Pre-filled messages based on page context |
| L.3 | WhatsApp Business API for automated responses |
| L.4 | Share model/offer details via WhatsApp |

**Deliverables:**
- [ ] WhatsApp button on all pages
- [ ] One-click to message dealership
- [ ] Context-aware pre-filled messages

---

### Module M: Virtual Appointment Booking (MEDIUM IMPACT)
**Estimated Effort: 1 day**

| Task | Description |
|------|-------------|
| M.1 | Video call scheduling for remote consultations |
| M.2 | Calendar integration (Google Calendar) |
| M.3 | Send meeting links automatically |
| M.4 | Virtual showroom walkthrough option |

**Deliverables:**
- [ ] Book video consultation from website
- [ ] Automatic calendar invites

---

### Module N: Customer Reviews & Testimonials (MEDIUM IMPACT)
**Estimated Effort: 1 day**

[Building trust with reviews and social proof](https://space.auto/building-the-best-dealership-website-lessons-from-carvana-digital-strategies/) is crucial for conversions.

| Task | Description |
|------|-------------|
| N.1 | Google Reviews integration |
| N.2 | Testimonials carousel on homepage |
| N.3 | Model-specific reviews |
| N.4 | Review request emails after purchase/service |

**Deliverables:**
- [ ] Display Google ratings on site
- [ ] Customer testimonials section

---

### Module O: Price Drop & Availability Alerts (MEDIUM IMPACT)
**Estimated Effort: 1 day**

| Task | Description |
|------|-------------|
| O.1 | "Notify me" for models not in stock |
| O.2 | Price drop alerts for interested customers |
| O.3 | New offer notifications |
| O.4 | Email/SMS alert preferences |

**Deliverables:**
- [ ] Subscribe to model availability
- [ ] Get notified when prices change

---

## Recommended Implementation Order

### Sprint 1: Foundation & Security (Week 1)
1. **Module G** - Security & Compliance (CAPTCHA, headers)
2. **Module H** - Performance Optimization
3. **Module F** - Cookie consent banner

### Sprint 2: AI & Engagement (Week 2)
4. **Module A** - AI Chatbot (main differentiator)
5. **Module L** - WhatsApp Integration (quick win for India)

### Sprint 3: Admin Capabilities (Week 3)
6. **Module B** - Complete Lead Management
7. **Module C** - Full CMS with rich text editor
8. **Module E** - SMS notifications

### Sprint 4: Content & Intelligence (Week 4)
9. **Module D** - AI Content Generation
10. **Module K** - Personalized Recommendations

### Sprint 5: Rich Media Experience (Week 5)
11. **Module I** - 360° Vehicle Viewer
12. **Module J** - Vehicle Comparison Tool

### Sprint 6: Customer Engagement (Week 6)
13. **Module N** - Reviews & Testimonials
14. **Module O** - Price/Availability Alerts
15. **Module M** - Virtual Appointments

---

## Environment Variables Required

```bash
# AI (for Chatbot & Content Generation)
ANTHROPIC_API_KEY="sk-ant-..."        # Claude API
OPENAI_API_KEY="sk-..."               # Or OpenAI API

# SMS Notifications
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1..."

# Media Storage
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="..."
RECAPTCHA_SECRET_KEY="..."

# CRM Integration (optional)
CRM_WEBHOOK_URL="https://..."
```

---

## Success Metrics

| Feature | KPI | Target |
|---------|-----|--------|
| AI Chatbot | Chat-to-lead conversion | 15%+ |
| 360° Viewer | Time on model page | +40% |
| Personalization | Return visitor rate | +25% |
| WhatsApp | Click-to-chat rate | 10%+ |
| Performance | Core Web Vitals | All green |
| Comparison Tool | Usage rate | 20% of visitors |

---

## Approval

**Ready to proceed with Phase 2 development?**

- [ ] Approve all modules as planned
- [ ] Approve with modifications (specify below)
- [ ] Prioritize specific modules only

**Selected Modules for Implementation:**
```
[List modules to implement first]
```

**Notes/Modifications:**
```
[Add any changes or priorities here]
```

---

## Sources

- [2024-2025 Car Dealership Trends](https://www.turbomarketingsolutions.com/single-post/2024-car-dealerships-evolving-consumer-expectations-and-future-trends)
- [Must-Have Dealership Website Features](https://blog.vehiso.com/10-must-have-features-for-a-car-dealership-website-in-2025/)
- [AR/VR in Automotive Dealerships](https://www.krishtechnolabs.com/blog/role-of-ar-vr-in-automotive-dealerships/)
- [Virtual Car Showrooms](https://www.spyne.ai/blogs/virtual-car-showroom)
- [Building the Best Dealership Website](https://space.auto/building-the-best-dealership-website-lessons-from-carvana-digital-strategies/)
- [Website Design Ideas for Car Dealerships](https://insidea.com/blog/marketing/car-dealerships/website-design-ideas-for-automotive-industry/)
