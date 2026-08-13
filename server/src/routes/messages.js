// routes/messages.js — contact form messages
// POST /          -> public, visitors submit a message
// GET /           -> admin only, read all messages
// PUT /:id/read   -> admin only, mark a message as read
// DELETE /:id     -> admin only, delete a message

const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/messages  (public) — save a visitor's message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const result = await pool.query(
      `INSERT INTO messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, email, subject || '', message]
    );

    res.status(201).json({ message: 'Message sent successfully', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages  (admin) — list all messages, newest first
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/messages/:id/read  (admin) — mark read/unread
router.put('/:id/read', auth, async (req, res) => {
  try {
    const isRead = req.body.is_read ? true : false;
    const result = await pool.query(
      'UPDATE messages SET is_read = $1 WHERE id = $2 RETURNING *',
      [isRead, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/messages/:id  (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
