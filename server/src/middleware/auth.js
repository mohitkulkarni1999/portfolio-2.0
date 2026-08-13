// auth.js — the "bouncer" middleware
// Checks if the request has a valid token in the Authorization header.
// If yes, we trust the user is the admin and let the request through.

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Frontend sends:  Authorization: Bearer <token>
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  const token = header.split(' ')[1];

  try {
    // verify() throws if the token is fake or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // remember who this is, for later steps
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}

module.exports = auth;
