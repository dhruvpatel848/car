const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../frontend/public/images/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Get name from body (Services use 'title', Cars use 'name')
        // IMPORTANT: Frontend MUST append 'title'/'name' BEFORE 'image'/'logo' in FormData
        const rawName = req.body.title || req.body.name || 'uploaded-image';

        // Sanitize name: lowercase, remove special chars, replace spaces with hyphens
        const sanitized = rawName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        // Get extension
        const ext = path.extname(file.originalname);

        // Final filename: name + timestamp (to avoid browser caching issues if same name uploaded) + extension
        // User asked for "same name", but adding a short timestamp is safer for updates. 
        // Let's stick closer to "same name" but handle duplicates if needed.
        // If we strictly follow "edit name as which is added by user as same name", 
        // we might overwrite. Let's start with just the name-based filename.
        // To prevent caching issues when "updating" the image for the same item, 
        // we might need a timestamp or the frontend needs cache busting (which we added).

        const filename = `${sanitized}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|svg|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, png, svg, webp) are allowed'));
        }
    }
});

module.exports = upload;
