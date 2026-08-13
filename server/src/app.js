// app.js — builds the Express app WITHOUT starting a listener.
// Used by both src/index.js (local `npm run dev`) and api/index.js (Vercel).

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const messagesRoutes = require('./routes/messages');
const sectionsRoutes = require('./routes/sections');
const crudRouter = require('./generic');

const app = express();

// --- middlewares -----------------------------------------------------------
app.use(cors());            // lets the React app (different port/domain) talk to us
app.use(express.json());    // reads JSON bodies sent by the frontend
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- routes ----------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/sections', sectionsRoutes);

// Content sections — each one is managed the same way (add/edit/delete/hide/order),
// so a single generic router powers them all.
app.use('/api/experiences', crudRouter({ table: 'experiences' }));
app.use('/api/expertise', crudRouter({ table: 'expertise' }));
app.use('/api/metrics', crudRouter({ table: 'metrics' }));
app.use('/api/achievements', crudRouter({ table: 'achievements' }));
app.use('/api/certifications', crudRouter({ table: 'certifications' }));
app.use('/api/articles', crudRouter({ table: 'articles', publicFilter: 'published = TRUE' }));
app.use('/api/gallery', crudRouter({ table: 'gallery' }));
app.use('/api/testimonials', crudRouter({ table: 'testimonials' }));

// simple health check so you can test the server in a browser
app.get('/', (req, res) => res.send('Portfolio API is running'));

// --- create a default admin on first run ------------------------------------
// username: admin   password: admin123   (idempotent — safe to call often)
async function seedAdmin() {
  const result = await pool.query('SELECT COUNT(*) FROM admin_users');
  if (Number(result.rows[0].count) === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
      ['admin', hash]
    );
    console.log('Default admin created -> username: admin | password: admin123');
  }
}

module.exports = { app, seedAdmin };
