# Personal Portfolio CMS with Admin Dashboard

A full-stack **personal portfolio CMS** where the entire public website is controlled from the
admin dashboard — no code changes needed for everyday content updates.

The flow is always:

```
Admin Dashboard  →  Backend API  →  Database  →  Public Landing Page
```

- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT (admin only), bcrypt password hashing
- **Uploads:** multer -> `server/uploads/`

## What the admin can manage (all database-driven)

- **Profile** — name, designation, headline, photo, contact details, social links
- **Hero** — heading, subheading, description, background image/video, profile photo, button text + links
- **About** — title, description, image, highlights
- **Experience** — career timeline (company, role, dates, responsibilities, achievements, team/business handled)
- **Expertise** — skills with category + icon
- **Metrics** — key numbers (value, label, description, icon) — real numbers only!
- **Achievements** — milestones with optional photo
- **Certifications** — certificates with image, organization, date
- **Testimonials** — reviews with rating, photo, order
- **Articles / Insights** — rich text articles with cover image, category, publish/unpublish
- **Gallery** — photo gallery with lightbox
- **Messages** — contact form inbox (view / mark read / delete)
- **Website Sections** — turn whole sections ON/OFF and reorder them (the landing page
  renders sections in the saved order, skipping disabled ones)
- **Settings** — change the admin password

Nothing on the landing page is hardcoded — every section fetches its content from the API.

## How to run (3 terminals)

### 1. Start PostgreSQL
Already running as a Windows service. If not:

```
net start postgresql-x64-18
```

### 2. Backend (port 5000)

```
cd server
npm install
npm run dev
```

On first run it creates a default admin automatically:

```
username: admin
password: admin123
```

### 3. Frontend (port 5173)

```
cd client
npm install
npm run dev
```

Open http://localhost:5173 (public site) and http://localhost:5173/admin/login (admin).

### Optional: reset the demo content (Rohit's editable sample data)

```
cd server
node seed-demo.js
```

## Setup from scratch (if the database doesn't exist yet)

```
psql -U postgres -h localhost -c "CREATE DATABASE portfolio;"
psql -U postgres -h localhost -d portfolio -f database/schema.sql
```

Already have an older database? Upgrade it to the full CMS schema:

```
psql -U postgres -h localhost -d portfolio -f database/migrate-cms.sql
```

Database credentials live in `server/.env` (copy `server/.env.example` first).
Change `JWT_SECRET` to something long and random.

## Folder layout

```
server/   Express API + uploads          (the brain)
client/   React + Tailwind website       (the face)
database/ schema.sql (full CMS schema)
database/ migrate-cms.sql (upgrade an old DB to the CMS schema)
```

## API overview

| Method | Endpoint                          | Access | Purpose                  |
| ------ | --------------------------------- | ------ | ------------------------ |
| POST   | /api/auth/login                   | public | admin login -> token     |
| POST   | /api/auth/change-password         | admin  | change admin password    |
| GET    | /api/profile                      | public | read profile             |
| PUT    | /api/profile                      | admin  | update profile           |
| POST   | /api/profile/upload               | admin  | upload an image          |
| GET    | /api/sections                     | public | section order + visibility |
| PUT    | /api/sections/reorder             | admin  | save a new section order |
| PUT    | /api/sections/:key                | admin  | toggle a section on/off  |
| GET    | /api/{experiences,expertise,metrics,achievements,certifications,testimonials,articles,gallery} | public | list content (visible / published only) |
| POST   | /api/{...same resources...}       | admin  | create item              |
| PUT    | /api/{resource}/:id               | admin  | update item (also hide/show, reorder) |
| DELETE | /api/{resource}/:id               | admin  | delete item              |
| POST   | /api/messages                     | public | visitor contact form     |
| GET    | /api/messages                     | admin  | read messages            |
| PUT    | /api/messages/:id/read            | admin  | mark read/unread         |
| DELETE | /api/messages/:id                 | admin  | delete message           |

> The content resources share one generic router (`server/src/generic.js`). Passing an admin
> token to `GET` also returns hidden/unpublished items so the dashboard can manage drafts.
> Public requests automatically filter to visible + published only.

Admin routes expect: `Authorization: Bearer <token>`

## Common mistakes beginners make (and how this project avoids them)

1. **Storing plain-text passwords** — never do this. We hash with `bcrypt` (`bcryptjs`).
2. **SQL injection** — never glue user input into SQL strings with `+`. We always use
   parameterized queries (`$1`, `$2`, ...).
3. **Forgetting CORS** — the React app (port 5173) talks to the API (port 5000). Without
   `cors()` on the server the browser blocks every request.
4. **Hard-coding the API URL** — we use a Vite dev proxy (`/api` -> `localhost:5000`), so the
   frontend never needs to know the server's address.
5. **Handling the password wrong on login** — always compare hashes with `bcrypt.compare()`,
   never `===`.
6. **Putting secrets in git** — `.env` is in `.gitignore`. Never commit DB passwords or the
   JWT secret.
7. **Wrong `Content-Type` on file uploads** — multipart uploads must NOT set
   `Content-Type: application/json`. The browser sets the right one automatically when you use
   `FormData` (see `api.uploadImage`).
8. **Letting anyone edit content** — every admin route runs the `auth` middleware. Requests
   without a valid token get `401`.
9. **Uploading non-images / huge files** — multer is configured with a file-type filter and a
   5MB size limit.
10. **Forgetting the `uploads/` folder exists** — it's served statically by the server
    (`/uploads/...`), so image URLs work as soon as the file is saved.
