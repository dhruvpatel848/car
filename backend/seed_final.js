const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CarBrand = require('./models/CarBrand');
const CarModel = require('./models/CarModel');
const Service = require('./models/Service');
const Location = require('./models/Location');

dotenv.config();

// --- DATA DEFINITIONS ---

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

// Mapping based on Excel "Car Name" column
const carsList = [
    // Hatchback
    { brand: 'Maruti Suzuki', models: ['Alto', 'WagonR', 'Swift'], segment: 'Hatchback', type: 'hatchback' },
    { brand: 'Hyundai', models: ['i10', 'i20'], segment: 'Hatchback', type: 'hatchback' },
    { brand: 'Tata Motors', models: ['Altroz'], segment: 'Hatchback', type: 'hatchback' }, // Altroz is listed as Hatchback in Row 2, Premium in Row 3. Using Hatchback generally.
    { brand: 'Honda', models: ['Jazz'], segment: 'Hatchback', type: 'hatchback' },

    // Premium Hatchback (Row 3)
    { brand: 'Volkswagen', models: ['Polo'], segment: 'Premium Hatchback', type: 'hatchback' },
    { brand: 'Tata Motors', models: ['Altroz XZ+'], segment: 'Premium Hatchback', type: 'hatchback' },
    { brand: 'Maruti Suzuki', models: ['Baleno Alpha'], segment: 'Premium Hatchback', type: 'hatchback' },

    // Compact Sedan (Row 4)
    { brand: 'Maruti Suzuki', models: ['Dzire'], segment: 'Compact Sedan', type: 'sedan' },
    { brand: 'Honda', models: ['Amaze'], segment: 'Compact Sedan', type: 'sedan' },
    { brand: 'Hyundai', models: ['Aura'], segment: 'Compact Sedan', type: 'sedan' },

    // Mid-size Sedan (Row 5)
    { brand: 'Honda', models: ['City'], segment: 'Mid-size Sedan', type: 'sedan' },
    { brand: 'Hyundai', models: ['Verna'], segment: 'Mid-size Sedan', type: 'sedan' },
    { brand: 'Maruti Suzuki', models: ['Ciaz'], segment: 'Mid-size Sedan', type: 'sedan' },
    { brand: 'Volkswagen', models: ['Virtus'], segment: 'Mid-size Sedan', type: 'sedan' },

    // Executive Sedan (Row 6)
    { brand: 'Skoda', models: ['Superb', 'Octavia'], segment: 'Executive Sedan', type: 'sedan' },
    { brand: 'Toyota', models: ['Camry'], segment: 'Executive Sedan', type: 'sedan' },

    // Compact SUV (Row 7)
    { brand: 'Maruti Suzuki', models: ['Brezza'], segment: 'Compact SUV', type: 'suv' },
    { brand: 'Hyundai', models: ['Venue'], segment: 'Compact SUV', type: 'suv' },
    { brand: 'Kia', models: ['Sonet'], segment: 'Compact SUV', type: 'suv' },

    // Mid-size SUV (Row 8)
    { brand: 'Hyundai', models: ['Creta'], segment: 'Mid-size SUV', type: 'suv' },
    { brand: 'Kia', models: ['Seltos'], segment: 'Mid-size SUV', type: 'suv' },
    { brand: 'Skoda', models: ['Kushaq'], segment: 'Mid-size SUV', type: 'suv' },

    // Full-size SUV (Row 9)
    { brand: 'Toyota', models: ['Fortuner'], segment: 'Full-size SUV', type: 'suv' },
    { brand: 'Mahindra', models: ['XUV700'], segment: 'Full-size SUV', type: 'suv' },
    { brand: 'Ford', models: ['Endeavour'], segment: 'Full-size SUV', type: 'suv' }, // Ford not in brands list, will need to handle or add

    // Entry Luxury (Row 10)
    { brand: 'Mercedes-Benz', models: ['Mercedes A-Class'], segment: 'Entry Luxury', type: 'luxury' },
    { brand: 'BMW', models: ['BMW 2 Series'], segment: 'Entry Luxury', type: 'luxury' },

    // Executive Luxury (Row 11)
    { brand: 'Mercedes-Benz', models: ['Mercedes C-Class'], segment: 'Executive Luxury', type: 'luxury' },
    { brand: 'BMW', models: ['BMW 3 Series'], segment: 'Executive Luxury', type: 'luxury' },
    { brand: 'Audi', models: ['Audi A4'], segment: 'Executive Luxury', type: 'luxury' },

    // Premium Luxury (Row 12)
    { brand: 'Mercedes-Benz', models: ['Mercedes E-Class'], segment: 'Premium Luxury', type: 'luxury' },
    { brand: 'BMW', models: ['BMW 5 Series'], segment: 'Premium Luxury', type: 'luxury' },
    { brand: 'Audi', models: ['Audi A6'], segment: 'Premium Luxury', type: 'luxury' }
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
            'Premium Hatchback': 499, // Assuming same as Hatchback if not specified, or interpolate
            'Compact Sedan': 599,
            'Mid-size Sedan': 649, // Interpolated
            'Executive Sedan': 749, // Interpolated
            'Compact SUV': 699,
            'Mid-size SUV': 799, // Interpolated
            'Full-size SUV': 899, // Interpolated
            'Entry Luxury': 899,
            'Executive Luxury': 999, // Interpolated
            'Premium Luxury': 1199 // Interpolated
        },
        features: ['Exterior Wash', 'Wheel Cleaning', 'Drying'],
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Deluxe Wash',
        description: 'Exterior + Interior: Foam wash, Interior vacuuming, Dashboard cleaning',
        basePrice: 899,
        pricingRules: {
            'Hatchback': 899,
            'Premium Hatchback': 949, // Interpolated
            'Compact Sedan': 999, // Interpolated
            'Mid-size Sedan': 999,
            'Executive Sedan': 1299, // Interpolated
            'Compact SUV': 1099, // Interpolated
            'Mid-size SUV': 1199,
            'Full-size SUV': 1499, // Interpolated
            'Entry Luxury': 1499, // Interpolated
            'Executive Luxury': 1799,
            'Premium Luxury': 2199 // Interpolated
        },
        features: ['Foam Wash', 'Interior Vacuuming', 'Dashboard Cleaning', 'Wheel Deep Clean'],
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000'
    },
    {
        title: 'Premium Wash',
        description: 'Complete Detailing: Clay bar, Waxing, Interior shampooing',
        basePrice: 1499,
        pricingRules: {
            'Hatchback': 1499,
            'Premium Hatchback': 1499,
            'Compact Sedan': 1699, // Interpolated
            'Mid-size Sedan': 1799, // Interpolated
            'Executive Sedan': 1999,
            'Compact SUV': 1999, // Interpolated
            'Mid-size SUV': 2499, // Interpolated
            'Full-size SUV': 2499,
            'Entry Luxury': 2999, // Interpolated
            'Executive Luxury': 3499, // Interpolated
            'Premium Luxury': 3499
        },
        features: ['Clay Bar Treatment', 'Waxing', 'Interior Shampooing', 'Dashboard Polishing', 'Leather Treatment', 'Alloy Polishing'],
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1000'
    }
];

// --- SEED FUNCTION ---

const seedFinal = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Clear Database
        console.log('Clearing existing data...');
        await CarBrand.deleteMany({});
        await CarModel.deleteMany({});
        await Service.deleteMany({});
        await Location.deleteMany({});
        console.log('Database cleared.');

        // 2. Seed Location
        console.log('Seeding Location...');
        const surat = await Location.create({ city: 'Surat', isActive: true });
        console.log('Location seeded: Surat');

        // 3. Seed Brands
        console.log('Seeding Brands...');
        const brandMap = {}; // name -> _id
        for (const b of brandsData) {
            const brand = await CarBrand.create(b);
            brandMap[b.name] = brand._id;
        }
        // Handle 'Ford' manually if needed, or add to brandsData
        if (!brandMap['Ford']) {
            const ford = await CarBrand.create({ name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/2560px-Ford_logo_flat.svg.png' });
            brandMap['Ford'] = ford._id;
        }
        console.log(`Seeded ${Object.keys(brandMap).length} brands.`);

        // 4. Seed Models
        console.log('Seeding Models...');
        let modelCount = 0;
        for (const group of carsList) {
            const brandId = brandMap[group.brand];
            if (!brandId) {
                console.warn(`Warning: Brand ${group.brand} not found for models ${group.models.join(', ')}`);
                continue;
            }

            for (const modelName of group.models) {
                await CarModel.create({
                    name: modelName,
                    brand: brandId,
                    type: group.type,
                    segment: group.segment,
                    image: carTypeImages[group.type]
                });
                modelCount++;
            }
        }
        console.log(`Seeded ${modelCount} models.`);

        // 5. Seed Services
        console.log('Seeding Services...');
        for (const s of servicesData) {
            await Service.create({
                ...s,
                availableLocations: [surat._id]
            });
        }
        console.log(`Seeded ${servicesData.length} services.`);

        console.log('--- SEEDING COMPLETE ---');
        process.exit(0);

    } catch (err) {
        console.error('SEEDING FAILED:', err);
        process.exit(1);
    }
};

seedFinal();
