const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Serve image by name (auto-resolve extension)
router.get('/:name', (req, res) => {
    const rawName = req.params.name;
    // Sanitize to match upload logic
    const sanitizedName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const uploadDir = path.join(__dirname, '../..', 'frontend/public/images/uploads');

    // Check for files matching name.*
    try {
        if (!fs.existsSync(uploadDir)) {
            return res.status(404).send('Directory not found');
        }

        const files = fs.readdirSync(uploadDir);
        const match = files.find(file => {
            const namePart = path.parse(file).name;
            return namePart === sanitizedName;
        });

        if (match) {
            res.sendFile(path.join(uploadDir, match));
        } else {
            // Fallback: Try looking in models/brands folders if not found in uploads (for seeded data)
            const fallbackDirs = [
                path.join(__dirname, '../..', 'frontend/public/images/models'),
                path.join(__dirname, '../..', 'frontend/public/images/brands')
            ];

            let fallbackMatch = null;
            let fallbackPath = null;

            for (const dir of fallbackDirs) {
                if (fs.existsSync(dir)) {
                    const fFiles = fs.readdirSync(dir);
                    const fMatch = fFiles.find(file => path.parse(file).name === sanitizedName);
                    if (fMatch) {
                        fallbackMatch = fMatch;
                        fallbackPath = dir;
                        break;
                    }
                }
            }

            if (fallbackMatch) {
                res.sendFile(path.join(fallbackPath, fallbackMatch));
            } else {
                res.status(404).send('Image not found');
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
