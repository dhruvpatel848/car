const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Schemas
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
    segment: { type: String, required: true },
    image: { type: String, required: true }
});
const CarModel = mongoose.models.CarModel || mongoose.model('CarModel', carModelSchema);

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true }, // Baseline price
    pricingRules: { type: Map, of: Number }, // { 'Compact Sedan': 599, ... }
    duration: { type: String, default: '45 mins' },
    features: [String],
    image: { type: String, required: true },
    availableLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
});
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

// Data
const brandsData = [
    { name: 'Maruti Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Maruti_Suzuki_logo.svg/1200px-Maruti_Suzuki_logo.svg.png' },
    { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/2560px-Hyundai_Motor_Company_logo.svg.png' },
    { name: 'Tata Motors', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/2560px-Tata_logo.svg.png' },
    { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/2560px-Honda.svg.png' },
    { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png' },
    { name: 'Skoda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Skoda_Auto_logo_%282023%29.svg/2560px-Skoda_Auto_logo_%282023%29.svg.png' },
    { name: 'Kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kia_logo.svg/1200px-Kia_logo.svg.png' },
    { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/2560px-Toyota_carlogo.svg.png' },
    { name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Mahindra_Rise_New_Logo.svg/1200px-Mahindra_Rise_New_Logo.svg.png' },
    { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/2560px-Audi-Logo_2016.svg.png' },
    { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2560px-BMW.svg.png' },
    { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/2560px-Mercedes-Logo.svg.png' }
];

const carsList = [
    // Hatchback
    { brand: 'Maruti Suzuki', models: ['Alto', 'WagonR', 'Swift'], segment: 'Hatchback', type: 'hatchback' },
    { brand: 'Hyundai', models: ['i10', 'i20'], segment: 'Hatchback', type: 'hatchback' },
    { brand: 'Tata Motors', models: ['Altroz'], segment: 'Hatchback', type: 'hatchback' },
    { brand: 'Honda', models: ['Jazz'], segment: 'Hatchback', type: 'hatchback' },
    { brand: 'Volkswagen', models: ['Polo'], segment: 'Hatchback', type: 'hatchback' },

    // Compact Sedan
    { brand: 'Maruti Suzuki', models: ['Dzire'], segment: 'Compact Sedan', type: 'sedan' },
    { brand: 'Hyundai', models: ['Aura'], segment: 'Compact Sedan', type: 'sedan' },
    { brand: 'Honda', models: ['Amaze'], segment: 'Compact Sedan', type: 'sedan' },

    // Mid-size Sedan
    { brand: 'Hyundai', models: ['Verna'], segment: 'Mid-size Sedan', type: 'sedan' },
    { brand: 'Honda', models: ['City'], segment: 'Mid-size Sedan', type: 'sedan' },
    { brand: 'Volkswagen', models: ['Virtus'], segment: 'Mid-size Sedan', type: 'sedan' },

    // Executive Sedan
    { brand: 'Skoda', models: ['Octavia', 'Superb'], segment: 'Executive Sedan', type: 'sedan' },
    { brand: 'Toyota', models: ['Camry'], segment: 'Executive Sedan', type: 'sedan' },

    // Compact SUV
    { brand: 'Maruti Suzuki', models: ['Brezza'], segment: 'Compact SUV', type: 'suv' },
    { brand: 'Hyundai', models: ['Venue'], segment: 'Compact SUV', type: 'suv' },
    { brand: 'Kia', models: ['Sonet'], segment: 'Compact SUV', type: 'suv' },

    // Mid-size SUV
    { brand: 'Kia', models: ['Seltos'], segment: 'Mid-size SUV', type: 'suv' },
    // Add Creta, Grand Vitara if needed, but sticking to user's list mostly

    // Full-size SUV
    { brand: 'Mahindra', models: ['XUV700'], segment: 'Full-size SUV', type: 'suv' },

    // Entry Luxury
    { brand: 'Mercedes-Benz', models: ['Mercedes A-Class'], segment: 'Entry Luxury', type: 'luxury' },
    { brand: 'BMW', models: ['BMW 2 Series'], segment: 'Entry Luxury', type: 'luxury' },

    // Executive Luxury
    { brand: 'Audi', models: ['Audi A4'], segment: 'Executive Luxury', type: 'luxury' },
    { brand: 'BMW', models: ['BMW 3 Series'], segment: 'Executive Luxury', type: 'luxury' },
    { brand: 'Mercedes-Benz', models: ['Mercedes C-Class'], segment: 'Executive Luxury', type: 'luxury' },

    // Premium Luxury
    { brand: 'Audi', models: ['Audi A6'], segment: 'Premium Luxury', type: 'luxury' },
    { brand: 'BMW', models: ['BMW 5 Series'], segment: 'Premium Luxury', type: 'luxury' },
    { brand: 'Mercedes-Benz', models: ['Mercedes E-Class'], segment: 'Premium Luxury', type: 'luxury' }
];

const carTypeImages = {
    'hatchback': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=500',
    'sedan': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=500',
    'suv': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500',
    'luxury': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=500'
};

const servicesData = [
    {
        title: 'Basic Wash',
        description: 'Exterior wash, Wheel cleaning, Drying',
        basePrice: 499,
        pricingRules: {
            'Hatchback': 499,
            'Compact Sedan': 1001, // User provided 1001, likely means 100 extra? Or 1001 total? 
            // Wait, user said: Baseline = Hatchback (499). Compact Sedan 1001. 
            // If Baseline is 499, then 1001 is likely +100.1? Or +100?
            // "Compact Sedan 1001" -> 1001 / 10 = 100.1 -> 100 extra?
            // Or is it the TOTAL price? 
            // "Hatchback 0" -> +0. "Compact Sedan 1001" -> +100. "Compact SUV 2001" -> +200. "Entry Luxury 4002" -> +400.
            // Yes, these look like increments (with footnote digits).
            // So: Compact Sedan = 499 + 100 = 599.
            // Let's store the TOTAL price for simplicity in the rules.
            'Compact Sedan': 499 + 100,
            'Compact SUV': 499 + 200,
            'Entry Luxury': 499 + 400
        },
        features: ['Exterior foam wash', 'Tyre dressing', 'Window cleaning'],
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Deluxe Wash',
        description: 'Exterior + Interior cleaning',
        basePrice: 899,
        pricingRules: {
            'Hatchback': 899,
            'Mid-size Sedan': 899 + 100, // 1001 -> 100
            'Mid-size SUV': 899 + 300,   // 3002 -> 300
            'Executive Luxury': 899 + 900 // 9002 -> 900
        },
        features: ['Interior vacuuming', 'Dashboard polishing', 'Mat cleaning'],
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Premium Wash',
        description: 'Complete detailing package',
        basePrice: 1499,
        pricingRules: {
            'Hatchback': 1499, // Assuming Hatchback base
            'Premium Hatchback': 1499,
            'Executive Sedan': 1499 + 500, // 5001 -> 500
            'Full-size SUV': 1499 + 1000,  // 10002 -> 1000
            'Premium Luxury': 1499 + 2000  // 20003 -> 2000
        },
        features: ['Paint protection', 'Engine bay wash', 'Leather conditioning'],
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1000'
    }
];

const seedAdvanced = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Clear DB
        await mongoose.connection.collection('carbrands').deleteMany({});
        await mongoose.connection.collection('carmodels').deleteMany({});
        await mongoose.connection.collection('services').deleteMany({});
        console.log('Cleared DB');

        // 2. Ensure Location
        let surat = await Location.findOne({ city: 'Surat' });
        if (!surat) {
            surat = await Location.create({ city: 'Surat' });
        }

        // 3. Seed Brands
        for (const b of brandsData) {
            await CarBrand.create(b);
        }
        console.log('Seeded Brands');

        // 4. Seed Models
        for (const group of carsList) {
            const brand = await CarBrand.findOne({ name: group.brand });
            if (!brand) continue;

            for (const modelName of group.models) {
                await CarModel.create({
                    name: modelName,
                    brand: brand._id,
                    type: group.type,
                    segment: group.segment,
                    image: carTypeImages[group.type]
                });
            }
        }
        console.log('Seeded Models');

        // 5. Seed Services
        for (const s of servicesData) {
            await Service.create({
                ...s,
                availableLocations: [surat._id]
            });
        }
        console.log('Seeded Services');

        console.log('Advanced Seeding Complete');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdvanced();
