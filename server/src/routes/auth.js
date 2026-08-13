// routes/auth.js — login endpoint
// Visitor logs in with username + password -> server checks the hash
// and hands back a token. The token is the "passport" for admin routes.

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // 1. find the user
    const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    const admin = result.rows[0];

    // 2. wrong username OR wrong password -> same message (don't reveal which)
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 3. correct -> create a token that expires in 7 days
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/change-password  (admin only)
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const result = await pool.query('SELECT * FROM admin_users WHERE id = $1', [req.admin.id]);
    const admin = result.rows[0];
    if (!admin || !(await bcrypt.compare(currentPassword, admin.password_hash))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [hash, req.admin.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
