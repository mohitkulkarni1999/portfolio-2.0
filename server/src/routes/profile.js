// routes/profile.js — profile info (hero, about, socials)
// GET  /api/profile            -> public, anyone can read
// PUT  /api/profile            -> admin only, updates the single row
// POST /api/profile/upload     -> admin only, uploads a photo

const express = require('express');
const path = require('path');
const pool = require('../db');
const auth = require('../middleware/auth');
const upload = require('../upload');

const router = express.Router();

// Make sure the profile table always has exactly one row.
// Called before read/write so we never get "row not found".
async function ensureProfileRow() {
  const check = await pool.query('SELECT * FROM profile');
  if (check.rows.length === 0) {
    await pool.query(
      `INSERT INTO profile (name, title) VALUES ('Your Name', 'Your Title')`
    );
  }
}

// GET /api/profile  (public)
router.get('/', async (req, res) => {
  try {
    await ensureProfileRow();
    const result = await pool.query('SELECT * FROM profile LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/profile  (admin only)
router.put('/', auth, async (req, res) => {
  try {
    await ensureProfileRow();
    const {
      name, title, headline, intro, bio, about_title, highlights, experience,
      photo_url, cover_image, about_image,
      hero_heading, hero_subheading, hero_description,
      btn_primary_text, btn_primary_link, btn_secondary_text, btn_secondary_link,
      email, phone, location,
      github, linkedin, twitter, instagram,
    } = req.body;

    // $1..$23 are placeholders; the values array fills them in.
    // This is called a "parameterized query" and it stops SQL injection.
    // (|| '' turns missing fields into empty strings instead of NULL,
    //  because the columns do not allow NULL.)
    const result = await pool.query(
      `UPDATE profile SET
         name = $1, title = $2, headline = $3, intro = $4, bio = $5,
         about_title = $6, highlights = $7, experience = $8, photo_url = $9,
         cover_image = $10, about_image = $11, hero_heading = $12, hero_subheading = $13,
         hero_description = $14, btn_primary_text = $15, btn_primary_link = $16,
         btn_secondary_text = $17, btn_secondary_link = $18, email = $19,
         phone = $20, location = $21, github = $22, linkedin = $23,
         twitter = $24, instagram = $25,
         updated_at = NOW()
       WHERE id = (SELECT id FROM profile LIMIT 1)
       RETURNING *`,
      [name || '', title || '', headline || '', intro || '', bio || '',
       about_title || '', highlights || '', experience || '', photo_url || '',
       cover_image || '', about_image || '', hero_heading || '', hero_subheading || '',
       hero_description || '', btn_primary_text || '', btn_primary_link || '',
       btn_secondary_text || '', btn_secondary_link || '', email || '',
       phone || '', location || '', github || '', linkedin || '',
       twitter || '', instagram || '']
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/profile/upload  (admin only) — photo upload with preview support
router.post('/upload', auth, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    // On Vercel (Blob mode) the file is in memory -> store it in Vercel Blob.
    if (req.file.buffer) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return res.status(500).json({
          message: 'Uploads not configured. Set BLOB_READ_WRITE_TOKEN (Vercel Blob) on the backend.',
        });
      }
      const { put } = require('@vercel/blob');
      const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(req.file.originalname);
      const blob = await put(name, req.file.buffer, { access: 'public' });
      return res.json({ url: blob.url });
    }
    // Local dev: serve from the uploads/ folder
    res.json({ url: '/uploads/' + req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
