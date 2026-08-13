-- ============================================================
-- Portfolio Website - Database Schema
-- Run this file AFTER creating the database:  psql -U postgres -d portfolio -f database/schema.sql
-- ============================================================

-- 1. admin_users  -> the people allowed to log in to the dashboard
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. profile  -> ONE row holds ALL personal + hero + about + contact settings
CREATE TABLE IF NOT EXISTS profile (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL DEFAULT '',            -- designation (e.g. "VP – Sales & Strategy")
  headline    TEXT NOT NULL DEFAULT '',            -- hero subheading line
  intro       TEXT NOT NULL DEFAULT '',            -- short intro
  bio         TEXT NOT NULL DEFAULT '',            -- about description
  about_title TEXT NOT NULL DEFAULT '',            -- heading of the About section
  highlights  TEXT NOT NULL DEFAULT '',            -- About bullets, one per line
  experience  TEXT NOT NULL DEFAULT '',            -- legacy field (metrics replace this)
  photo_url   TEXT NOT NULL DEFAULT '',            -- profile photo
  cover_image TEXT NOT NULL DEFAULT '',            -- hero background image/video
  about_image TEXT NOT NULL DEFAULT '',            -- image shown in the About section
  hero_heading     TEXT NOT NULL DEFAULT '',       -- Hero heading (defaults to name)
  hero_subheading  TEXT NOT NULL DEFAULT '',       -- Hero subheading (defaults to headline)
  hero_description TEXT NOT NULL DEFAULT '',       -- Hero description (defaults to intro)
  btn_primary_text   TEXT NOT NULL DEFAULT '',     -- Hero primary button label
  btn_primary_link   TEXT NOT NULL DEFAULT '',     -- Hero primary button target
  btn_secondary_text TEXT NOT NULL DEFAULT '',     -- Hero secondary button label
  btn_secondary_link TEXT NOT NULL DEFAULT '',     -- Hero secondary button target
  email       TEXT NOT NULL DEFAULT '',
  phone       TEXT NOT NULL DEFAULT '',
  location    TEXT NOT NULL DEFAULT '',
  github      TEXT NOT NULL DEFAULT '',
  linkedin    TEXT NOT NULL DEFAULT '',
  twitter     TEXT NOT NULL DEFAULT '',
  instagram   TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. portfolio_items  -> the property/listing grid on the public site
CREATE TABLE IF NOT EXISTS portfolio_items (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  link        TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT '',
  location    TEXT NOT NULL DEFAULT '',
  price       TEXT NOT NULL DEFAULT '',
  beds        TEXT NOT NULL DEFAULT '',
  baths       TEXT NOT NULL DEFAULT '',
  area        TEXT NOT NULL DEFAULT '',
  sort_order  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. services  -> the services list
CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '',
  sort_order  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. testimonials  -> reviews from clients
CREATE TABLE IF NOT EXISTS testimonials (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  company     TEXT NOT NULL DEFAULT '',
  content     TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT NOT NULL DEFAULT '',
  rating      INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. messages  -> contact form submissions from visitors
CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL DEFAULT '',
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. experiences  -> career timeline entries
CREATE TABLE IF NOT EXISTS experiences (
  id                SERIAL PRIMARY KEY,
  company           TEXT NOT NULL,
  designation       TEXT NOT NULL DEFAULT '',
  start_date        TEXT NOT NULL DEFAULT '',
  end_date          TEXT NOT NULL DEFAULT '',
  description       TEXT NOT NULL DEFAULT '',
  responsibilities  TEXT NOT NULL DEFAULT '',   -- one per line
  achievements      TEXT NOT NULL DEFAULT '',   -- one per line
  team_handled      TEXT NOT NULL DEFAULT '',
  business_handled  TEXT NOT NULL DEFAULT '',
  sort_order        INT  NOT NULL DEFAULT 0,
  is_visible        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. expertise  -> skills / strengths
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

-- 9. metrics  -> key numbers (e.g. 12+ Years Experience)
CREATE TABLE IF NOT EXISTS metrics (
  id          SERIAL PRIMARY KEY,
  value       TEXT NOT NULL,           -- the big number, e.g. "12+"
  label       TEXT NOT NULL DEFAULT '',-- e.g. "Years Experience"
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '',
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. achievements  -> wins, awards, milestones
CREATE TABLE IF NOT EXISTS achievements (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. certifications  -> courses / certificates
CREATE TABLE IF NOT EXISTS certifications (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  date         TEXT NOT NULL DEFAULT '',
  image_url    TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  sort_order   INT  NOT NULL DEFAULT 0,
  is_visible   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. articles  -> professional insights / blog
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

-- 13. gallery  -> photo gallery
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

-- 14. sections  -> which landing-page sections exist, their order + visibility
CREATE TABLE IF NOT EXISTS sections (
  id          SERIAL PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  label       TEXT NOT NULL,
  sort_order  INT  NOT NULL DEFAULT 0,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE
);
