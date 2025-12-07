require('dotenv').config();
const mongoose = require('mongoose');
const CarBrand = require('./models/CarBrand');
const CarModel = require('./models/CarModel');
const Service = require('./models/Service');
const Location = require('./models/Location');

// --- DATA FROM TABLE ---

const locationCity = "Surat";

const brands = [
    { name: 'Maruti Suzuki', logo: '/images/brands/maruti_suzuki.svg' },
    { name: 'Hyundai', logo: '/images/brands/hyundai.svg' },
    { name: 'Tata', logo: '/images/brands/tata.svg' },
    { name: 'Honda', logo: '/images/brands/honda.svg' },
    { name: 'Volkswagen', logo: '/images/brands/volkswagen.svg' },
    { name: 'Skoda', logo: '/images/brands/skoda.svg' },
    { name: 'Toyota', logo: '/images/brands/toyota.svg' },
    { name: 'Ford', logo: '/images/brands/ford.svg' },
    { name: 'Mahindra', logo: '/images/brands/mahindra.svg' },
    { name: 'Kia', logo: '/images/brands/kia.svg' },
    { name: 'MG', logo: '/images/brands/mg.svg' }, // Assuming added if needed, or stick to list
    { name: 'Mercedes-Benz', logo: '/images/brands/mercedes.svg' },
    { name: 'BMW', logo: '/images/brands/bmw.svg' },
    { name: 'Audi', logo: '/images/brands/audi.svg' }
];

// Mapping Table Cars to Segments
// Type logic: Hatchback -> hatchback, Sedan -> sedan, SUV -> suv, Luxury -> luxury
const models = [
    // Hatchback
    { name: 'Alto', brand: 'Maruti Suzuki', segment: 'Hatchback', type: 'hatchback', image: 'alto.jpg' },
    { name: 'WagonR', brand: 'Maruti Suzuki', segment: 'Hatchback', type: 'hatchback', image: 'wagonr.jpg' },
    { name: 'Swift', brand: 'Maruti Suzuki', segment: 'Hatchback', type: 'hatchback', image: 'swift.jpg' },
    { name: 'i10', brand: 'Hyundai', segment: 'Hatchback', type: 'hatchback', image: 'i10.jpg' },

    // Premium Hatchback (Row 2 & 3 cars)
    { name: 'Baleno', brand: 'Maruti Suzuki', segment: 'Premium Hatchback', type: 'hatchback', image: 'baleno.jpg' },
    { name: 'i20', brand: 'Hyundai', segment: 'Premium Hatchback', type: 'hatchback', image: 'i20.jpg' },
    { name: 'Altroz', brand: 'Tata', segment: 'Premium Hatchback', type: 'hatchback', image: 'altroz.jpg' },
    { name: 'Jazz', brand: 'Honda', segment: 'Premium Hatchback', type: 'hatchback', image: 'jazz.jpg' },
    { name: 'Polo', brand: 'Volkswagen', segment: 'Premium Hatchback', type: 'hatchback', image: 'polo.jpg' },

    // Compact Sedan
    { name: 'Dzire', brand: 'Maruti Suzuki', segment: 'Compact Sedan', type: 'sedan', image: 'dzire.jpg' },
    { name: 'Amaze', brand: 'Honda', segment: 'Compact Sedan', type: 'sedan', image: 'amaze.jpg' },
    { name: 'Aura', brand: 'Hyundai', segment: 'Compact Sedan', type: 'sedan', image: 'aura.jpg' },

    // Mid-size Sedan
    { name: 'City', brand: 'Honda', segment: 'Mid-size Sedan', type: 'sedan', image: 'city.jpg' },
    { name: 'Verna', brand: 'Hyundai', segment: 'Mid-size Sedan', type: 'sedan', image: 'verna.jpg' },
    { name: 'Ciaz', brand: 'Maruti Suzuki', segment: 'Mid-size Sedan', type: 'sedan', image: 'ciaz.jpg' },
    { name: 'Virtus', brand: 'Volkswagen', segment: 'Mid-size Sedan', type: 'sedan', image: 'virtus.jpg' },

    // Executive Sedan
    { name: 'Superb', brand: 'Skoda', segment: 'Executive Sedan', type: 'sedan', image: 'superb.jpg' },
    { name: 'Octavia', brand: 'Skoda', segment: 'Executive Sedan', type: 'sedan', image: 'octavia.jpg' },
    { name: 'Camry', brand: 'Toyota', segment: 'Executive Sedan', type: 'sedan', image: 'camry.jpg' },

    // Compact SUV
    { name: 'Brezza', brand: 'Maruti Suzuki', segment: 'Compact SUV', type: 'suv', image: 'brezza.jpg' },
    { name: 'Venue', brand: 'Hyundai', segment: 'Compact SUV', type: 'suv', image: 'venue.jpg' },
    { name: 'Sonet', brand: 'Kia', segment: 'Compact SUV', type: 'suv', image: 'sonet.jpg' },

    // Mid-size SUV
    { name: 'Creta', brand: 'Hyundai', segment: 'Mid-size SUV', type: 'suv', image: 'creta.jpg' },
    { name: 'Seltos', brand: 'Kia', segment: 'Mid-size SUV', type: 'suv', image: 'seltos.jpg' },
    { name: 'Kushaq', brand: 'Skoda', segment: 'Mid-size SUV', type: 'suv', image: 'kushaq.jpg' },

    // Full-size SUV
    { name: 'Fortuner', brand: 'Toyota', segment: 'Full-size SUV', type: 'suv', image: 'fortuner.jpg' },
    { name: 'Endeavour', brand: 'Ford', segment: 'Full-size SUV', type: 'suv', image: 'endeavour.jpg' },
    { name: 'XUV700', brand: 'Mahindra', segment: 'Full-size SUV', type: 'suv', image: 'xuv700.jpg' },

    // Entry Luxury
    { name: 'A-Class', brand: 'Mercedes-Benz', segment: 'Entry Luxury', type: 'luxury', image: 'a-class.jpg' },
    { name: '2 Series', brand: 'BMW', segment: 'Entry Luxury', type: 'luxury', image: '2-series.jpg' },

    // Executive Luxury
    { name: 'C-Class', brand: 'Mercedes-Benz', segment: 'Executive Luxury', type: 'luxury', image: 'c-class.jpg' },
    { name: '3 Series', brand: 'BMW', segment: 'Executive Luxury', type: 'luxury', image: '3-series.jpg' },
    { name: 'A4', brand: 'Audi', segment: 'Executive Luxury', type: 'luxury', image: 'a4.jpg' },

    // Premium Luxury
    { name: 'E-Class', brand: 'Mercedes-Benz', segment: 'Premium Luxury', type: 'luxury', image: 'e-class.jpg' },
    { name: '5 Series', brand: 'BMW', segment: 'Premium Luxury', type: 'luxury', image: '5-series.jpg' },
    { name: 'A6', brand: 'Audi', segment: 'Premium Luxury', type: 'luxury', image: 'a6.jpg' }
];

// Pricing Rules derived from table
// Basic: 499 (Hatch), 599 (Sedan-Compact), 699 (SUV-Compact), 899 (Lux-Entry)
// Deluxe: 899 (Hatch), 999 (Sedan-Mid), 1199 (SUV-Mid), 1799 (Lux-Exec)
// Premium: 1499 (Hatch-Prem), 1999 (Sedan-Exec), 2499 (SUV-Full), 3499 (Lux-Prem)

const pricingBasic = {
    "Hatchback": 499, "Premium Hatchback": 499,
    "Compact Sedan": 599, "Mid-size Sedan": 599, "Executive Sedan": 599,
    "Compact SUV": 699, "Mid-size SUV": 699, "Full-size SUV": 699,
    "Entry Luxury": 899, "Executive Luxury": 899, "Premium Luxury": 899
};

const pricingDeluxe = {
    "Hatchback": 899, "Premium Hatchback": 899,
    "Compact Sedan": 999, "Mid-size Sedan": 999, "Executive Sedan": 999,
    "Compact SUV": 1199, "Mid-size SUV": 1199, "Full-size SUV": 1199,
    "Entry Luxury": 1799, "Executive Luxury": 1799, "Premium Luxury": 1799
};

const pricingPremium = {
    "Hatchback": 1499, "Premium Hatchback": 1499,
    "Compact Sedan": 1999, "Mid-size Sedan": 1999, "Executive Sedan": 1999,
    "Compact SUV": 2499, "Mid-size SUV": 2499, "Full-size SUV": 2499,
    "Entry Luxury": 3499, "Executive Luxury": 3499, "Premium Luxury": 3499
};

const services = [
    {
        title: "Basic Wash",
        description: "Exterior wash service.",
        basePrice: 499,
        features: ["Exterior wash", "Wheel cleaning", "Drying"],
        pricingRules: pricingBasic,
        image: "/images/services/basic-wash.jpg"
    },
    {
        title: "Deluxe Wash",
        description: "Exterior and Interior cleaning.",
        basePrice: 899,
        features: ["Foam wash", "Interior vacuuming", "Dashboard cleaning", "Wheel deep clean"],
        pricingRules: pricingDeluxe,
        image: "/images/services/deluxe-wash.jpg"
    },
    {
        title: "Premium Wash",
        description: "Complete detailing service.",
        basePrice: 1499,
        features: ["Clay bar treatment", "Waxing", "Interior shampooing", "Dashboard polishing", "Leather treatment", "Alloy polishing"],
        pricingRules: pricingPremium,
        image: "/images/services/premium-wash.jpg"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // CLEAR
        await CarBrand.deleteMany({});
        await CarModel.deleteMany({});
        await Service.deleteMany({});
        await Location.deleteMany({});
        console.log('Old Data Cleared');

        // LOCATION
        const loc = await Location.create({ city: locationCity });
        console.log(`Location '${locationCity}' created`);

        // BRANDS
        const createdBrands = await CarBrand.insertMany(brands);
        console.log(`Brands seeded: ${createdBrands.length}`);

        // MODELS
        const modelsWithIds = models.map(m => {
            const b = createdBrands.find(cb => cb.name === m.brand);
            if (!b) return null;

            let img = 'generic-sedan.png'; // Default
            if (m.segment.includes('Hatchback')) img = 'generic-hatchback.png';
            else if (m.segment.includes('Sedan')) img = 'generic-sedan.png';
            else if (m.segment.includes('SUV')) img = 'generic-suv.png';
            else if (m.segment.includes('Luxury')) img = 'generic-luxury.png';

            return {
                ...m,
                brand: b._id,
                image: `/images/models/${img}`
            };
        }).filter(Boolean);

        await CarModel.insertMany(modelsWithIds);
        console.log(`Models seeded: ${modelsWithIds.length}`);

        // SERVICES
        const servicesWithLoc = services.map(s => ({
            ...s,
            availableLocations: [loc._id]
        }));

        await Service.insertMany(servicesWithLoc);
        console.log(`Services seeded: ${servicesWithLoc.length}`);

        console.log("SURAT SEED COMPLETE");
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedDB();
