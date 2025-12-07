const fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const generatePlaceholderSvg = (text, width = 500, height = 300) => {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1a1a1a"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">${text}</text>
  </svg>`;
};

const downloadImage = async (url, filepath, textName) => {
    // Force delete if exists to avoid EPERM
    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    } catch (e) {
        console.error(`Could not delete ${filepath}: ${e.message}`);
    }

    try {
        const writer = fs.createWriteStream(filepath);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            httpsAgent,
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (err) {
        console.error(`Failed to download ${url}: ${err.message}`);
        // Fallback: Write SVG
        try {
            if (filepath.endsWith('.svg') || filepath.endsWith('.jpg') || filepath.endsWith('.jpeg')) {
                // If it's a jpg request but we write SVG content, browser might be confused if served as image/jpeg.
                // But local file system serving usually depends on extension.
                // If we replace .jpg with .svg, we need to update DB.
                // For now, let's just write a dummy JPG if possible? No, can't gen JPG easily.
                // Let's write the SVG content but we might need to change extension.
                // actually, for the brands (SVGs), it's fine.
                // For models (JPGs), if we write SVG code into .jpg, chrome might render it or might not.
                // Safer: Just use the generic fallback URL for models which we KNOW works.
                return false;
            }
        } catch (e) {
            console.error('Fallback failed');
        }
        return false;
    }
};

const brands_retry = [
    { name: 'maruti_suzuki.svg', text: 'Maruti Suzuki', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Maruti_Suzuki_logo.svg' },
    { name: 'kia.svg', text: 'Kia', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Kia_logo.svg' },
    { name: 'mahindra.svg', text: 'Mahindra', url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Mahindra_Rise_New_Logo.svg' },
    { name: 'skoda.svg', text: 'Skoda', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Skoda_Auto_logo_%282023%29.svg' }
];

const genericImages = {
    hatchback: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=500',
    sedan: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=500',
    suv: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500',
    luxury: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=500'
};

const models_retry = [
    { name: '2-series.jpg', type: 'luxury', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/50219/2-series-gran-coupe-exterior-right-front-three-quarter-2.jpeg' },
    { name: '3-series.jpg', type: 'luxury', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139049/3-series-gran-limousine-exterior-right-front-three-quarter-2.jpeg' },
    // ... (Adding a few representative ones, assume the loop covers all)
    // I will iterate all files in directory that are empty
];

const runRepair = async () => {
    // Brands
    const brandDir = path.join(__dirname, '../frontend/public/images/brands');
    for (const b of brands_retry) {
        const filepath = path.join(brandDir, b.name);
        // Check if file is small (under 100 bytes is likely failed/empty)
        let needsRepair = true;
        try {
            if (fs.existsSync(filepath) && fs.statSync(filepath).size > 500) needsRepair = false;
        } catch (e) { }

        if (needsRepair) {
            console.log(`[REPAIR] Brand: ${b.name}`);
            const success = await downloadImage(b.url, filepath);
            if (!success) {
                console.log(`[GENERATE] Brand Placeholder: ${b.name}`);
                fs.writeFileSync(filepath, generatePlaceholderSvg(b.text));
            }
        }
    }

    // Models - iterate all jpgs in the folder and check size
    const modelDir = path.join(__dirname, '../frontend/public/images/models');
    if (fs.existsSync(modelDir)) {
        const files = fs.readdirSync(modelDir);
        for (const file of files) {
            const filepath = path.join(modelDir, file);
            // If file is empty or very small (failed download)
            let isBroken = false;
            try {
                if (fs.statSync(filepath).size < 1000) isBroken = true;
            } catch (e) { isBroken = true; }

            if (isBroken) {
                console.log(`[REPAIR] Model: ${file}`);
                // Determine type based on name (rough guess or default)
                let type = 'sedan';
                if (file.includes('suv') || file.includes('creta') || file.includes('brezza')) type = 'suv';
                if (file.includes('alto') || file.includes('swift')) type = 'hatchback';

                const fallbackUrl = genericImages[type];
                await downloadImage(fallbackUrl, filepath);
            }
        }
    }

    console.log('Repair logic complete');
};

runRepair();
