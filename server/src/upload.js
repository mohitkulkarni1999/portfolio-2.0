// upload.js — configures multer to save uploaded images into the uploads/ folder

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
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
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;
