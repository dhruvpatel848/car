const mongoose = require('mongoose');
const dotenv = require('dotenv');
const XLSX = require('xlsx');
const path = require('path');

dotenv.config();

// Schemas
const settingsSchema = new mongoose.Schema({}, { strict: false });
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    // ... other fields
}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

const cleanPrice = (rawPrice) => {
    let price = parseInt(rawPrice);
    if (!price) return 0;
    // Heuristic: Remove last digit if > 2000 and ends in 1-5 (likely footnote)
    // Examples: 4991 -> 499, 6992 -> 699, 11993 -> 1199, 34994 -> 3499
    if (price > 2000 && (price % 10 >= 1 && price % 10 <= 5)) {
        price = Math.floor(price / 10);
    }
    return price;
};

const analyzePricing = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const filePath = path.join(__dirname, '..', 'service table.xlsx');
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Group prices by Service and Segment
        const pricingMap = {}; // { "Service Name": { hatchback: [], sedan: [], suv: [], luxury: [] } }

        for (const row of data) {
            const serviceName = row['Service'];
            const segment = row['Car Category'] || row['Segment']; // Use Category if available
            const rawPrice = row['Starting Price (?)'];

            if (!serviceName || !segment || !rawPrice) continue;

            const price = cleanPrice(rawPrice);

            if (!pricingMap[serviceName]) {
                pricingMap[serviceName] = { hatchback: [], sedan: [], suv: [], luxury: [] };
            }

            const s = segment.toLowerCase();
            if (s.includes('hatchback')) pricingMap[serviceName].hatchback.push(price);
            else if (s.includes('sedan')) pricingMap[serviceName].sedan.push(price);
            else if (s.includes('suv')) pricingMap[serviceName].suv.push(price);
            else if (s.includes('luxury') || s.includes('premium')) pricingMap[serviceName].luxury.push(price);
        }

        // Calculate Deltas
        let totalSedanDiff = 0, sedanCount = 0;
        let totalSuvDiff = 0, suvCount = 0;
        let totalLuxuryDiff = 0, luxuryCount = 0;

        for (const serviceName in pricingMap) {
            const p = pricingMap[serviceName];

            // Calculate average price for each category for this service
            const avgHatch = p.hatchback.length ? p.hatchback.reduce((a, b) => a + b, 0) / p.hatchback.length : 0;
            const avgSedan = p.sedan.length ? p.sedan.reduce((a, b) => a + b, 0) / p.sedan.length : 0;
            const avgSuv = p.suv.length ? p.suv.reduce((a, b) => a + b, 0) / p.suv.length : 0;
            const avgLuxury = p.luxury.length ? p.luxury.reduce((a, b) => a + b, 0) / p.luxury.length : 0;

            if (avgHatch > 0) {
                // Update Service Base Price to Hatchback Price
                await Service.updateOne({ title: serviceName }, { price: Math.round(avgHatch) });
                console.log(`Updated base price for ${serviceName}: ${Math.round(avgHatch)}`);

                if (avgSedan > 0) {
                    totalSedanDiff += (avgSedan - avgHatch);
                    sedanCount++;
                }
                if (avgSuv > 0) {
                    totalSuvDiff += (avgSuv - avgHatch);
                    suvCount++;
                }
                if (avgLuxury > 0) {
                    totalLuxuryDiff += (avgLuxury - avgHatch);
                    luxuryCount++;
                }
            }
        }

        // Calculate Global Averages for Settings
        const charge_sedan = sedanCount ? Math.round(totalSedanDiff / sedanCount) : 0;
        const charge_suv = suvCount ? Math.round(totalSuvDiff / suvCount) : 0;
        const charge_luxury = luxuryCount ? Math.round(totalLuxuryDiff / luxuryCount) : 0;

        console.log('Calculated Extra Charges:');
        console.log(`Sedan: +${charge_sedan}`);
        console.log(`SUV: +${charge_suv}`);
        console.log(`Luxury: +${charge_luxury}`);

        // Update Settings
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
        }

        // Use set() to ensure fields are updated even if schema is strict: false
        settings.set('charge_hatchback', 0); // Base
        settings.set('charge_sedan', charge_sedan);
        settings.set('charge_suv', charge_suv);
        settings.set('charge_luxury', charge_luxury);

        await settings.save();
        console.log('Settings updated successfully');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

analyzePricing();
