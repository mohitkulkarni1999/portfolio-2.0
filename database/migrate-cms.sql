-- migrate-cms.sql — upgrade an existing database to the full CMS schema
-- Run: psql -U postgres -d portfolio -f database/migrate-cms.sql

-- profile: add hero / about / contact columns
ALTER TABLE profile ADD COLUMN IF NOT EXISTS headline TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS about_title TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS highlights TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS cover_image TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS about_image TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS hero_heading TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS hero_subheading TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS hero_description TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS btn_primary_text TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS btn_primary_link TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS btn_secondary_text TEXT NOT NULL DEFAULT '';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS btn_secondary_link TEXT NOT NULL DEFAULT '';

-- content tables gain sort_order + is_visible so the admin can order and hide them
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS experiences (
  id                SERIAL PRIMARY KEY,
  company           TEXT NOT NULL,
  designation       TEXT NOT NULL DEFAULT '',
  start_date        TEXT NOT NULL DEFAULT '',
  end_date          TEXT NOT NULL DEFAULT '',
  description       TEXT NOT NULL DEFAULT '',
  responsibilities  TEXT NOT NULL DEFAULT '',
  achievements      TEXT NOT NULL DEFAULT '',
  team_handled      TEXT NOT NULL DEFAULT '',
  business_handled  TEXT NOT NULL DEFAULT '',
  sort_order        INT  NOT NULL DEFAULT 0,
  is_visible        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expertise (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '',
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metrics (
  id          SERIAL PRIMARY KEY,
  value       TEXT NOT NULL,
  label       TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '',
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  date         TEXT NOT NULL DEFAULT '',
  image_url    TEXT NOT NULL DEFAULT '',
  file_url     TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  sort_order   INT  NOT NULL DEFAULT 0,
  is_visible   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT '',
  content      TEXT NOT NULL DEFAULT '',
  cover_image  TEXT NOT NULL DEFAULT '',
  published    BOOLEAN NOT NULL DEFAULT TRUE,
  article_date TEXT NOT NULL DEFAULT '',
  sort_order   INT  NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id          SERIAL PRIMARY KEY,
  image_url   TEXT NOT NULL,
  title       TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT '',
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sections (
  id          SERIAL PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  label       TEXT NOT NULL,
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE
);

-- default sections (order + visibility can be changed from the admin dashboard)
INSERT INTO sections (section_key, label, sort_order, is_visible) VALUES
  ('hero',          'Hero',          1,  TRUE),
  ('about',         'About',         2,  TRUE),
  ('experience',    'Experience',    3,  TRUE),
  ('expertise',     'Expertise',     4,  TRUE),
  ('metrics',       'Metrics',       5,  TRUE),
  ('achievements',  'Achievements',  6,  TRUE),
  ('certifications','Certifications',7,  TRUE),
  ('testimonials',  'Testimonials',  8,  TRUE),
  ('articles',      'Articles',      9,  TRUE),
  ('gallery',       'Gallery',       10, TRUE),
  ('contact',       'Contact',       11, TRUE)
ON CONFLICT (section_key) DO NOTHING;
