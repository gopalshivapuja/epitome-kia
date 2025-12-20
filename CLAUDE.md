# CLAUDE.md - AI Assistant Guide for Epitome Kia

## Project Overview

Epitome Kia is a dealership website for a Kia car dealership. The site aims to drive vehicle discovery, lead capture, test drive scheduling, and service bookings while aligning with Kia brand standards.

**Current Status**: Early development stage - PRD and database schema defined, implementation pending.

## Repository Structure

```
epitome-kia/
├── README.md           # Project description
├── PRD.md              # Product Requirements Document (detailed feature specs)
├── CLAUDE.md           # This file - AI assistant guidelines
└── db/
    └── schema.sql      # PostgreSQL database schema
```

## Key Documentation

### PRD.md
The Product Requirements Document contains:
- Goals and non-goals
- User personas (car buyers, service customers, dealership staff)
- User journeys (model discovery, offers, financing, service booking, chatbot)
- KPIs and success metrics
- Feature requirements for 8 major modules
- Content strategy and compliance requirements

### db/schema.sql
PostgreSQL schema defining core entities:

**Vehicle Catalog**
- `car_models` - Kia vehicle models with year, slug, active status
- `variants` - Model variants/trims with pricing
- `specifications` - Key-value specs per variant

**Offers & Content**
- `offers` - Promotions linked to models or variants
- `pages` - CMS pages with SEO fields
- `blog_posts` - Blog content with publish workflow
- `faqs` - FAQs linked to pages

**Dealer Operations**
- `dealer_locations` - Physical dealership locations with geo data

**Customer Interactions**
- `customer_leads` - Lead capture (requires email or phone)
- `test_drive_requests` - Test drive scheduling
- `service_bookings` - Service appointments
- `pickup_requests` - Vehicle pickup scheduling

**Chat System**
- `chat_sessions` - Chatbot conversations
- `chat_messages` - Individual messages (customer/agent/assistant)

**AI Content Management**
- `ai_content_drafts` - AI-generated content drafts
- `ai_content_reviews` - Editorial review workflow

## Database Conventions

When working with the database schema:

1. **Primary Keys**: Use UUID v4 (`uuid_generate_v4()`)
2. **Soft Deletes**: All tables have `deleted_at TIMESTAMPTZ` for soft deletion
3. **Audit Fields**: Always include `created_at` and `updated_at` with `DEFAULT NOW()`
4. **Slugs**: URL-friendly identifiers with unique constraints
5. **Status Enums**: Use CHECK constraints for status fields (e.g., `'pending'`, `'scheduled'`, `'completed'`, `'cancelled'`)
6. **Active Flags**: Use `is_active BOOLEAN NOT NULL DEFAULT TRUE` for toggleable records
7. **Indexes**: Create indexes on foreign keys, status fields, and frequently queried columns

## Development Guidelines

### When Adding New Features

1. **Check PRD.md first** - Features should align with documented requirements
2. **Follow existing patterns** - Match the established database conventions
3. **Consider all personas** - New car buyers, service customers, and dealership staff
4. **Mobile-first** - Core Web Vitals and mobile performance are KPIs

### When Modifying Database Schema

1. Add soft delete support (`deleted_at TIMESTAMPTZ`)
2. Include audit timestamps (`created_at`, `updated_at`)
3. Use UUID primary keys
4. Add appropriate indexes
5. Use CHECK constraints for enumerated values
6. Document relationships in comments

### Code Style Expectations (for future implementation)

- Follow Kia brand guidelines for UI components
- Implement proper form validation with CAPTCHA
- Use HTTPS everywhere
- Handle data privacy (GDPR/CCPA compliance)
- Explicit consent for marketing communications

## Key Business Rules

1. **Lead Capture**: Customer leads must have either email OR phone (enforced by DB constraint)
2. **Offers**: Must be linked to either a car model OR variant (not neither)
3. **Publishing**: Pages and blog posts require `published_at` when `is_published = TRUE`
4. **Date Ranges**: Offer `end_at` must be >= `start_at` when specified
5. **Model Years**: Must be >= 1980 (constraint on car_models)
6. **Prices**: Must be >= 0 when specified

## Integration Points

The system is designed to integrate with:
- Kia national content feeds (models, specs, images)
- Dealership CRM/DMS systems
- Inventory management systems (data source, not replacement)
- Analytics (GA4, CRM tracking, call tracking)

## Common Tasks

### Adding a New Car Model
1. Insert into `car_models` with unique slug
2. Add variants to `variants` table
3. Add specifications for each variant
4. Optionally create offers

### Creating a Lead Flow
1. Insert customer into `customer_leads`
2. Create related request (test_drive_requests, service_bookings, or pickup_requests)
3. Update status as workflow progresses

### Managing AI Content
1. Create draft in `ai_content_drafts` with status 'draft'
2. Move to 'in_review' when ready
3. Add review in `ai_content_reviews`
4. Update draft status to 'approved' or 'rejected'

## Entity Relationships

```
CarModel (1) ──→ (many) Variant
Variant (1) ──→ (many) Specification
CarModel (1) ──→ (many) Offer (optional)
Variant (1) ──→ (many) Offer (optional)
Page (1) ──→ (many) FAQ
DealerLocation (1) ──→ (many) ServiceBooking
CustomerLead (1) ──→ (many) TestDriveRequest
CustomerLead (1) ──→ (many) ServiceBooking
CustomerLead (1) ──→ (many) PickupRequest
ChatSession (1) ──→ (many) ChatMessage
AIContentDraft (1) ──→ (many) AIContentReview
```

## Security Considerations

- Secure form submissions
- CAPTCHA for spam reduction
- Data retention limits per privacy laws
- Cookie consent management
- Explicit marketing opt-in/opt-out

## Phase Roadmap

**Phase 1** (Current scope):
- Model catalog
- Offers management
- Test drive scheduling
- Service booking
- EMI tools
- Chatbot
- Admin workflows
- Analytics

**Phase 2** (Future):
- AI blog and content automation
- Deeper personalization
- Advanced CRM integrations
