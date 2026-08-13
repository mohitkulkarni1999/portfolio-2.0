// routes/sections.js — controls which landing-page sections show, and their order
// GET  /api/sections           -> public, all sections (with is_visible + sort_order)
// PUT  /api/sections/reorder   -> admin, saves a whole new order
// PUT  /api/sections/:key      -> admin, toggle visibility / update one section

const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/sections  (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sections ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/sections/reorder  (admin)  body: { order: ["hero", "about", ...] }
router.put('/reorder', auth, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ message: 'order must be an array of section keys' });
    }
    for (let i = 0; i < order.length; i++) {
      await pool.query('UPDATE sections SET sort_order = $1 WHERE section_key = $2', [i + 1, order[i]]);
    }
    const result = await pool.query('SELECT * FROM sections ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/sections/:key  (admin)  body: { is_visible: false } or { sort_order: 5 }
router.put('/:key', auth, async (req, res) => {
  try {
    const { is_visible, sort_order } = req.body;
    const result = await pool.query(
      `UPDATE sections
          SET is_visible = COALESCE($1, is_visible),
              sort_order = COALESCE($2, sort_order)
        WHERE section_key = $3
        RETURNING *`,
      [is_visible === undefined ? null : !!is_visible,
       sort_order === undefined ? null : Number(sort_order),
       req.params.key]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Section not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
