// upload.js — configures multer.
// - With a Vercel Blob token (BLOB_READ_WRITE_TOKEN) files go to memory and the
//   route pushes them to Vercel Blob storage (persistent on serverless).
// - Otherwise files are saved into the local uploads/ folder (local dev).

const multer = require('multer');
const path = require('path');

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN || !!process.env.VERCEL;

// On Vercel the filesystem is read-only, so always keep files in memory there.
// The route then pushes them to Vercel Blob (if a token is set) or returns a
// clear error. Local dev keeps writing to uploads/ as before.
const storage = useBlob ? multer.memoryStorage() : multer.diskStorage({
      // where to save the file
      destination: (req, file, cb) => cb(null, 'uploads/'),

      // what name to give it: current-time + original-name (avoids name clashes)
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
      },
    });

// only allow images, reject everything else
function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed'));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 }, // max 4MB (fits Vercel's function limit)
});

module.exports = upload;
