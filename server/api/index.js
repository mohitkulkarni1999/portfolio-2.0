// api/index.js — Vercel serverless entry point.
// Vercel rewrites all /api and /uploads requests to this function,
// which just runs the normal Express app. The original request path is
// preserved, so the Express routes keep their /api/... prefixes.

const { app } = require('../src/app');

module.exports = app;
