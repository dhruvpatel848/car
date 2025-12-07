const fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');

// Ignore SSL errors for download
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const downloadImage = async (url, filepath) => {
    try {
        const writer = fs.createWriteStream(filepath);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            httpsAgent,
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
    }
};

// Retry failed brands with alternative URLs
const failedBrands = [
    { name: 'maruti_suzuki.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Maruti_Suzuki_logo.svg' },
    { name: 'skoda.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Skoda_Auto_logo_%282023%29.svg' },
    { name: 'kia.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Kia_Motors_logo.svg' }, // Fallback to older if new one fails or try another source
    { name: 'mercedes.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg' }
];

// Fallback for Kia if previous failed (let's try a simpler one)
// skoda 2023 might be flaky, let's try standard logo

const run = async () => {
    const brandDir = path.join(__dirname, '../frontend/public/images/brands');
    if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

    for (const b of failedBrands) {
        console.log(`Retrying ${b.name}...`);
        await downloadImage(b.url, path.join(brandDir, b.name));
    }
    console.log('Retry complete');
};

run();
