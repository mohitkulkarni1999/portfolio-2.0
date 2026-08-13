// index.js — local entry point. This file STARTS the server.
// Run it with:  npm run dev
// (Vercel uses api/index.js instead and imports the app from ./app)

const { app, seedAdmin } = require('./app');

const PORT = process.env.PORT || 5000;

seedAdmin()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
