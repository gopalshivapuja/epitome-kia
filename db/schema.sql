-- Data model for Epitome Kia
-- Relationships (cardinality)
-- CarModel (1) -> (many) Variant
-- Variant (1) -> (many) Specification
-- CarModel (1) -> (many) Offer (optional link)
-- Variant (1) -> (many) Offer (optional link)
-- Page (1) -> (many) FAQ
-- DealerLocation (1) -> (many) ServiceBooking
-- CustomerLead (1) -> (many) TestDriveRequest / ServiceBooking / PickupRequest
-- ChatSession (1) -> (many) ChatMessage
-- AIContentDraft (1) -> (many) AIContentReview

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE car_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  model_year INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT car_models_slug_unique UNIQUE (slug),
  CONSTRAINT car_models_model_year_check CHECK (model_year >= 1980)
);

CREATE INDEX car_models_active_idx ON car_models (is_active);

CREATE TABLE variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_model_id UUID NOT NULL REFERENCES car_models (id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  trim_level TEXT,
  base_price NUMERIC(12, 2),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT variants_slug_unique UNIQUE (slug),
  CONSTRAINT variants_base_price_check CHECK (base_price IS NULL OR base_price >= 0)
);

CREATE INDEX variants_car_model_idx ON variants (car_model_id);
CREATE INDEX variants_active_idx ON variants (is_active);

CREATE TABLE specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES variants (id),
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  unit TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT specifications_variant_key_unique UNIQUE (variant_id, spec_key)
);

CREATE INDEX specifications_variant_idx ON specifications (variant_id);

CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_model_id UUID REFERENCES car_models (id),
  variant_id UUID REFERENCES variants (id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT offers_slug_unique UNIQUE (slug),
  CONSTRAINT offers_date_range_check CHECK (end_at IS NULL OR end_at >= start_at),
  CONSTRAINT offers_target_check CHECK (
    car_model_id IS NOT NULL OR variant_id IS NOT NULL
  )
);

CREATE INDEX offers_car_model_idx ON offers (car_model_id);
CREATE INDEX offers_variant_idx ON offers (variant_id);
CREATE INDEX offers_active_idx ON offers (is_active);

CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT pages_slug_unique UNIQUE (slug),
  CONSTRAINT pages_publish_check CHECK (
    (is_published IS FALSE AND published_at IS NULL)
    OR (is_published IS TRUE AND published_at IS NOT NULL)
  )
);

CREATE INDEX pages_published_idx ON pages (is_published);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  author_name TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT blog_posts_slug_unique UNIQUE (slug),
  CONSTRAINT blog_posts_publish_check CHECK (
    (is_published IS FALSE AND published_at IS NULL)
    OR (is_published IS TRUE AND published_at IS NOT NULL)
  )
);

CREATE INDEX blog_posts_published_idx ON blog_posts (is_published);

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES pages (id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX faqs_page_idx ON faqs (page_id);
CREATE INDEX faqs_active_idx ON faqs (is_active);

CREATE TABLE dealer_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'IN',
  phone TEXT,
  email TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  hours TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT dealer_locations_slug_unique UNIQUE (slug)
);

CREATE INDEX dealer_locations_active_idx ON dealer_locations (is_active);
CREATE INDEX dealer_locations_city_idx ON dealer_locations (city);

CREATE TABLE customer_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  preferred_contact TEXT,
  source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT customer_leads_contact_check CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX customer_leads_email_idx ON customer_leads (email);
CREATE INDEX customer_leads_phone_idx ON customer_leads (phone);

CREATE TABLE test_drive_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_lead_id UUID NOT NULL REFERENCES customer_leads (id),
  car_model_id UUID REFERENCES car_models (id),
  variant_id UUID REFERENCES variants (id),
  preferred_date DATE NOT NULL,
  preferred_time TEXT,
  location_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT test_drive_status_check CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled'))
);

CREATE INDEX test_drive_customer_idx ON test_drive_requests (customer_lead_id);
CREATE INDEX test_drive_model_idx ON test_drive_requests (car_model_id);
CREATE INDEX test_drive_variant_idx ON test_drive_requests (variant_id);

CREATE TABLE service_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_lead_id UUID NOT NULL REFERENCES customer_leads (id),
  dealer_location_id UUID REFERENCES dealer_locations (id),
  car_model_id UUID REFERENCES car_models (id),
  variant_id UUID REFERENCES variants (id),
  service_date DATE NOT NULL,
  service_time TEXT,
  service_type TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT service_booking_status_check CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled'))
);

CREATE INDEX service_booking_customer_idx ON service_bookings (customer_lead_id);
CREATE INDEX service_booking_location_idx ON service_bookings (dealer_location_id);

CREATE TABLE pickup_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_lead_id UUID NOT NULL REFERENCES customer_leads (id),
  dealer_location_id UUID REFERENCES dealer_locations (id),
  pickup_address TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TEXT,
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT pickup_request_status_check CHECK (status IN ('requested', 'assigned', 'completed', 'cancelled'))
);

CREATE INDEX pickup_requests_customer_idx ON pickup_requests (customer_lead_id);
CREATE INDEX pickup_requests_location_idx ON pickup_requests (dealer_location_id);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_lead_id UUID REFERENCES customer_leads (id),
  session_topic TEXT,
  channel TEXT NOT NULL DEFAULT 'web',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX chat_sessions_customer_idx ON chat_sessions (customer_lead_id);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_session_id UUID NOT NULL REFERENCES chat_sessions (id),
  sender_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chat_messages_sender_check CHECK (sender_type IN ('customer', 'agent', 'assistant'))
);

CREATE INDEX chat_messages_session_idx ON chat_messages (chat_session_id);

CREATE TABLE ai_content_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content_type TEXT NOT NULL,
  draft_content TEXT NOT NULL,
  source_prompt TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT ai_content_drafts_slug_unique UNIQUE (slug),
  CONSTRAINT ai_content_drafts_status_check CHECK (status IN ('draft', 'in_review', 'approved', 'rejected'))
);

CREATE INDEX ai_content_drafts_type_idx ON ai_content_drafts (content_type);

CREATE TABLE ai_content_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID NOT NULL REFERENCES ai_content_drafts (id),
  reviewer_name TEXT NOT NULL,
  review_notes TEXT,
  status TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT ai_content_reviews_status_check CHECK (status IN ('approved', 'changes_requested', 'rejected'))
);

CREATE INDEX ai_content_reviews_draft_idx ON ai_content_reviews (draft_id);
