# Product Requirements Document (PRD) — Epitome Kia Website

## Overview
Build a world-class dealership website experience for Epitome Kia that drives vehicle discovery, lead capture, test drives, service bookings, insurance, accessories sales, and vehicle exchange while aligning with Kia brand standards. The site integrates national Kia content with local dealership offers, features AI-powered customer assistance, immersive vehicle experiences, full self-service capabilities across multiple channels, and supports operational workflows for staff.

---

## 🎯 Core Architecture Principle: Dynamic & Self-Updating

> **"The website should be a living, breathing entity that automatically stays current with minimal manual intervention, while maintaining human oversight for critical decisions."**

### Philosophy
This website is designed to be **maximally dynamic** — continuously scraping, syncing, and updating content from authoritative sources. The goal is to eliminate stale content, reduce manual data entry, and ensure customers always see the most accurate, up-to-date information.

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Automation First** | Every piece of content that CAN be automated, SHOULD be automated |
| **Single Source of Truth** | Data flows from authoritative sources (Kia India, OBV, CarDekho) to our database |
| **Human-in-the-Loop** | Critical changes require human approval before going live |
| **Graceful Degradation** | If scraping fails, show cached data with staleness indicator |
| **Audit Trail** | Every automated change is logged for compliance and debugging |
| **Smart Notifications** | Alert humans only when their attention is truly needed |

### What Gets Automated vs. Human-Approved

| Content Type | Automation Level | Human Review |
|--------------|------------------|--------------|
| Model specs & features | 🟢 Full auto | Only on major changes |
| Ex-showroom pricing | 🟡 Auto with approval | Price changes flagged for review |
| Competitor data | 🟢 Full auto | Weekly summary review |
| Exchange valuations | 🟢 Full auto (algorithm) | Final offers need approval |
| Offers & promotions | 🔴 Human created | Approval required |
| Blog content (AI) | 🟡 AI generated | Editorial approval required |
| Service slot availability | 🟢 Full auto (DMS sync) | No review needed |
| Insurance quotes | 🟢 Full auto (API) | No review needed |
| Customer reviews | 🟡 Auto-fetched | Moderation before display |
| Social media posts | 🟡 Scheduled by team | Approval workflow |
| Legal disclaimers | 🔴 Human managed | Legal review required |

---

## Goals / Non‑Goals

**Goals**
- Increase qualified leads (test drive requests, inquiries, service bookings).
- Provide clear, searchable model catalog with immersive 360° viewing experiences.
- Enable self‑serve financing exploration (EMI tools) and trade-in valuation.
- Deliver responsive, high‑performing UX on mobile and desktop.
- Support dealership operations via admin workflows and analytics.
- Provide AI-powered multilingual voice and text assistance 24/7.
- Automate content synchronization from Kia India official sources.
- Enable RAG-based intelligent querying of vehicle manuals and documentation.
- Deliver personalized experiences with behavior-based recommendations.
- Sell Kia accessories online with integrated logistics fulfillment.
- Manage vehicle insurance purchases and renewals with SMC Insurance integration.
- Enable competitor comparison to help customers make informed decisions.
- **NEW**: Provide instant car exchange/trade-in valuations using market data.
- **NEW**: Full self-service customer portal integrated with Dealer Management System.
- **NEW**: Comprehensive social media presence and management.
- **NEW**: Maintain a dynamic, self-updating website that automatically syncs from authoritative sources.
- **NEW**: Implement human-in-the-loop workflows for critical content changes and approvals.

**Non‑Goals**
- Full CRM replacement (site will integrate with existing CRM/DMS).
- Full inventory management system (pulls from existing data sources).
- Direct new vehicle online sales checkout (test drives and leads only for now).

---

## Personas

- **New Car Buyer**: researching Kia models and pricing, wants clarity, immersive experiences, and offers.
- **Returning Service Customer**: needs quick service booking and pickup details.
- **Leasing/Financing Shopper**: compares EMI options and incentives.
- **Tech-Savvy Shopper**: expects 360° views, AR experiences, and instant AI responses.
- **Non-English Speaker**: needs multilingual support via voice and text.
- **Accessories Buyer**: wants to purchase genuine Kia accessories online.
- **Insurance Customer**: needs to purchase or renew vehicle insurance easily.
- **Comparison Shopper**: wants to compare Kia models with competitors before deciding.
- **Exchange Customer**: wants to trade in their old car for a new Kia.
- **Social Media Follower**: engages with brand content on social platforms.
- **Self-Service Customer**: prefers managing everything online without calling.
- **Dealership Sales Manager**: monitors leads, offers, and model content.
- **Service Advisor**: tracks service requests and pickup scheduling.
- **Social Media Manager**: creates and schedules content across platforms.
- **Content Admin**: reviews automated content updates, approves changes, manages approval queue.

---

## User Journeys

1. **Model Discovery → Test Drive**
   - Landing page → 360° Model Viewer → Specs/Features → Offer highlights → Test drive CTA → Confirmation.

2. **Offer‑First Journey**
   - Offers page → Filter by model → View details → Lead form → CRM handoff.

3. **Financing Exploration**
   - Model detail → EMI calculator → Adjust terms → Save/share → Lead capture.

4. **Service Booking**
   - Service page → Select service → Pickup options → Schedule → Confirmation.

5. **AI Assistant Journey**
   - Chat/Voice initiated → FAQ/lead qualification → Manual/spec queries via RAG → Lead capture → Handoff to staff.

6. **Immersive Exploration**
   - 360° viewer → Configure colors/variants → Compare models → Get personalized recommendation → Test drive.

7. **Competitor Comparison Journey**
   - Model detail → "Compare with competitors" → Side-by-side with Hyundai/Tata/Honda → Kia advantages highlighted → Test drive CTA.

8. **Accessories Purchase Journey**
   - Accessories store → Browse by model/category → Add to cart → Checkout with Razorpay → Delivery tracking.

9. **Insurance Journey**
   - Insurance page → Get quote (SMC integration) → Purchase new policy → Track in account → Renewal reminders → Self-checkout renewal.

10. **Car Exchange Journey** (NEW)
    - Exchange page → Enter car details (make, model, year, KM) → Get instant valuation → Upload photos (optional) → Schedule inspection → Get final offer → Apply to new Kia purchase.

11. **Self-Service Portal Journey** (NEW)
    - Login → My Garage dashboard → View vehicles, service history, policies → Book service → Renew insurance → Buy accessories → Track orders → All without calling dealership.

---

## KPIs

- Test drive conversion rate
- Service booking rate
- AI chatbot/voice agent lead capture rate
- Offer click‑through rate (CTR)
- Model detail page engagement (time on page, scroll depth, 360° interaction)
- Lead form completion rate
- Call‑to‑action (CTA) click rate
- Mobile performance metrics (Core Web Vitals)
- RAG query satisfaction rate
- Voice agent interaction completion rate
- Personalization click-through rate
- Accessories store conversion rate
- Average order value (AOV) for accessories
- Insurance policy conversion rate
- Insurance renewal rate
- Competitor comparison to test drive conversion
- **NEW**: Exchange valuation completion rate
- **NEW**: Exchange lead to purchase conversion
- **NEW**: Self-service adoption rate (% actions done online vs phone)
- **NEW**: Social media engagement rate
- **NEW**: Social media follower growth
- **NEW**: Content freshness score (% of content updated within SLA)
- **NEW**: Scraper uptime and success rate
- **NEW**: Approval queue turnaround time
- **NEW**: Data accuracy rate (manual audits)
- **NEW**: Organic traffic growth rate
- **NEW**: Keywords ranking in top 10
- **NEW**: SEO health score (automated)
- **NEW**: Core Web Vitals pass rate

---

## Phased Implementation Roadmap

### Phase 1: Foundation & Core Features ✅ COMPLETE (Dec 2024)
*Focus: Essential dealership website with lead capture*

| Feature | Priority | Status |
|---------|----------|--------|
| Model catalog with specs, images, pricing | P1 | 🟢 |
| Test drive scheduling | P1 | 🟢 |
| Service booking | P1 | 🟢 |
| EMI calculator | P1 | 🟢 |
| Contact forms and lead capture | P1 | 🟢 |
| WhatsApp integration (click-to-chat) | P1 | 🟢 |
| Basic admin dashboard | P1 | 🟢 |
| Google Analytics integration | P1 | 🟢 |
| Mobile-responsive design | P1 | 🟢 |
| SEO optimization | P1 | 🟢 |
| Social media links on website | P1 | 🟢 |
| Google Maps dealer locator | P1 | 🟢 |

**Additional Phase 1 Deliverables:**
- Newsletter subscription with API
- FAQ page with accordion UI
- Model comparison tool
- E2E testing infrastructure (Playwright)
- Unit testing infrastructure (Vitest)
- sitemap.xml and robots.txt for SEO
- Tesla-inspired white theme redesign

### Phase 2: AI & Engagement (Months 3-6)
*Focus: AI-powered assistance and content automation*

| Feature | Priority | Status |
|---------|----------|--------|
| AI Chatbot (text-based) | P1 | 🔴 |
| 360° Vehicle Viewer | P1 | 🔴 |
| Personalized recommendations | P1 | 🔴 |
| Kia India content auto-sync | P1 | 🔴 |
| Competitor comparison tool | P1 | 🔴 |
| AI Blog content generation | P2 | 🔴 |
| RAG-based manual query | P2 | 🔴 |
| Google Sign-On | P2 | 🔴 |
| Customer reviews integration | P2 | 🔴 |
| Price/availability alerts | P2 | 🔴 |
| Vehicle configurator (Tesla-style) | P2 | 🔴 |

### Phase 3: Self-Service & DMS Integration (Months 6-9)
*Focus: Full customer self-service with DMS backend*

| Feature | Priority | Status |
|---------|----------|--------|
| Kia DMS Integration (Tekion/Dealerlogix) | P1 | 🔴 |
| Customer Portal (My Garage) | P1 | 🔴 |
| Service history & tracking | P1 | 🔴 |
| AI Voice Agent (multilingual) | P1 | 🔴 |
| Brand Mascot integration | P2 | 🔴 |
| **Car Exchange Estimator** | P1 | 🔴 |
| Social Media Management (Admin) | P2 | 🔴 |
| Omnichannel notifications (WhatsApp, SMS, Email) | P1 | 🔴 |
| Headless CMS migration | P2 | 🔴 |

### Phase 4: Commerce & Insurance (Months 9-12)
*Focus: Revenue generation through accessories and insurance*

| Feature | Priority | Status |
|---------|----------|--------|
| Kia Accessories ecommerce store | P1 | 🔴 |
| Razorpay payment integration | P1 | 🔴 |
| Shiprocket logistics integration | P1 | 🔴 |
| SMC Insurance integration | P1 | 🔴 |
| Insurance renewal tracking | P1 | 🔴 |
| Order management dashboard | P1 | 🔴 |
| GST invoicing | P1 | 🔴 |
| Cart abandonment recovery | P2 | 🔴 |

### Phase 5: Advanced Experience (Months 12-18)
*Focus: Premium features and mobile app*

| Feature | Priority | Status |
|---------|----------|--------|
| Mobile App (React Native) | P2 | 🔴 |
| AR vehicle visualization | P2 | 🔴 |
| Virtual test drive | P3 | 🔴 |
| Loyalty program | P2 | 🔴 |
| Community features | P3 | 🔴 |
| EV charging station map | P2 | 🔴 |
| Vehicle delivery tracker | P3 | 🔴 |

**Legend**: 🟢 Complete | 🟡 In Progress | 🔴 Planned

---

## Risks

- Data accuracy discrepancies between Kia national data and local dealership content.
- Compliance violations if brand/legal guidelines are not followed.
- Low chatbot/voice agent accuracy causing lead loss.
- Integration delays with CRM/DMS or inventory feeds.
- Performance issues on mobile due to heavy media assets (360° images, videos).
- RAG hallucinations or incorrect manual information.
- Voice recognition accuracy in noisy environments.
- Insurance API integration complexity with SMC.
- Logistics delays affecting accessories customer satisfaction.
- Competitor data accuracy and freshness.
- Payment security and PCI compliance for Razorpay.
- **NEW**: Exchange valuation accuracy affecting customer trust.
- **NEW**: DMS integration complexity and data sync issues.
- **NEW**: Social media content moderation and brand safety.

---

## Dependencies

- Kia national content feeds (models, specs, images).
- Kia India website for content scraping (models, pricing, manuals, images).
- **Kia-certified DMS** (Tekion ARC, Dealerlogix, Affinitiv, or ACS ACCESS).
- Dealership CRM/DMS integrations.
- Offers and incentives data source.
- Legal/brand compliance guidelines.
- Analytics and tracking setup (GA4, CRM tracking, call tracking).
- Sarvam AI or similar for multilingual TTS/STT.
- OpenAI/Anthropic for RAG and AI features.
- Google OAuth for social sign-on.
- Headless CMS (Sanity/Strapi) for content management.
- SMC Insurance API for motor insurance integration.
- Razorpay for payment processing.
- Shiprocket/Delhivery for logistics fulfillment.
- Google Maps API for location features.
- Competitor data sources (CarDekho, CarWale APIs or scraping).
- **NEW**: Used car valuation APIs (OBV, Spinny, or similar).
- **NEW**: Social media APIs (Facebook, Instagram, LinkedIn, YouTube).

---

# Feature Requirements

## 1. Model Catalog
- Search and filter by model type, price range, fuel type, transmission, features.
- Model detail pages with gallery, specs, variants, pricing, offers.
- **360° Vehicle Viewer** with interior/exterior views (HIGH PRIORITY - 20% higher conversions).
- Vehicle configurator for colors, variants, and accessories.
- Prominent CTAs: Test Drive, Get Quote, EMI Calculator, WhatsApp, Exchange.
- Sync with Kia source content for specs and imagery.

## 2. Offers & Promotions
- Central offers page with filters and validity dates.
- Offer detail with eligibility, terms, and dealer‑specific conditions.
- Lead capture CTA and contact methods.
- **Price/Availability Alerts** - notify users when offers change or models available.
- Exchange bonus offers integration.

## 3. EMI Tools
- Calculator with price, down payment, interest rate, term.
- Clear monthly payment estimate and disclaimers.
- Save/share output and CTA to request quote.
- **Trade-in/Exchange value integration** - deduct exchange value from EMI.

## 4. Test Drive Scheduling
- Simple form with model selection, preferred date/time, location.
- Confirmation message and CRM handoff.
- SMS/email/WhatsApp notifications.
- Calendar integration (Google Calendar, iCal).
- Option to bring exchange vehicle for inspection.

## 5. Service Pickup & Booking
- Service booking form with pickup/drop‑off options.
- Service type selection and preferred date/time.
- Confirmation and reminder notifications.
- Service history tracking for returning customers.
- Real-time service status (via DMS integration).

## 6. AI Chatbot & Voice Agent (HIGH PRIORITY)
- **Text-based AI Chatbot**:
  - FAQ coverage: models, offers, service, financing, insurance, accessories, exchange.
  - Lead qualification flow: name, phone, email, intent.
  - Handoff to live agent or callback request.
  - RAG integration for manual/documentation queries.
- **AI Voice Agent**:
  - Multilingual support (English, Hindi, Kannada, Tamil, Telugu + more).
  - Text-to-Speech using Sarvam AI or similar Indian language TTS.
  - Speech-to-Text for voice input.
  - Same capabilities as text chatbot.
  - Wake word or button activation.
- **Brand Mascot**:
  - Animated character representing Epitome Kia.
  - Appears with chatbot/voice interactions.
  - Consistent personality and tone.
  - Micro-animations for engagement.

## 7. WhatsApp Integration (HIGH PRIORITY - Critical for India)
- Click-to-WhatsApp buttons on all key pages.
- WhatsApp Business API integration.
- Automated responses for common queries.
- Lead capture via WhatsApp.
- Appointment confirmations via WhatsApp.
- Share vehicle details/brochures via WhatsApp.
- Order status updates via WhatsApp.
- Insurance renewal reminders via WhatsApp.
- Exchange valuation updates via WhatsApp.

## 8. Vehicle Comparison Tool (ENHANCED)

### Kia Model Comparison
- Side-by-side comparison of up to 3 Kia models.
- Compare specs, features, pricing, variants.
- Visual diff highlighting differences.
- Save/share comparison.
- CTA to schedule test drive for compared models.

### Competitor Comparison (HIGH PRIORITY)
- Compare Kia models with competitor vehicles.
- **Seltos** vs Hyundai Creta, Tata Nexon, Honda Elevate, MG Astor, Maruti Grand Vitara.
- **Sonet** vs Hyundai Venue, Tata Punch, Mahindra XUV 3XO, Maruti Brezza.
- **Carens** vs Hyundai Alcazar, Mahindra XUV700, Toyota Innova Hycross.
- **EV6/EV9** vs Hyundai Ioniq 5, Tata Nexon EV, MG ZS EV, BMW iX1.
- **Carnival** vs Toyota Innova Crysta, MG Hector Plus.
- Competitor specs sourced from CarDekho/CarWale or direct scraping.
- Highlight Kia advantages (warranty, features, value).
- Fair and accurate comparison data.
- Weekly data refresh for accuracy.

## 9. Customer Reviews & Testimonials
- Display verified customer reviews.
- Star ratings and written feedback.
- Filter by model, service type.
- Video testimonials integration.
- Google Reviews integration.
- Social proof badges.

## 10. Personalized Recommendations (HIGH PRIORITY)

### Browser Behavior Tracking
- Track page views, scroll depth, time on page.
- Mouse movement heatmaps.
- Click patterns and interaction history.

### Smart Nudges
- Exit-intent popups with offers.
- Scroll-triggered CTAs.
- Personalized banner recommendations.
- "You might also like" suggestions.
- Recently viewed models.
- "Back in stock" notifications.
- Price drop alerts.
- Exchange bonus prompts for returning visitors.

### AI-Powered Recommendations
- Model recommendations based on browsing history.
- Offer suggestions based on interest signals.
- Next best action predictions.
- Personalized email/notification content.
- Accessory recommendations based on vehicle owned.

## 11. RAG-Based Manual & Documentation Query

### Knowledge Base
- Ingest all Kia vehicle owner's manuals.
- Service guides and maintenance schedules.
- Warranty information.
- Feature guides and how-to content.
- Accessory installation guides.
- Insurance FAQs.

### Query Interface
- Natural language questions about vehicle features.
- Maintenance schedule queries.
- Troubleshooting assistance.
- Warranty coverage questions.
- "How do I..." queries for features.

### Response Format
- Accurate answers with source citations.
- Relevant page/section references.
- Related questions suggestions.
- Escalation to human support for complex issues.

## 12. AI Blog & Content Generation
- Content generation with editorial review workflow.
- Topics: new model launches, ownership tips, promotions.
- SEO structure, schema markup, and internal linking.
- Auto-generated meta descriptions.
- Content templates for consistency.

## 13. Google Sign-On & Authentication
- Google OAuth for customer accounts.
- Optional email/phone sign-up.
- Benefits of signing in:
  - Save favorite models.
  - Track service history.
  - Personalized recommendations.
  - Faster form filling.
  - Order/booking history.
  - Insurance policy management.
  - Accessory order tracking.
  - Exchange history and valuations.

## 14. Admin Workflows
- CMS for managing offers, content, and local updates.
- Approval workflows for AI content before publishing.
- Lead management dashboard and export.
- Audit trail for compliance.
- Content sync monitoring and logs.
- Analytics dashboard.
- Accessories inventory management.
- Insurance policy tracking.
- Order fulfillment dashboard.
- Exchange request management.
- **Social media management** (see Section 22).

---

# NEW: Car Exchange Estimator (Spinny-Style)

## 15. Exchange Your Car

### Overview
Provide instant, accurate valuations for customer trade-ins using real-time market data. This helps customers understand their car's value and apply it towards a new Kia purchase.

### User Flow
```
1. Enter Vehicle Details
   └─> Make, Model, Year, Variant
   └─> Registration city (for RTO valuation)
   └─> Kilometers driven
   └─> Fuel type, Transmission
   └─> Number of owners

2. Get Instant Estimate
   └─> AI-powered valuation using market data
   └─> Price range (min-max)
   └─> Factors affecting valuation displayed

3. Refine Valuation (Optional)
   └─> Upload photos (exterior, interior, documents)
   └─> Answer condition questions (accidents, modifications)
   └─> Get refined estimate

4. Schedule Inspection
   └─> Book free home/showroom inspection
   └─> Select date, time, location
   └─> Get confirmed valuation after inspection

5. Apply to Purchase
   └─> Valid offer for 7 days
   └─> Apply exchange value to new Kia
   └─> See updated EMI with exchange deduction
```

### Valuation Data Sources

| Source | Data Type | Integration |
|--------|-----------|-------------|
| **Orange Book Value (OBV/Droom)** | Market prices, depreciation curves | API |
| **CarDekho/CarWale** | Recent listings, price trends | Scraping |
| **Spinny/Cars24** | Auction data, retail prices | Reference |
| **FADA/dealer network** | Regional pricing variations | Manual input |
| **Historical transactions** | Own exchange data over time | Database |

### Valuation Algorithm

```
Base Value = Market Price (from OBV/CarDekho)

Adjustments:
  + Age factor (year of manufacture)
  + Kilometers driven (vs average for age)
  + Number of owners (1st owner premium)
  + Service history (documented = +5%)
  + Condition score (from photos/inspection)
  + Regional demand factor
  + Current market trends
  - Accident history
  - Modifications/alterations
  - Missing documents

Final Estimate = Base Value + Sum(Adjustments)
Display Range = Final Estimate ± 5%
```

### Features

**Instant Online Valuation:**
- Real-time estimate in under 30 seconds.
- No registration or login required for basic estimate.
- Clear breakdown of factors affecting price.
- Comparison with similar listings in market.

**Photo-Based Refinement:**
- Upload 10+ photos for AI condition assessment.
- Computer vision for scratch/dent detection.
- Document verification (RC, insurance).
- Improved accuracy from 80% to 95%.

**Inspection Booking:**
- Schedule home inspection (free).
- Showroom drop-off option.
- Flexible timing (7 days a week).
- 45-minute comprehensive inspection.
- Same-day final offer.

**Exchange Bonus Integration:**
- Special bonus for exchanging to Kia.
- Model-specific exchange offers.
- Combined with existing promotions.
- Higher value than pure resale.

**Transparency:**
- Show how valuation is calculated.
- Display market comparisons.
- Historical price trends for model.
- No hidden deductions.

### Technical Requirements

**APIs/Data Sources:**
- OBV (Orange Book Value) API for base pricing.
- Vehicle registration data (Vahan/RTO integration if available).
- CarDekho/CarWale price aggregation.
- Internal historical data for Bangalore market.

**AI/ML Components:**
- Image recognition for condition assessment.
- Price prediction model trained on historical data.
- Natural language processing for vehicle identification.

**Database Schema:**
```sql
CREATE TABLE exchange_valuations (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  
  -- Vehicle Details
  make VARCHAR(100),
  model VARCHAR(100),
  variant VARCHAR(100),
  year INTEGER,
  fuel_type VARCHAR(20),
  transmission VARCHAR(20),
  kilometers INTEGER,
  registration_city VARCHAR(100),
  registration_number VARCHAR(20),
  owner_number INTEGER,
  
  -- Valuation
  instant_estimate_min DECIMAL,
  instant_estimate_max DECIMAL,
  final_offer DECIMAL,
  offer_valid_until DATE,
  valuation_factors JSONB,
  
  -- Status
  status VARCHAR(30), -- draft, estimated, inspected, offered, accepted, rejected, expired
  
  -- Photos & Documents
  photos JSONB,
  documents JSONB,
  condition_score INTEGER,
  
  -- Inspection
  inspection_date TIMESTAMP,
  inspection_location VARCHAR(200),
  inspector_notes TEXT,
  
  -- Linked Purchase
  linked_lead_id UUID REFERENCES customer_leads(id),
  applied_to_model_id UUID REFERENCES car_models(id),
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE exchange_inspections (
  id UUID PRIMARY KEY,
  valuation_id UUID REFERENCES exchange_valuations(id),
  scheduled_date DATE,
  scheduled_time TIME,
  location_type VARCHAR(20), -- home, showroom
  address TEXT,
  inspector_id UUID,
  status VARCHAR(20), -- scheduled, completed, cancelled, no_show
  inspection_report JSONB,
  created_at TIMESTAMP
);
```

### Integration with Purchase Flow

- **EMI Calculator**: Show "With Exchange" and "Without Exchange" EMI.
- **Test Drive**: Option to bring exchange vehicle for inspection.
- **Lead Form**: Checkbox for "I have a car to exchange".
- **Model Pages**: "Check your car's value" CTA.
- **Offers Page**: Exchange bonus offers highlighted.

---

# NEW: Dealer Management System (DMS) Integration

## 16. Kia-Certified DMS Integration

### Overview
Integrate with Kia-certified Dealer Management Systems to provide full self-service capabilities and real-time data sync.

### Kia-Certified DMS Options

| DMS | Features | Certification |
|-----|----------|---------------|
| **Tekion Automotive Retail Cloud (ARC)** | Cloud-native, integrated CRM/sales/service/accounting | Kia Certified (USA/Canada) |
| **Dealerlogix** | Service lane technology, online scheduling, mobile payments | Kia Certified |
| **Affinitiv** | Service lane, appointment scheduling, technician management | Kia Certified |
| **ACS ACCESS** | Parts ordering, warranty repair orders, communications | Kia Certified |
| **AutoMate** | Popular in India for Kia dealers | Commonly used |

### Integration Scope

**Customer Data Sync:**
- Customer profile from DMS.
- Vehicle ownership history.
- Service history and records.
- Purchase history.
- Loyalty points (if applicable).

**Service Integration:**
- Real-time service slot availability.
- Service advisor assignment.
- Job card creation.
- Service status updates.
- Parts availability check.
- Service cost estimates.

**Sales Integration:**
- Inventory/stock availability.
- Test drive scheduling to DMS.
- Lead creation and updates.
- Quote generation.
- Booking status.

**API Requirements:**
```
DMS API Endpoints Needed:
- GET /customers/{id} - Customer profile
- GET /customers/{id}/vehicles - Customer's vehicles
- GET /customers/{id}/service-history - Service records
- GET /service/slots?date=YYYY-MM-DD - Available slots
- POST /service/appointments - Create appointment
- GET /service/appointments/{id}/status - Appointment status
- GET /inventory?model={model} - Stock availability
- POST /leads - Create lead
- PATCH /leads/{id} - Update lead status
```

### Self-Service Portal Features

**For Customers (via website/app):**
- View complete service history.
- Download service invoices.
- Check pending service recommendations.
- Book follow-up appointments.
- Request pickup/drop service.
- Track service in real-time.
- Pay invoices online.
- View warranty status.
- Access digital documents (RC, insurance copies).

**Benefits:**
- 24/7 access to information.
- No need to call dealership.
- Faster service booking.
- Transparent service history.
- Reduced phone load on dealership.

---

# NEW: Social Media Integration

## 17. Social Media Presence & Management

### Website Social Media Integration

**Social Links Display:**
- Header/footer social media icons.
- Prominent placement on Contact page.
- Model pages: share to social.
- Blog posts: share buttons.
- Offer pages: share deals.

**Official Social Handles:**
```
Platform        | Handle                  | Purpose
----------------|-------------------------|------------------
Facebook        | @EpitomeKiaBangalore   | Community, offers
Instagram       | @epitome_kia           | Visual content, stories
YouTube         | Epitome Kia            | Vehicle videos, reviews
LinkedIn        | Epitome Kia            | Corporate, careers
X (Twitter)     | @EpitomeKia            | Updates, customer service
WhatsApp        | Business Account        | Direct communication
Google Business | 5 locations             | Reviews, directions
```

**Live Social Feeds:**
- Instagram feed widget on homepage.
- Latest YouTube video embed.
- Google Reviews integration.
- Twitter/X feed for updates.

**Social Proof Elements:**
- Follower counts displayed.
- "Join 50,000+ followers" messaging.
- User-generated content showcase.
- Social testimonials carousel.

### Admin Portal: Social Media Management

**Content Calendar:**
- Visual calendar view (month/week/day).
- Drag-and-drop scheduling.
- Color-coded by platform.
- Team collaboration features.
- Content approval workflow.

**Post Scheduling:**
- Schedule posts across all platforms.
- Best time recommendations (AI-powered).
- Bulk upload and scheduling.
- Queue management.
- Draft and template library.

**Platforms Supported:**
- Facebook (Pages API)
- Instagram (Graph API)
- LinkedIn (Pages API)
- X/Twitter (API v2)
- YouTube (Data API)
- Google Business Profile

**Content Types:**
- Text posts with images.
- Carousel posts (Instagram/Facebook).
- Stories (Instagram/Facebook).
- Reels/Shorts (future).
- Video posts.
- Link posts.

**Engagement Management:**
- Unified inbox for all platforms.
- Comment monitoring and replies.
- Message responses.
- Mention tracking.
- Review monitoring.
- Sentiment analysis.

**Analytics Dashboard:**
- Follower growth trends.
- Engagement rates (likes, comments, shares).
- Reach and impressions.
- Best performing content.
- Audience demographics.
- Platform comparison.
- Export reports (PDF/CSV).

**Team Features:**
- Role-based access (admin, publisher, analyst).
- Content approval workflow.
- Activity log.
- Scheduling permissions.
- Brand guideline enforcement.

### Integration Options

| Tool | Integration Type | Features |
|------|------------------|----------|
| **Native APIs** | Direct integration | Full control, cost-effective |
| **Buffer** | Third-party | Simple scheduling, analytics |
| **Hootsuite** | Third-party | Enterprise features |
| **Sendible** | Third-party | Dealership-specific features |
| **Sprout Social** | Third-party | Advanced analytics |

**Recommendation:** Start with native API integration for publishing, add third-party tool for advanced analytics if needed.

---

# Insurance Integration (SMC Insurance)

## 18. Insurance Portal

### SMC Insurance Partnership
- **Partner**: SMC Insurance Brokers Pvt. Ltd. (New Delhi)
- **Website**: smcinsurance.com
- **Contact**: +91 11 66222266 | smc@smcinsurance.com
- **Products**: Motor insurance (comprehensive, third-party, add-ons)
- **Partners**: 35+ insurance companies (ICICI Lombard, HDFC Ergo, Bajaj Allianz, etc.)

### Features

**New Insurance Purchase:**
- Integration with SMC Insurance API (or iframe/redirect if API unavailable).
- Get instant quotes from multiple insurers.
- Compare premiums, coverage, and add-ons.
- Online policy purchase with Razorpay payment.
- Policy documents delivered via email/WhatsApp.
- Store policy details in customer account.

**Insurance Renewal Tracking:**
- Track all customer insurance policies in database.
- Automated email reminders: 60 days, 30 days, 15 days, 7 days, 1 day before expiry.
- WhatsApp renewal reminders.
- One-click renewal with saved details.
- Self-checkout via Razorpay for renewals.
- Renewal confirmation and new policy delivery.

**Policy Management Dashboard (Customer):**
- View all active policies.
- Download policy documents.
- View coverage details.
- Track claim history (if API available).
- Request claim assistance.
- Update vehicle details.

**Admin Insurance Dashboard:**
- Track all policies sold.
- Commission tracking (if applicable).
- Renewal pipeline view.
- Customer insurance status.
- Integration status monitoring.

### Integration Approach
```
Option 1: SMC Insurance API (Preferred)
- Direct API integration for quotes and purchase.
- Real-time policy issuance.
- Requires partnership agreement with SMC.

Option 2: SMC Redirect/Iframe
- Redirect to SMC portal for purchase.
- Webhook for policy confirmation.
- Simpler integration, less control.

Option 3: Aggregator API (Policybazaar, Coverfox)
- Use third-party aggregator API.
- Multiple insurer quotes.
- Commission-based model.
```

---

# Kia Accessories Store

## 19. Ecommerce Store

### Product Categories
- **Exterior Accessories**: Alloy wheels, body kits, roof rails, door visors, mud flaps.
- **Interior Accessories**: Seat covers, floor mats, steering covers, ambient lighting.
- **Car Care**: Cleaning kits, polish, wax, microfiber cloths.
- **Safety & Security**: Dash cameras, parking sensors, GPS trackers, car alarms.
- **Lifestyle Merchandise**: Kia branded apparel, caps, bags, keychains, collectibles.

### Store Features
- Product catalog with model compatibility.
- High-quality images and descriptions.
- Customer reviews and ratings.
- Shopping cart with promo codes.
- Razorpay payment integration (UPI, cards, net banking, wallets).
- Order tracking with Shiprocket logistics.
- GST invoicing.

---

# Tesla-Inspired Features

## 20. Interactive Maps & Location Features

### Google Maps Integration
- Interactive dealer locator (5 Bangalore locations).
- Custom Kia-branded markers.
- Real-time distance calculation.
- Service center locator with slot availability.
- EV charging station map for EV6/EV9/Clavis EV.

### Customer Account Dashboard (My Garage)
- My Vehicles with VIN, service history, warranty status.
- Quick actions (book service, renew insurance, buy accessories, exchange car).
- Order tracking for all transactions.
- Notifications center.

### Vehicle Configurator (Tesla-Style)
- Select model → variant → color → accessories.
- Real-time price updates.
- Generate PDF summary.
- Share configuration via link.
- Apply exchange value to see adjusted price.

---

# Dynamic Content Pipeline & Automation

## 21. Automated Content Ecosystem

> **Goal**: The website automatically stays current by scraping all relevant sources, with intelligent human-in-the-loop workflows for critical decisions.

### Master Data Sources

| Data Type | Primary Source | Backup Source | Frequency | Auto Level |
|-----------|----------------|---------------|-----------|------------|
| **Kia Model Specs** | kia.com/in | Kia press releases | Weekly | 🟢 Full Auto |
| **Ex-Showroom Prices** | kia.com/in | Dealer portal | Daily | 🟡 Auto + Alert |
| **Model Images/Videos** | kia.com/in | Kia media library | Weekly | 🟢 Full Auto |
| **Brochures/Manuals** | kia.com/in | Kia dealer portal | Monthly | 🟢 Full Auto |
| **Competitor Specs** | CarDekho API | CarWale scrape | Weekly | 🟢 Full Auto |
| **Competitor Prices** | CarDekho API | Manufacturer sites | Daily | 🟢 Full Auto |
| **Used Car Values** | OBV/Droom API | Cars24, Spinny | Daily | 🟢 Full Auto |
| **Insurance Quotes** | SMC Insurance API | Policybazaar | Real-time | 🟢 Full Auto |
| **Service Slots** | DMS (Tekion) | Manual fallback | Real-time | 🟢 Full Auto |
| **EV Charging Stations** | ChargePoint API | Tata Power API | Hourly | 🟢 Full Auto |
| **Google Reviews** | Google Places API | - | Hourly | 🟡 Auto + Moderate |
| **Social Media Metrics** | Platform APIs | - | Hourly | 🟢 Full Auto |
| **Fuel Prices** | IOC/BPCL APIs | Scrape | Daily | 🟢 Full Auto |
| **RTO/Registration** | Parivahan API | Manual | On-demand | 🟢 Full Auto |

### Scraping Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCRAPING ORCHESTRATOR                        │
│                   (Railway Cron / Vercel Cron)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  KIA SCRAPER  │   │  COMPETITOR   │   │  VALUATION    │
│               │   │   SCRAPER     │   │   SCRAPER     │
│ • kia.com/in  │   │ • CarDekho    │   │ • OBV API     │
│ • Specs       │   │ • CarWale     │   │ • Spinny      │
│ • Prices      │   │ • OEM sites   │   │ • Cars24      │
│ • Images      │   │ • Specs only  │   │ • Market data │
│ • Brochures   │   │ • No images   │   │               │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └─────────────────────┼─────────────────────┘
                              ▼
                 ┌─────────────────────┐
                 │   CONTENT DIFFER    │
                 │                     │
                 │ • Compare with DB   │
                 │ • Detect changes    │
                 │ • Flag for review   │
                 └──────────┬──────────┘
                            │
           ┌────────────────┼────────────────┐
           ▼                ▼                ▼
    ┌────────────┐   ┌────────────┐   ┌────────────┐
    │ AUTO-APPLY │   │  PENDING   │   │   ALERT    │
    │            │   │  APPROVAL  │   │   ADMIN    │
    │ Minor data │   │            │   │            │
    │ updates    │   │ Price chg  │   │ Major chg  │
    │            │   │ New model  │   │ Error      │
    └────────────┘   └────────────┘   └────────────┘
```

### Scraper Specifications

#### 1. Kia India Scraper
```yaml
name: kia-india-scraper
schedule: "0 2 * * 0"  # Weekly Sunday 2 AM
technology: Puppeteer/Playwright
targets:
  - url: https://www.kia.com/in/vehicles.html
    data: model_list, segments
  - url: https://www.kia.com/in/{model}/specifications.html
    data: specs, features, dimensions
  - url: https://www.kia.com/in/{model}/price.html
    data: variant_prices, colors
  - url: https://www.kia.com/in/buy/brochure.html
    data: brochure_pdfs
  - url: https://www.kia.com/in/service/owners-manual.html
    data: owner_manuals (for RAG)
storage:
  images: Cloudinary (auto-optimize)
  pdfs: S3 bucket
  data: PostgreSQL
notifications:
  - on_new_model: Slack + Email to admin
  - on_price_change: Pending approval queue
  - on_error: PagerDuty/Slack alert
```

#### 2. Competitor Scraper
```yaml
name: competitor-scraper
schedule: "0 3 * * *"  # Daily 3 AM
sources:
  cardekho:
    type: API (if available) / Scrape
    models:
      - hyundai-creta
      - tata-nexon
      - honda-elevate
      - maruti-grand-vitara
      - mg-astor
      # ... all competitor models
    data: specs, prices, features
  carwale:
    type: Scrape
    data: user_reviews, ratings
  manufacturer_sites:
    type: Scrape
    urls:
      - hyundai.co.in
      - tatamotors.com
      - honda.co.in
rules:
  - NO image scraping (copyright)
  - Text/specs only
  - Cache for 24 hours
  - Respect robots.txt
```

#### 3. Used Car Valuation Scraper
```yaml
name: valuation-scraper
schedule: "0 */6 * * *"  # Every 6 hours
sources:
  obv_api:
    priority: 1
    type: API
    data: base_prices, depreciation
  spinny:
    priority: 2
    type: Scrape
    data: listing_prices, demand
  cars24:
    priority: 3
    type: Scrape
    data: auction_prices
  olx_cars:
    priority: 4
    type: Scrape
    data: private_sale_prices
aggregation:
  method: weighted_average
  weights:
    obv: 0.4
    spinny: 0.3
    cars24: 0.2
    olx: 0.1
output:
  - price_range (min, max, avg)
  - confidence_score
  - regional_adjustment (Bangalore)
```

### Human-in-the-Loop Workflows

#### Approval Queue Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTENT APPROVAL QUEUE                          [Admin Portal] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔴 HIGH PRIORITY (3)                                          │
│  ├─ Seltos price increased ₹50,000 → ₹51,500           [Review]│
│  ├─ New model detected: Kia Clavis                     [Review]│
│  └─ EV6 variant discontinued                           [Review]│
│                                                                 │
│  🟡 MEDIUM PRIORITY (7)                                        │
│  ├─ Competitor price update: Creta +₹20,000            [Auto✓] │
│  ├─ New customer review (4.5★) needs moderation        [Review]│
│  └─ Blog post generated: "Seltos vs Creta 2025"        [Review]│
│                                                                 │
│  🟢 AUTO-APPLIED (24)                                          │
│  ├─ 15 competitor spec updates                         [View]  │
│  ├─ 8 used car price adjustments                       [View]  │
│  └─ 1 insurance rate update                            [View]  │
│                                                                 │
│  ⚙️ SETTINGS                                                   │
│  └─ [Configure auto-approval rules] [View change log]          │
└─────────────────────────────────────────────────────────────────┘
```

#### Approval Rules Engine

```javascript
// Example: Approval Rules Configuration
const approvalRules = {
  kia_pricing: {
    auto_approve: false,  // Always require human approval
    notify: ['sales_manager', 'admin'],
    sla: '2 hours'  // Must be reviewed within 2 hours
  },
  
  kia_specs: {
    auto_approve: (change) => change.type === 'minor',  // Auto for minor
    minor_changes: ['color_addition', 'accessory_update'],
    major_changes: ['new_variant', 'feature_change', 'discontinuation'],
    notify: ['content_manager']
  },
  
  competitor_data: {
    auto_approve: true,  // Always auto-apply
    log: true,
    weekly_summary: true
  },
  
  exchange_valuation: {
    auto_approve: (valuation) => valuation.amount < 500000,
    human_review_threshold: 500000,  // ₹5L+ needs approval
    notify: ['used_car_manager']
  },
  
  customer_reviews: {
    auto_approve: (review) => review.rating >= 4 && !review.flagged,
    moderation_required: (review) => review.rating < 3 || review.flagged,
    notify: ['customer_success']
  },
  
  ai_blog_content: {
    auto_approve: false,  // Always require editorial review
    notify: ['content_manager', 'seo_lead'],
    workflow: 'draft → review → edit → approve → publish'
  },
  
  social_media_posts: {
    auto_approve: false,
    notify: ['social_media_manager'],
    scheduled_posts_need_approval: true
  },
  
  legal_disclaimers: {
    auto_approve: false,
    notify: ['legal', 'admin'],
    require_two_approvals: true
  }
};
```

### Change Detection & Diffing

```python
# Pseudocode: Smart Content Differ
class ContentDiffer:
    
    def compare(self, old_data, new_data, content_type):
        changes = []
        
        for field in new_data:
            if old_data.get(field) != new_data.get(field):
                change = {
                    'field': field,
                    'old_value': old_data.get(field),
                    'new_value': new_data.get(field),
                    'change_type': self.classify_change(field, old_data, new_data),
                    'impact': self.assess_impact(field, content_type),
                    'requires_approval': self.check_approval_needed(field, content_type)
                }
                changes.append(change)
        
        return changes
    
    def classify_change(self, field, old, new):
        if field == 'price':
            diff = new['price'] - old['price']
            if abs(diff) > 10000:
                return 'major_price_change'
            return 'minor_price_change'
        
        if field == 'variants':
            if len(new['variants']) > len(old['variants']):
                return 'new_variant_added'
            elif len(new['variants']) < len(old['variants']):
                return 'variant_discontinued'
        
        return 'data_update'
```

### Notification System

| Event | Channel | Recipients | Urgency |
|-------|---------|------------|---------|
| New Kia model detected | Slack, Email, SMS | Admin, Sales Manager | 🔴 High |
| Kia price change | Slack, Email | Admin, Sales Manager | 🔴 High |
| Variant discontinued | Slack, Email | Admin, Content Manager | 🔴 High |
| Scraper failed | PagerDuty, Slack | DevOps, Admin | 🔴 High |
| Competitor price change | Email digest | Sales Manager | 🟡 Medium |
| New customer review | Slack | Customer Success | 🟡 Medium |
| AI blog ready for review | Email | Content Manager | 🟡 Medium |
| Weekly content summary | Email | All stakeholders | 🟢 Low |
| Monthly analytics report | Email | Management | 🟢 Low |

### Data Freshness Indicators

Display staleness to users when data might be outdated:

```jsx
// Component: DataFreshnessIndicator
<ModelPrice 
  price={850000}
  lastUpdated="2024-12-20"
  source="kia.com/in"
  freshness={calculateFreshness(lastUpdated)}
/>

// If data is stale (>7 days), show warning
{freshness === 'stale' && (
  <Badge variant="warning">
    Prices may have changed. Last verified: {lastUpdated}
    <Button size="sm">Check latest price</Button>
  </Badge>
)}
```

### Fallback & Graceful Degradation

```
Scraping Failure Hierarchy:
1. Try primary source (kia.com/in)
   ↓ (if fails)
2. Try backup source (dealer portal)
   ↓ (if fails)
3. Show cached data with staleness warning
   ↓ (if cache expired)
4. Show "Contact us for latest information" CTA
   ↓ (always)
5. Log failure and alert admin
```

### Audit & Compliance

All automated changes are logged:

```sql
CREATE TABLE content_audit_log (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  content_type VARCHAR(50),      -- 'kia_model', 'competitor', 'valuation'
  content_id UUID,
  action VARCHAR(20),             -- 'created', 'updated', 'deleted'
  field_changed VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  change_source VARCHAR(50),      -- 'scraper', 'api', 'manual', 'ai'
  auto_approved BOOLEAN,
  approved_by UUID,               -- NULL if auto-approved
  approved_at TIMESTAMP,
  scrape_job_id UUID,
  metadata JSONB
);

-- Index for quick lookups
CREATE INDEX idx_audit_content ON content_audit_log(content_type, content_id);
CREATE INDEX idx_audit_timestamp ON content_audit_log(timestamp);
```

### Monitoring Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTENT SYNC HEALTH                                  [Live] 🟢 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SOURCE STATUS                                                  │
│  ├─ kia.com/in          🟢 Healthy    Last: 2h ago    Next: 22h│
│  ├─ CarDekho API        🟢 Healthy    Last: 6h ago    Next: 18h│
│  ├─ OBV API             🟢 Healthy    Last: 1h ago    Next: 5h │
│  ├─ DMS (Tekion)        🟢 Real-time  Latency: 120ms          │
│  ├─ SMC Insurance       🟢 Real-time  Latency: 340ms          │
│  └─ Google Reviews      🟡 Degraded   Rate limited             │
│                                                                 │
│  CONTENT FRESHNESS                                              │
│  ├─ Kia Models          ✅ 100% fresh (updated 2 days ago)     │
│  ├─ Competitor Data     ✅ 100% fresh (updated today)          │
│  ├─ Exchange Values     ✅ 100% fresh (updated 4 hours ago)    │
│  └─ Insurance Quotes    ✅ Real-time                           │
│                                                                 │
│  PENDING ACTIONS                                                │
│  ├─ 3 items awaiting approval                    [Review Now]  │
│  ├─ 1 scraper alert                              [Investigate] │
│  └─ Weekly summary ready                         [View]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# Technology Requirements

## AI & ML Stack
- **LLM**: OpenAI GPT-4o or Anthropic Claude.
- **RAG**: LangChain/LlamaIndex + Pinecone/pgvector.
- **Voice**: Sarvam AI (Indian languages) + Whisper/Deepgram.
- **Image Recognition**: For exchange car condition assessment.
- **Recommendations**: PostHog + custom ML model.

## Frontend Enhancements
- 360° Vehicle Viewer (Pannellum/A-Frame).
- Mascot animations (Lottie/Rive).
- PWA with offline support.
- Google Maps integration.

---

# SEO Optimization & Self-Correcting Analytics

## 22. Comprehensive SEO Strategy

> **Goal**: Achieve top 3 rankings for all target keywords in Bangalore/Karnataka, with an AI-powered system that continuously monitors, learns, and self-corrects based on analytics data.

### Technical SEO Foundation

#### Next.js SEO Configuration
```typescript
// Built-in SEO features leveraged:
- Server-side rendering (SSR) for all public pages
- Static site generation (SSG) for model pages
- Automatic sitemap.xml generation
- robots.txt configuration
- Canonical URL management
- Hreflang for regional content (if applicable)
```

#### Core Technical Requirements

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| **Meta Tags** | Dynamic title, description per page | 🟢 |
| **Open Graph** | OG tags for social sharing | 🟢 |
| **Twitter Cards** | Summary large image cards | 🟢 |
| **Structured Data** | JSON-LD schema markup | 🟡 |
| **Canonical URLs** | Self-referencing canonicals | 🟢 |
| **XML Sitemap** | Auto-generated, submitted to GSC | 🟢 |
| **Robots.txt** | Proper crawl directives | 🟢 |
| **Core Web Vitals** | LCP < 2.5s, CLS < 0.1, FID < 100ms | 🟡 |
| **Mobile-First** | 100% responsive, mobile-optimized | 🟢 |
| **HTTPS** | SSL certificate, secure connections | 🟢 |
| **URL Structure** | Clean, keyword-rich URLs | 🟢 |
| **Internal Linking** | Automated contextual links | 🟡 |
| **Image Optimization** | WebP/AVIF, lazy loading, alt text | 🟢 |
| **Page Speed** | < 3s load time on 3G | 🟡 |

### Schema Markup (JSON-LD)

```json
// Implemented schema types:
{
  "schemas": [
    {
      "type": "AutoDealer",
      "pages": ["homepage", "contact", "about"],
      "data": ["name", "address", "phone", "openingHours", "geo", "reviews"]
    },
    {
      "type": "Car",
      "pages": ["model detail pages"],
      "data": ["name", "brand", "model", "vehicleConfiguration", "fuelType", "offers"]
    },
    {
      "type": "Offer",
      "pages": ["offers page", "model pages"],
      "data": ["name", "description", "validFrom", "validThrough", "price"]
    },
    {
      "type": "FAQPage",
      "pages": ["FAQ sections", "model pages"],
      "data": ["question", "answer"]
    },
    {
      "type": "LocalBusiness",
      "pages": ["location pages"],
      "data": ["name", "address", "phone", "openingHours", "reviews"]
    },
    {
      "type": "Product",
      "pages": ["accessories store"],
      "data": ["name", "image", "description", "sku", "offers", "reviews"]
    },
    {
      "type": "BreadcrumbList",
      "pages": ["all pages"],
      "data": ["itemListElement"]
    },
    {
      "type": "Article",
      "pages": ["blog posts"],
      "data": ["headline", "author", "datePublished", "image"]
    },
    {
      "type": "Review",
      "pages": ["model pages", "testimonials"],
      "data": ["author", "reviewRating", "reviewBody"]
    }
  ]
}
```

### Target Keywords Strategy

#### Primary Keywords (Bangalore Focus)
| Keyword | Monthly Volume | Current Rank | Target Rank |
|---------|----------------|--------------|-------------|
| kia showroom bangalore | 2,400 | - | #1 |
| kia seltos price bangalore | 1,900 | - | #1 |
| kia dealer near me | 5,400 | - | #1-3 |
| kia service center bangalore | 1,600 | - | #1 |
| kia sonet on road price bangalore | 1,200 | - | #1 |
| kia ev6 bangalore | 800 | - | #1 |
| kia test drive bangalore | 600 | - | #1 |
| kia exchange offer bangalore | 400 | - | #1 |

#### Long-Tail Keywords
| Keyword | Intent | Target Page |
|---------|--------|-------------|
| kia seltos vs hyundai creta comparison | Research | Comparison tool |
| kia emi calculator online | Transaction | EMI page |
| kia service booking online bangalore | Transaction | Service page |
| used car exchange for kia | Transaction | Exchange page |
| kia carens 7 seater price | Research | Model page |
| kia ev charging stations bangalore | Information | EV page |

### Self-Correcting SEO System

#### Analytics-Driven Optimization Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                   SEO SELF-CORRECTION ENGINE                    │
└─────────────────────────────────────────────────────────────────┘
                              │
     ┌────────────────────────┼────────────────────────┐
     ▼                        ▼                        ▼
┌─────────┐            ┌─────────────┐           ┌──────────┐
│ COLLECT │            │   ANALYZE   │           │   ACT    │
│         │            │             │           │          │
│ GA4     │───────────▶│ AI Analysis │──────────▶│ Auto-fix │
│ GSC     │            │ Pattern     │           │ Alert    │
│ Ahrefs  │            │ Detection   │           │ Suggest  │
│ Hotjar  │            │             │           │          │
└─────────┘            └─────────────┘           └──────────┘
     │                        │                        │
     └────────────────────────┴────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │    LEARN &      │
                    │    ITERATE      │
                    └─────────────────┘
```

#### Data Collection Layer

| Source | Data Collected | Frequency |
|--------|----------------|-----------|
| **Google Analytics 4** | Traffic, behavior, conversions, demographics | Real-time |
| **Google Search Console** | Rankings, impressions, clicks, CTR, queries | Daily |
| **Ahrefs/SEMrush API** | Backlinks, keyword rankings, competitors | Weekly |
| **Hotjar/PostHog** | Heatmaps, session recordings, user flows | Real-time |
| **Core Web Vitals** | LCP, FID, CLS, TTFB | Daily |
| **PageSpeed Insights API** | Performance scores, suggestions | Daily |
| **Uptime Monitoring** | Availability, response times | Continuous |

#### AI Analysis Engine

```python
# Pseudocode: SEO Self-Correction AI
class SEOOptimizer:
    
    def daily_analysis(self):
        # 1. Collect data from all sources
        ga4_data = self.fetch_ga4_metrics()
        gsc_data = self.fetch_search_console()
        rankings = self.fetch_keyword_rankings()
        vitals = self.fetch_core_web_vitals()
        
        # 2. Detect anomalies and opportunities
        issues = []
        opportunities = []
        
        # Check for ranking drops
        for keyword in rankings:
            if keyword.position_change < -3:  # Dropped 3+ positions
                issues.append({
                    'type': 'ranking_drop',
                    'keyword': keyword.term,
                    'from': keyword.previous_position,
                    'to': keyword.current_position,
                    'severity': 'high' if keyword.volume > 1000 else 'medium'
                })
        
        # Check for CTR issues
        for page in gsc_data:
            expected_ctr = self.expected_ctr_for_position(page.position)
            if page.ctr < expected_ctr * 0.7:  # 30% below expected
                issues.append({
                    'type': 'low_ctr',
                    'page': page.url,
                    'current_ctr': page.ctr,
                    'expected_ctr': expected_ctr,
                    'suggestion': 'Improve meta title/description'
                })
        
        # Check for high bounce rate pages
        for page in ga4_data:
            if page.bounce_rate > 70 and page.sessions > 100:
                issues.append({
                    'type': 'high_bounce',
                    'page': page.url,
                    'bounce_rate': page.bounce_rate,
                    'suggestion': 'Improve content relevance or page speed'
                })
        
        # Check Core Web Vitals
        for metric in vitals:
            if metric.value > metric.threshold:
                issues.append({
                    'type': 'cwv_issue',
                    'metric': metric.name,
                    'value': metric.value,
                    'threshold': metric.threshold
                })
        
        # 3. Generate recommendations
        return self.generate_action_plan(issues, opportunities)
    
    def auto_corrections(self):
        """Actions that can be automated without human approval"""
        return [
            'update_sitemap',           # Regenerate sitemap
            'refresh_structured_data',  # Update schema markup
            'optimize_images',          # Compress new images
            'update_internal_links',    # Add contextual links
            'refresh_meta_descriptions',# AI-generate better meta
            'fix_broken_links',         # 404 detection and fix
            'update_canonical_urls',    # Fix duplicate content
        ]
    
    def human_required_actions(self):
        """Actions that need human review"""
        return [
            'content_rewrite',          # Major content changes
            'new_page_creation',        # New landing pages
            'backlink_outreach',        # Link building
            'keyword_targeting_change', # Strategy shifts
            'technical_fixes',          # Major code changes
        ]
```

#### Automated Corrections

| Issue Detected | Auto-Correction | Human Review |
|----------------|-----------------|--------------|
| Missing meta description | AI generates optimized meta | Optional review |
| Image without alt text | AI generates descriptive alt | Auto-apply |
| Broken internal link | Remove or redirect | Auto-apply |
| Missing schema markup | Generate from page content | Auto-apply |
| Slow loading images | Compress and convert to WebP | Auto-apply |
| Duplicate title tags | Generate unique variations | Needs review |
| Low CTR for ranking page | A/B test new meta title | Auto-test |
| High bounce rate | Add internal links, improve CTA | Suggest to human |
| Ranking drop | Analyze and suggest content update | Alert human |
| New keyword opportunity | Suggest new page/content | Alert human |

### SEO Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  SEO HEALTH DASHBOARD                              [Admin] 📊   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OVERALL SEO SCORE: 87/100 ↑3 from last week                   │
│  ████████████████████░░░ 87%                                   │
│                                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ Organic Traffic │ │ Keyword Rankings│ │ Core Web Vitals │   │
│  │   12,450 ↑15%   │ │ 23 in Top 10 ↑5│ │  All Passing ✅ │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│                                                                 │
│  TOP PERFORMING PAGES                                           │
│  1. /models/seltos        4,200 visits    #2 "kia seltos"      │
│  2. /models/sonet         2,100 visits    #3 "kia sonet"       │
│  3. /emi-calculator       1,800 visits    #1 "kia emi"         │
│                                                                 │
│  ISSUES DETECTED (3)                                            │
│  🔴 Ranking drop: "kia dealer bangalore" #4→#7      [Analyze]  │
│  🟡 Low CTR: /offers page (2.1% vs 4.5% expected)   [Optimize] │
│  🟡 Slow LCP: /models/carnival (3.2s)               [Fix]      │
│                                                                 │
│  AUTO-CORRECTIONS APPLIED (12)                                  │
│  ✅ 5 images optimized                                          │
│  ✅ 3 meta descriptions updated                                 │
│  ✅ 2 broken links fixed                                        │
│  ✅ 2 schema markups added                                      │
│                                                                 │
│  OPPORTUNITIES (5)                                              │
│  💡 "kia clavis price" - New keyword, create page   [Create]   │
│  💡 Add FAQ schema to 3 pages                       [Apply]    │
│  💡 Internal link opportunity: 8 pages              [Review]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Content SEO Optimization

#### AI-Powered Content Optimization
```yaml
content_optimization:
  meta_title:
    max_length: 60
    include: [primary_keyword, brand, location]
    template: "{Model} Price in Bangalore | {Variant} On Road Price | Epitome Kia"
    ai_optimize: true
    ab_test: true
  
  meta_description:
    max_length: 155
    include: [primary_keyword, cta, usp]
    template: "Get {Model} at best price in Bangalore. ₹{Price} onwards. Book test drive, check EMI, exchange bonus. Visit Epitome Kia showroom today!"
    ai_optimize: true
  
  headings:
    h1: Single, includes primary keyword
    h2_h6: Semantic structure, includes secondary keywords
    auto_generate: false  # Human writes, AI suggests
  
  content_body:
    min_word_count: 800  # For main pages
    keyword_density: 1-2%
    readability: Grade 8 or below
    ai_suggestions: true
  
  images:
    alt_text: AI-generated, keyword-rich
    file_names: Descriptive, hyphenated
    compression: Automatic (WebP/AVIF)
    lazy_loading: true
```

#### Automatic Internal Linking

```javascript
// AI identifies linking opportunities
const internalLinkingEngine = {
  // Scan content for keyword mentions
  scanContent: (pageContent) => {
    const linkOpportunities = [];
    
    // Check for model mentions without links
    for (const model of ['seltos', 'sonet', 'carens', 'ev6']) {
      if (pageContent.includes(model) && !pageContent.hasLinkTo(`/models/${model}`)) {
        linkOpportunities.push({
          anchor: model,
          target: `/models/${model}`,
          context: extractContext(pageContent, model)
        });
      }
    }
    
    return linkOpportunities;
  },
  
  // Auto-apply safe links
  autoApply: (opportunities) => {
    opportunities
      .filter(opp => opp.confidence > 0.9)
      .forEach(opp => insertLink(opp));
  }
};
```

### Local SEO for Bangalore

#### Google Business Profile Optimization

| Location | GBP Status | Reviews | Rating | Actions |
|----------|------------|---------|--------|---------|
| Yelahanka | Claimed ✅ | 245 | 4.6 | Monitor |
| Whitefield | Claimed ✅ | 189 | 4.5 | Request reviews |
| Avalahalli | Claimed ✅ | 156 | 4.7 | Monitor |
| Kolar | Claimed ✅ | 98 | 4.4 | Improve rating |
| Varthur | Claimed ✅ | 67 | 4.8 | Get more reviews |

#### Local Schema Implementation
```json
{
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "name": "Epitome Kia - Yelahanka",
  "image": "https://epitomekia.com/images/showroom-yelahanka.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "...",
    "addressLocality": "Bangalore",
    "addressRegion": "Karnataka",
    "postalCode": "560064",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 13.1007,
    "longitude": 77.5963
  },
  "telephone": "+91-XXXXXXXXXX",
  "openingHoursSpecification": [...],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "245"
  }
}
```

### Performance Monitoring & Alerts

#### Automated Alerts

| Trigger | Threshold | Action | Channel |
|---------|-----------|--------|---------|
| Ranking drop | > 5 positions | Alert + Analysis | Slack, Email |
| Traffic drop | > 20% WoW | Alert + Investigation | Slack, Email |
| Core Web Vitals fail | Any metric red | Auto-investigate | Slack |
| New 404 errors | Any | Auto-fix or alert | Slack |
| Indexing issues | Pages dropped | Alert + GSC check | Email |
| Competitor ranking gain | Overtakes us | Competitive analysis | Weekly report |

### SEO Reporting

#### Weekly Automated Report
```markdown
# SEO Performance Report - Week of Dec 16-22, 2024

## Summary
- Organic traffic: 12,450 sessions (+15%)
- Keywords in top 10: 23 (+5)
- New backlinks: 8
- SEO score: 87/100 (+3)

## Wins
✅ "kia seltos bangalore" moved from #5 to #2
✅ New page /ev-charging indexed and ranking #8
✅ Core Web Vitals all passing

## Issues Addressed
🔧 Fixed 5 broken links (auto-corrected)
🔧 Optimized 12 images (auto-corrected)
🔧 Updated 3 meta descriptions (AI-generated)

## Pending Actions
⏳ Content update needed for /models/carnival
⏳ Review suggested internal links (8 opportunities)
⏳ Competitor "XYZ" ranking for our keywords

## Next Week Focus
- Create landing page for "kia clavis bangalore"
- Improve /offers page CTR
- Add FAQ schema to 5 pages
```

---

# Integration Requirements

## Third-Party Integrations

| Integration | Purpose | Phase | Priority |
|-------------|---------|-------|----------|
| Google OAuth | Customer sign-in | 2 | HIGH |
| WhatsApp Business API | Messaging | 1 | HIGH |
| Sarvam AI | Voice TTS/STT | 3 | HIGH |
| Google Analytics 4 | Tracking | 1 | HIGH |
| Resend/SendGrid | Email | 1 | HIGH |
| Twilio | SMS | 2 | MEDIUM |
| Razorpay | Payments | 4 | HIGH |
| Google Calendar | Appointments | 2 | MEDIUM |
| Cloudinary/S3 | Media storage | 1 | HIGH |
| Pinecone/Weaviate | Vector DB for RAG | 2 | HIGH |
| Google Maps API | Location features | 1 | HIGH |
| SMC Insurance API | Motor insurance | 4 | HIGH |
| Shiprocket API | Logistics fulfillment | 4 | HIGH |
| CarDekho/CarWale | Competitor data | 2 | MEDIUM |
| OBV/Droom | Used car valuation | 3 | HIGH |
| Facebook/Instagram API | Social publishing | 3 | MEDIUM |
| Kia DMS (Tekion/Dealerlogix) | Dealer data sync | 3 | HIGH |

---

# Compliance Requirements

- **Brand**: Adhere to Kia brand guidelines.
- **Legal**: Offer/pricing disclaimers, EMI terms.
- **Data Privacy**: GDPR/CCPA compliance, data retention.
- **Consent**: Marketing consent, cookie banner.
- **Security**: CAPTCHA, rate limiting, HTTPS.
- **Accessibility**: WCAG 2.1 AA.
- **Voice Data**: Recording consent, secure storage.
- **Ecommerce**: GST compliance, invoicing, consumer protection.
- **Insurance**: IRDAI guidelines, policy disclaimers.
- **Payments**: PCI DSS Level 1 (via Razorpay).
- **Exchange**: Fair pricing disclaimers, offer validity terms.
- **Social Media**: Brand safety, content moderation.

---

# Database Schema Additions

```sql
-- Exchange Valuations (see Section 15)
-- Social Media Posts
CREATE TABLE social_posts (
  id UUID PRIMARY KEY,
  platform VARCHAR(20),  -- facebook, instagram, linkedin, twitter, youtube
  content TEXT,
  media_urls JSONB,
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,
  status VARCHAR(20),  -- draft, scheduled, published, failed
  platform_post_id VARCHAR(100),
  engagement JSONB,  -- likes, comments, shares
  created_by UUID REFERENCES admin_users(id),
  approved_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- DMS Sync Log
CREATE TABLE dms_sync_log (
  id UUID PRIMARY KEY,
  sync_type VARCHAR(50),  -- customers, vehicles, service_history
  status VARCHAR(20),
  records_synced INTEGER,
  errors JSONB,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- RBAC Tables
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  description TEXT,
  hierarchy_level INTEGER,  -- 1 = highest (super admin)
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  resource VARCHAR(100),  -- leads, test_drives, content, etc.
  action VARCHAR(50),     -- view, create, edit, delete, approve, export
  description TEXT,
  phase_required INTEGER  -- Which phase introduces this permission
);

CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id),
  permission_id UUID REFERENCES permissions(id),
  location_scope VARCHAR(20),  -- all, assigned, own
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES admin_users(id),
  role_id UUID REFERENCES roles(id),
  location_id UUID REFERENCES locations(id),  -- NULL for global roles
  assigned_at TIMESTAMP,
  assigned_by UUID REFERENCES admin_users(id),
  PRIMARY KEY (user_id, role_id, location_id)
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES admin_users(id),
  role VARCHAR(50),
  action VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

# Role-Based Access Control (RBAC)

## 23. User Roles & Permissions

> **Goal**: Implement a comprehensive, phase-aligned RBAC system that grows with the platform, ensuring proper access control across all features and locations.

### Role Hierarchy

```
Super Admin (Dealership Owner/Director)
    │
    ├── Admin (General Manager)
    │   │
    │   ├── Sales Manager
    │   │   └── Sales Executive
    │   │
    │   ├── Service Manager
    │   │   └── Service Advisor
    │   │
    │   ├── Marketing Manager
    │   │   ├── Content Manager
    │   │   ├── Social Media Manager
    │   │   └── SEO Specialist
    │   │
    │   ├── Finance Manager
    │   │   └── Insurance Executive
    │   │
    │   └── Used Car Manager
    │       └── Evaluator
    │
    └── IT Admin (Technical)
```

### Role Definitions

| Role | Description | Scope | Phase |
|------|-------------|-------|-------|
| **Super Admin** | Full access, all locations, system config | Global | 1 |
| **Admin** | Full access, assigned locations only | Multi-location | 1 |
| **Sales Manager** | Leads, test drives, offers, sales reports | Location | 1 |
| **Sales Executive** | View/update leads, schedule test drives | Location | 1 |
| **Service Manager** | Service bookings, advisor management | Location | 1 |
| **Service Advisor** | View/update service bookings | Location | 1 |
| **Marketing Manager** | Content, SEO, campaigns, analytics | Global | 2 |
| **Content Manager** | Blog, pages, content approvals | Global | 2 |
| **Social Media Manager** | Social posts, engagement, scheduling | Global | 3 |
| **SEO Specialist** | SEO dashboard, keywords, optimizations | Global | 2 |
| **Finance Manager** | Insurance, payments, refunds, reports | Global | 4 |
| **Insurance Executive** | Policy management, renewals | Location | 4 |
| **Used Car Manager** | Exchange valuations, approvals | Location | 3 |
| **Evaluator** | Vehicle inspections, condition reports | Location | 3 |
| **IT Admin** | System config, integrations, scrapers | Global | 2 |

---

### Phase-Aligned Permission Matrix

#### Phase 1: Foundation (Core Roles)

| Feature | Super Admin | Admin | Sales Mgr | Sales Exec | Service Mgr | Service Adv |
|---------|:-----------:|:-----:|:---------:|:----------:|:-----------:|:-----------:|
| **Dashboard** |
| View dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all locations | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Leads** |
| View all leads | ✅ | ✅ | ✅ | 👁️ | ❌ | ❌ |
| View assigned leads | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create lead | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit lead | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete lead | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Export leads | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Assign leads | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Test Drives** |
| View all | ✅ | ✅ | ✅ | 👁️ | ❌ | ❌ |
| Schedule | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Update status | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign exec | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Service Bookings** |
| View all | ✅ | ✅ | ❌ | ❌ | ✅ | 👁️ |
| View assigned | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Create booking | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Update status | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| View service history | ✅ | ✅ | 👁️ | ❌ | ✅ | ✅ |
| **Offers** |
| View offers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create offer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit offer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Activate/deactivate | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Settings** |
| User management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| System config | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

#### Phase 2: AI & Content (Additional Roles)

| Feature | Super Admin | Admin | Marketing Mgr | Content Mgr | SEO Spec | IT Admin |
|---------|:-----------:|:-----:|:-------------:|:-----------:|:--------:|:--------:|
| **Content Management** |
| View all content | ✅ | ✅ | ✅ | ✅ | ✅ | 👁️ |
| Create pages/blog | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit content | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Publish content | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete content | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **AI Content** |
| View AI drafts | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Approve AI content | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Reject AI content | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Configure AI | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Approval Queue** |
| View queue | ✅ | ✅ | ✅ | ✅ | 👁️ | 👁️ |
| Approve pricing | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve content | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Configure rules | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **SEO Dashboard** |
| View SEO metrics | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View recommendations | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Apply auto-fixes | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Configure SEO rules | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| **Scraper/Sync** |
| View sync status | ✅ | ✅ | ✅ | 👁️ | 👁️ | ✅ |
| Trigger manual sync | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Configure scrapers | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View sync logs | ✅ | ✅ | 👁️ | ❌ | ❌ | ✅ |
| **Integrations** |
| View integrations | ✅ | ✅ | 👁️ | ❌ | ❌ | ✅ |
| Configure APIs | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Test connections | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

#### Phase 3: Self-Service & Exchange (Additional Roles)

| Feature | Super Admin | Admin | Used Car Mgr | Evaluator | Social Mgr | Service Mgr |
|---------|:-----------:|:-----:|:------------:|:---------:|:----------:|:-----------:|
| **Exchange Valuations** |
| View all valuations | ✅ | ✅ | ✅ | 👁️ | ❌ | ❌ |
| Create valuation | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit valuation | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Approve < ₹5L | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve ≥ ₹5L | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Schedule inspection | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Submit inspection | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Social Media** |
| View posts | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Create/schedule posts | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Approve posts | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Manage engagement | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **DMS Integration** |
| View customer data | ✅ | ✅ | 👁️ | ❌ | ❌ | ✅ |
| Sync trigger | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View sync status | ✅ | ✅ | 👁️ | ❌ | ❌ | ✅ |
| **Customer Portal** |
| View customers | ✅ | ✅ | 👁️ | ❌ | ❌ | ✅ |
| View customer vehicles | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| View service history | ✅ | ✅ | 👁️ | ❌ | ❌ | ✅ |

#### Phase 4: Commerce & Insurance (Additional Roles)

| Feature | Super Admin | Admin | Finance Mgr | Insurance Exec | Sales Mgr |
|---------|:-----------:|:-----:|:-----------:|:--------------:|:---------:|
| **Accessories Store** |
| View products | ✅ | ✅ | ✅ | ❌ | ✅ |
| Manage inventory | ✅ | ✅ | ✅ | ❌ | ❌ |
| View orders | ✅ | ✅ | ✅ | ❌ | 👁️ |
| Process orders | ✅ | ✅ | ✅ | ❌ | ❌ |
| Process refunds | ✅ | ✅ | ✅ | ❌ | ❌ |
| View revenue | ✅ | ✅ | ✅ | ❌ | 👁️ |
| **Insurance** |
| View all policies | ✅ | ✅ | ✅ | ✅ | 👁️ |
| View location policies | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create policy | ✅ | ✅ | ✅ | ✅ | ❌ |
| Process renewals | ✅ | ✅ | ✅ | ✅ | ❌ |
| View commissions | ✅ | ✅ | ✅ | 👁️ | ❌ |
| **Payments (Razorpay)** |
| View transactions | ✅ | ✅ | ✅ | 👁️ | ❌ |
| Process refunds | ✅ | ✅ | ✅ | ❌ | ❌ |
| View settlement | ✅ | ✅ | ✅ | ❌ | ❌ |
| Configure payment | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Financial Reports** |
| View revenue reports | ✅ | ✅ | ✅ | 👁️ | 👁️ |
| View commission reports | ✅ | ✅ | ✅ | 👁️ | ❌ |
| Export reports | ✅ | ✅ | ✅ | ❌ | ❌ |

**Legend**: ✅ Full Access | 👁️ View Only | ❌ No Access

---

### Location-Based Access Control

| Role | Own Location | Assigned Locations | All Locations |
|------|:------------:|:------------------:|:-------------:|
| Super Admin | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ❌ |
| Sales Manager | ✅ | ❌ | ❌ |
| Sales Executive | ✅ | ❌ | ❌ |
| Service Manager | ✅ | ❌ | ❌ |
| Service Advisor | ✅ | ❌ | ❌ |
| Marketing Manager | - | - | ✅ (global) |
| Content Manager | - | - | ✅ (global) |
| Social Media Manager | - | - | ✅ (global) |
| Finance Manager | - | - | ✅ (global) |
| Insurance Executive | ✅ | ❌ | ❌ |
| Used Car Manager | ✅ | ❌ | ❌ |
| IT Admin | - | - | ✅ (global) |

**Locations**: Yelahanka, Whitefield, Avalahalli, Kolar, Varthur

---

### Data Visibility & Privacy Rules

```javascript
const dataVisibility = {
  // Customer PII (name, phone, email, address)
  customer_pii: {
    full_access: ['super_admin', 'admin', 'sales_manager', 'finance_manager'],
    masked_access: ['sales_executive', 'service_advisor', 'insurance_executive'],
    // masked: shows "John D***" and "98XXXXXX90"
    no_access: ['content_manager', 'social_media_manager', 'seo_specialist']
  },
  
  // Financial data (payments, revenue, commissions)
  financial_data: {
    full_access: ['super_admin', 'finance_manager'],
    summary_only: ['admin', 'sales_manager', 'service_manager'],
    no_access: ['*']
  },
  
  // Exchange valuation data
  valuation_data: {
    full_access: ['super_admin', 'admin', 'used_car_manager'],
    view_only: ['sales_manager', 'evaluator'],
    no_access: ['*']
  },
  
  // Lead source/campaign data
  lead_attribution: {
    full_access: ['super_admin', 'admin', 'marketing_manager'],
    view_only: ['sales_manager', 'seo_specialist'],
    no_access: ['*']
  }
};
```

---

### Approval Workflows by Role

| Approval Type | Who Can Initiate | Who Can Approve | Escalation |
|---------------|------------------|-----------------|------------|
| **Pricing Changes** | System (scraper) | Super Admin, Admin | Auto-alert after 2h |
| **New Offer** | Marketing Manager | Admin | Super Admin |
| **AI Blog Post** | System (AI) | Content Manager, Marketing Manager | Admin |
| **Social Media Post** | Social Media Manager | Marketing Manager | Admin |
| **Exchange < ₹5L** | Sales Exec, Evaluator | Used Car Manager | Admin |
| **Exchange ≥ ₹5L** | Used Car Manager | Admin | Super Admin |
| **Refund Request** | Any staff | Finance Manager | Admin |
| **User Creation** | Admin | Super Admin (for managers) | - |
| **Legal Content** | Content Manager | Super Admin + Legal | Mandatory 2 approvals |

---

### Audit Trail Requirements

All privileged actions are logged:

```typescript
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user_id: string;
  user_role: string;
  user_location: string;
  
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject' | 'export';
  resource_type: string;  // 'lead', 'offer', 'content', 'valuation', etc.
  resource_id: string;
  
  old_value?: object;  // For updates
  new_value?: object;
  
  ip_address: string;
  user_agent: string;
  session_id: string;
  
  // For sensitive actions
  requires_review?: boolean;
  reviewed_by?: string;
  reviewed_at?: Date;
}

// Sensitive actions that trigger alerts
const sensitiveActions = [
  'bulk_export_leads',
  'delete_customer',
  'modify_payment_config',
  'access_financial_reports',
  'approve_high_value_exchange',
  'modify_user_roles',
  'access_audit_logs'
];
```

---

### Default Roles Created Per Phase

**Phase 1 (Initial Setup):**
- Super Admin (1 - dealership owner)
- Admin (1-2 - general managers)
- Sales Manager (1 per location)
- Sales Executive (2-3 per location)
- Service Manager (1 per location)
- Service Advisor (2-3 per location)

**Phase 2 (Added):**
- Marketing Manager (1)
- Content Manager (1)
- SEO Specialist (1)
- IT Admin (1)

**Phase 3 (Added):**
- Social Media Manager (1)
- Used Car Manager (1-2)
- Evaluator (1-2 per location)

**Phase 4 (Added):**
- Finance Manager (1)
- Insurance Executive (1-2 per location)

---

### Implementation Notes

```typescript
// Middleware: Check permission before action
async function checkPermission(
  userId: string,
  resource: string,
  action: string,
  locationId?: string
): Promise<boolean> {
  const user = await getUser(userId);
  const userRoles = await getUserRoles(userId);
  
  for (const role of userRoles) {
    const permissions = await getRolePermissions(role.id);
    const hasPermission = permissions.some(p => 
      p.resource === resource && 
      p.action === action &&
      (p.location_scope === 'all' || 
       p.location_scope === 'assigned' && role.location_id === locationId ||
       p.location_scope === 'own' && role.location_id === locationId)
    );
    
    if (hasPermission) {
      await logAccess(userId, resource, action, locationId);
      return true;
    }
  }
  
  await logAccessDenied(userId, resource, action, locationId);
  return false;
}
```

---

# Success Metrics

## Phase 1 (Launch)
- All core features live and tested.
- Performance meets Core Web Vitals.
- Social media links visible.
- Google Maps dealer locator working.

## Phase 2 (AI & Engagement)
- AI chatbot handles 80%+ queries.
- 360° viewer on all models.
- Content auto-sync operational.
- Competitor comparison live.
- **Content freshness: 100% of Kia data updated within 7 days.**
- **Scraper success rate: 99%+ uptime.**

## Phase 3 (Self-Service & DMS)
- DMS integration live.
- Customer portal functional.
- Exchange estimator 90%+ accuracy.
- Voice agent in 4+ languages.
- Social media management active.
- **Approval queue turnaround: <2 hours for critical items.**
- **Zero stale content displayed to users.**

## Phase 4 (Commerce)
- ₹5L+ monthly accessories GMV.
- 100+ insurance policies sold.
- 50+ exchange leads per month.

## Dynamic Content Health Targets
| Metric | Target |
|--------|--------|
| Kia content freshness | < 7 days old |
| Competitor data freshness | < 24 hours old |
| Exchange valuation data | < 6 hours old |
| Scraper uptime | 99.5%+ |
| Critical approval SLA | < 2 hours |
| Data accuracy (audited) | 98%+ |
| Failed scrape recovery | < 30 minutes |

## 90-Day Goals
- 50% increase in test drive requests.
- 30% increase in service bookings.
- 40% of users engage with AI chatbot.
- 25% reduction in phone call volume.
- 20% of visitors check exchange value.
- **80% reduction in manual content updates.**
- **Zero data accuracy complaints from customers.**

---

*Last Updated: December 2024*
*Version: 5.0*
