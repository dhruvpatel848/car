const mongoose = require('mongoose');
const dotenv = require('dotenv');
const XLSX = require('xlsx');
const path = require('path');

dotenv.config();

// Schemas (Re-defining here to avoid import issues with ES modules/CommonJS mix)
const locationSchema = new mongoose.Schema({ city: { type: String, required: true, unique: true } });
const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

const carBrandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String, required: true }
});
const CarBrand = mongoose.models.CarBrand || mongoose.model('CarBrand', carBrandSchema);

const carModelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'CarBrand', required: true },
    type: { type: String, enum: ['hatchback', 'sedan', 'suv', 'luxury'], required: true },
    image: { type: String, required: true }
});
const CarModel = mongoose.models.CarModel || mongoose.model('CarModel', carModelSchema);

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, default: '45 mins' }, // Default
    features: [String],
    image: { type: String, default: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1000' }, // Default
    availableLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
});
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);


// Brand Mapping Helper
const getBrandForModel = (modelName) => {
    const m = modelName.toLowerCase().trim();
    if (['alto', 'wagonr', 'swift', 'dzire', 'baleno', 'brezza', 'grand vitara', 'ertiga', 'xl6', 'celerio', 'ignis', 's-presso'].some(x => m.includes(x))) return 'Maruti Suzuki';
    if (['i10', 'i20', 'creta', 'venue', 'verna', 'aura', 'tucson', 'alcazar', 'santro'].some(x => m.includes(x))) return 'Hyundai';
    if (['altroz', 'nexon', 'harrier', 'safari', 'tiago', 'tigor', 'punch'].some(x => m.includes(x))) return 'Tata Motors';
    if (['amaze', 'city', 'jazz', 'wr-v', 'elevate'].some(x => m.includes(x))) return 'Honda';
    if (['thar', 'xuv700', 'scorpio', 'bolero', 'xuv300'].some(x => m.includes(x))) return 'Mahindra';
    if (['fortuner', 'innova', 'glanza', 'urban cruiser', 'camry'].some(x => m.includes(x))) return 'Toyota';
    if (['seltos', 'sonet', 'carens', 'carnival'].some(x => m.includes(x))) return 'Kia';
    if (['c-class', 'e-class', 'glc', 'gle'].some(x => m.includes(x))) return 'Mercedes-Benz';
    if (['3 series', '5 series', 'x1', 'x3', 'x5'].some(x => m.includes(x))) return 'BMW';
    if (['a4', 'a6', 'q3', 'q5', 'q7'].some(x => m.includes(x))) return 'Audi';

    return 'Other'; // Fallback
};

// Car Type Images (Reuse from seed_cars.js)
const carTypeImages = {
    'hatchback': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=500',
    'sedan': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=500',
    'suv': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500',
    'luxury': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=500'
};

const seedFromExcel = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Ensure Surat Location
        let surat = await Location.findOne({ city: 'Surat' });
        if (!surat) {
            surat = await Location.create({ city: 'Surat' });
            console.log('Created location: Surat');
        } else {
            console.log('Location Surat already exists');
        }

        // 2. Read Excel
        const filePath = path.join(__dirname, '..', 'service table.xlsx');
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        // 3. Process Cars
        console.log('Processing Cars...');
        for (const row of data) {
            const carNames = row['Car Name '] ? row['Car Name '].split(',').map(s => s.trim()) : [];
            const segment = row['Segment'] || 'Sedan'; // Default

            // Map segment to our types
            let type = 'sedan';
            if (segment.toLowerCase().includes('hatchback')) type = 'hatchback';
            else if (segment.toLowerCase().includes('suv')) type = 'suv';
            else if (segment.toLowerCase().includes('luxury') || segment.toLowerCase().includes('premium')) type = 'luxury';

            for (const modelName of carNames) {
                if (!modelName) continue;

                const brandName = getBrandForModel(modelName);

                // Find or Create Brand
                let brand = await CarBrand.findOne({ name: brandName });
                if (!brand) {
                    // Create generic brand if not exists (using a placeholder logo)
                    brand = await CarBrand.create({
                        name: brandName,
                        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'
                    });
                    console.log(`Created new brand: ${brandName}`);
                }

                // Find or Create Model
                const existingModel = await CarModel.findOne({ name: modelName, brand: brand._id });
                if (!existingModel) {
                    await CarModel.create({
                        name: modelName,
                        brand: brand._id,
                        type: type,
                        image: carTypeImages[type] || carTypeImages['sedan']
                    });
                    console.log(`Added model: ${modelName} (${brandName})`);
                }
            }
        }

        // 4. Process Services
        console.log('Processing Services...');
        // Group by Service Name to avoid duplicates (taking the first one found as the "base" service)
        // In a real app, we might want different prices for different car types, but for now, we'll create one Service entry
        // and maybe use the "Hatchback" price as the base price.

        const servicesMap = new Map();

        for (const row of data) {
            const serviceName = row['Service'];
            if (!serviceName) continue;

            if (!servicesMap.has(serviceName)) {
                // Clean Price: Remove last digit if it looks like a footnote (heuristic: > 1000 and ends in 1 or 2)
                let rawPrice = row['Starting Price (?)'];
                let price = parseInt(rawPrice);

                // Heuristic: If price is like 4991, it's likely 499. If 14991, likely 1499.
                // Assuming prices are usually < 10000 for car wash.
                if (price > 2000 && (price % 10 === 1 || price % 10 === 2)) {
                    price = Math.floor(price / 10);
                }

                servicesMap.set(serviceName, {
                    title: serviceName,
                    description: row["What's Included"] || row['Service Type'] || 'Premium car service',
                    price: price || 499,
                    features: row["What's Included"] ? row["What's Included"].split(',').map(s => s.trim()) : [],
                    availableLocations: [surat._id]
                });
            }
        }

        for (const serviceData of servicesMap.values()) {
            // Check if service exists
            const existingService = await Service.findOne({ title: serviceData.title });
            if (existingService) {
                // Update locations if not present
                if (!existingService.availableLocations.includes(surat._id)) {
                    existingService.availableLocations.push(surat._id);
                    await existingService.save();
                    console.log(`Updated service: ${serviceData.title} with Surat location`);
                }
            } else {
                await Service.create(serviceData);
                console.log(`Created service: ${serviceData.title}`);
            }
        }

        console.log('Import completed successfully');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedFromExcel();
