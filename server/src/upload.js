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

// image-only uploader (profile photos, hero/about images, etc.)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 }, // max 4MB (fits Vercel's function limit)
});

// images + documents (certificates: PDF, Word, Excel, PowerPoint, text)
const DOC_MIMES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
  'application/msword',                                            // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel',                                      // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',      // .xlsx
  'application/vnd.ms-powerpoint',                                 // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'text/plain',                                                    // .txt
];

const uploadDoc = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (DOC_MIMES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only images and documents are allowed (PDF, Word, Excel, PowerPoint, text)'));
  },
  limits: { fileSize: 15 * 1024 * 1024 }, // max 15MB
});

module.exports = { upload, uploadDoc };
