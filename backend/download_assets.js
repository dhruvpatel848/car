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

const brands = [
    { name: 'maruti_suzuki.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Suzuki_logo_2.svg' },
    { name: 'hyundai.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' },
    { name: 'tata.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg' },
    { name: 'honda.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg' },
    { name: 'volkswagen.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg' },
    { name: 'skoda.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Skoda_Auto_logo_%282023%29.svg' },
    { name: 'toyota.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg' },
    { name: 'kia.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Kia_logo.svg' },
    { name: 'mercedes.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_logo.svg' },
    { name: 'bmw.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
    { name: 'audi.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
    { name: 'mahindra.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Mahindra_Rise_New_Logo.svg' },
    { name: 'ford.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg' }
];

const models = [
    // Hatchback
    { name: 'alto.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/39013/alto-exterior-right-front-three-quarter-61.jpeg' },
    { name: 'wagonr.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/112947/wagon-r-2022-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'swift.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/54399/swift-exterior-right-front-three-quarter-64.jpeg' },
    { name: 'i10.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140591/grand-i10-nios-exterior-right-front-three-quarter-7.jpeg' },
    // Premium Hatchback
    { name: 'baleno.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/112939/baleno-exterior-right-front-three-quarter-4.jpeg' },
    { name: 'i20.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40530/i20-exterior-right-front-three-quarter-5.jpeg' },
    { name: 'altroz.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/32597/altroz-exterior-right-front-three-quarter-79.jpeg' },
    { name: 'jazz.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48547/jazz-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'polo.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/45230/polo-exterior-right-front-three-quarter-2.jpeg' },
    // Compact Sedan
    { name: 'dzire.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/45691/dzire-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'amaze.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/amaze-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'aura.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140593/aura-exterior-right-front-three-quarter-7.jpeg' },
    // Mid-size Sedan
    { name: 'city.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg' },
    { name: 'verna.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144159/verna-exterior-right-front-three-quarter-6.jpeg' },
    { name: 'ciaz.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48542/ciaz-exterior-right-front-three-quarter-4.jpeg' },
    { name: 'virtus.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/113245/virtus-exterior-right-front-three-quarter-6.jpeg' },
    // Executive Sedan
    { name: 'superb.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48367/superb-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'octavia.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/51261/octavia-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'camry.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/110235/camry-exterior-right-front-three-quarter-3.jpeg' },
    // Compact SUV
    { name: 'brezza.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/121345/brezza-exterior-right-front-three-quarter-5.jpeg' },
    { name: 'venue.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/venue-exterior-right-front-three-quarter-3.jpeg' },
    { name: 'sonet.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139599/sonet-exterior-right-front-three-quarter-2.jpeg' },
    // Mid-size SUV
    { name: 'creta.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg' },
    { name: 'seltos.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144163/seltos-exterior-right-front-three-quarter.jpeg' },
    { name: 'kushaq.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/55159/kushaq-exterior-right-front-three-quarter-3.jpeg' },
    // Full-size SUV
    { name: 'fortuner.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-19.jpeg' },
    { name: 'endeavour.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/37640/endeavour-exterior-right-front-three-quarter-149473.jpeg' },
    { name: 'xuv700.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter-3.jpeg' },
    // Luxury
    { name: 'a-class.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/50409/a-class-limousine-exterior-right-front-three-quarter-4.jpeg' },
    { name: '2-series.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/50219/2-series-gran-coupe-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'c-class.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/116203/c-class-exterior-right-front-three-quarter-2.jpeg' },
    { name: '3-series.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139049/3-series-gran-limousine-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'a4.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/51909/a4-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'e-class.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48017/e-class-exterior-right-front-three-quarter-3.jpeg' },
    { name: '5-series.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/124145/5-series-exterior-right-front-three-quarter-2.jpeg' },
    { name: 'a6.jpg', url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41035/a6-exterior-right-front-three-quarter-3.jpeg' }
];

const run = async () => {
    // Brands
    const brandDir = path.join(__dirname, '../frontend/public/images/brands');
    if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

    for (const b of brands) {
        console.log(`Downloading ${b.name}...`);
        await downloadImage(b.url, path.join(brandDir, b.name));
    }

    // Models
    const modelDir = path.join(__dirname, '../frontend/public/images/models');
    if (!fs.existsSync(modelDir)) fs.mkdirSync(modelDir, { recursive: true });

    for (const m of models) {
        console.log(`Downloading ${m.name}...`);
        await downloadImage(m.url, path.join(modelDir, m.name));
    }

    console.log('Download complete');
};

run();
