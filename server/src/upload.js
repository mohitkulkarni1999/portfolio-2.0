// upload.js — configures multer.
// - On Vercel, or when cloud storage is configured (Supabase Storage or Vercel
//   Blob), files go to memory and the route pushes them to cloud storage.
// - Otherwise files are saved into the local uploads/ folder (local dev).

const multer = require('multer');
const path = require('path');

const useMemory =
  !!process.env.BLOB_READ_WRITE_TOKEN ||
  !!process.env.VERCEL ||
  (!!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY);

// On Vercel the filesystem is read-only, so always keep files in memory there.
// The route then pushes them to cloud storage, or returns a clear error.
const storage = useMemory
  ? multer.memoryStorage()
  : multer.diskStorage({
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
