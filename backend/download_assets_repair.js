const fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const downloadImage = async (url, filepath) => {
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
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath); // Delete failed file
        return false;
    }
};

const fileExistsAndNotEmpty = (filepath) => {
    try {
        const stats = fs.statSync(filepath);
        return stats.size > 0;
    } catch (e) {
        return false;
    }
};

const brands_retry = [
    { name: 'maruti_suzuki.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Maruti_Suzuki_logo.svg' },
    { name: 'kia.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Kia_logo.svg' }, // Original
    { name: 'mahindra.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Mahindra_Rise_New_Logo.svg' },
    { name: 'skoda.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Skoda_Auto_logo_%282023%29.svg' }
];

// Fallback Generic Images (Unsplash)
const genericImages = {
    hatchback: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=500',
    sedan: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=500',
    suv: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500',
    luxury: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=500'
};

const models_retry = [
    // Verify list based on failures
    { name: '2-series.jpg', type: 'luxury', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/50219/2-series-gran-coupe-exterior-right-front-three-quarter-2.jpeg' },
    { name: '3-series.jpg', type: 'luxury', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139049/3-series-gran-limousine-exterior-right-front-three-quarter-2.jpeg' },
    { name: '5-series.jpg', type: 'luxury', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/124145/5-series-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'a-class.jpg', type: 'luxury', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/50409/a-class-limousine-exterior-right-front-three-quarter-4.jpeg' },
    { name: 'a6.jpg', type: 'luxury', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41035/a6-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'alto.jpg', type: 'hatchback', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/39013/alto-exterior-right-front-three-quarter-61.jpeg' },
    { name: 'amaze.jpg', type: 'sedan', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/amaze-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'aura.jpg', type: 'sedan', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140593/aura-exterior-right-front-three-quarter-7.jpeg' },
    { name: 'baleno.jpg', type: 'hatchback', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/112939/baleno-exterior-right-front-three-quarter-4.jpeg' },
    { name: 'brezza.jpg', type: 'suv', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/121345/brezza-exterior-right-front-three-quarter-5.jpeg' },
    { name: 'c-class.jpg', type: 'luxury', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/116203/c-class-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'camry.jpg', type: 'sedan', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/110235/camry-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'ciaz.jpg', type: 'sedan', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48542/ciaz-exterior-right-front-three-quarter-4.jpeg' },
    { name: 'e-class.jpg', type: 'luxury', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48017/e-class-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'i10.jpg', type: 'hatchback', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140591/grand-i10-nios-exterior-right-front-three-quarter-7.jpeg' },
    { name: 'jazz.jpg', type: 'hatchback', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48547/jazz-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'kushaq.jpg', type: 'suv', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/55159/kushaq-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'octavia.jpg', type: 'sedan', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/51261/octavia-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'polo.jpg', type: 'hatchback', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/45230/polo-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'seltos.jpg', type: 'suv', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144163/seltos-exterior-right-front-three-quarter.jpeg' },
    { name: 'sonet.jpg', type: 'suv', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139599/sonet-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'superb.jpg', type: 'sedan', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48367/superb-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'venue.jpg', type: 'suv', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/venue-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'verna.jpg', type: 'sedan', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144159/verna-exterior-right-front-three-quarter-6.jpeg' },
    { name: 'virtus.jpg', type: 'sedan', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/113245/virtus-exterior-right-front-three-quarter-6.jpeg' }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runRepair = async () => {
    // Brands
    const brandDir = path.join(__dirname, '../frontend/public/images/brands');
    for (const b of brands_retry) {
        const filepath = path.join(brandDir, b.name);
        if (fileExistsAndNotEmpty(filepath)) continue;

        console.log(`[RETRY] Brand: ${b.name}`);
        const success = await downloadImage(b.url, filepath);
        if (!success) {
            console.log(`[FAILED] Brand ${b.name}, skipping (user can fix manually or leaving broken for now)`);
        }
    }

    // Models
    const modelDir = path.join(__dirname, '../frontend/public/images/models');
    for (const m of models_retry) {
        const filepath = path.join(modelDir, m.name);
        if (fileExistsAndNotEmpty(filepath)) continue;

        console.log(`[RETRY] Model: ${m.name}`);
        let success = await downloadImage(m.url, filepath);

        if (!success) {
            console.log(`[FALLBACK] Using generic image for ${m.name}`);
            const genericUrl = genericImages[m.type] || genericImages['sedan'];
            await downloadImage(genericUrl, filepath);
        }

        await sleep(2000); // 2 second delay
    }

    console.log('Repair logic complete');
};

runRepair();
