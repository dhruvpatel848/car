require('dotenv').config();
const mongoose = require('mongoose');
const CarBrand = require('./models/CarBrand');
const CarModel = require('./models/CarModel');
const Service = require('./models/Service');
const Location = require('./models/Location');

const brandsList = [
    { name: 'Audi', logo: '/images/brands/audi.svg' },
    { name: 'BMW', logo: '/images/brands/bmw.svg' },
    { name: 'Ford', logo: '/images/brands/ford.svg' },
    { name: 'Honda', logo: '/images/brands/honda.svg' },
    { name: 'Hyundai', logo: '/images/brands/hyundai.svg' },
    { name: 'Kia', logo: '/images/brands/kia.svg' },
    { name: 'Mahindra', logo: '/images/brands/mahindra.svg' },
    { name: 'Maruti Suzuki', logo: '/images/brands/maruti_suzuki.svg' },
    { name: 'Mercedes-Benz', logo: '/images/brands/mercedes.svg' },
    { name: 'Skoda', logo: '/images/brands/skoda.svg' },
    { name: 'Tata', logo: '/images/brands/tata.svg' },
    { name: 'Toyota', logo: '/images/brands/toyota.svg' },
    { name: 'Volkswagen', logo: '/images/brands/volkswagen.svg' }
];

const modelsList = [
    { name: 'Alto 800', brand: 'Maruti Suzuki', segment: 'Hatchback', image: 'alto.jpg' },
    { name: 'Swift', brand: 'Maruti Suzuki', segment: 'Hatchback', image: 'swift.jpg' },
    { name: 'Baleno', brand: 'Maruti Suzuki', segment: 'Premium Hatchback', image: 'baleno.jpg' },
    { name: 'Dzire', brand: 'Maruti Suzuki', segment: 'Compact Sedan', image: 'dzire.jpg' },
    { name: 'Brezza', brand: 'Maruti Suzuki', segment: 'Compact SUV', image: 'brezza.jpg' },
    { name: 'Ciaz', brand: 'Maruti Suzuki', segment: 'Mid-size Sedan', image: 'ciaz.jpg' },
    { name: 'Wagon R', brand: 'Maruti Suzuki', segment: 'Hatchback', image: 'wagonr.jpg' },

    { name: 'i10 Nios', brand: 'Hyundai', segment: 'Hatchback', image: 'i10.jpg' },
    { name: 'i20', brand: 'Hyundai', segment: 'Premium Hatchback', image: 'i20.jpg' },
    { name: 'Aura', brand: 'Hyundai', segment: 'Compact Sedan', image: 'aura.jpg' },
    { name: 'Verna', brand: 'Hyundai', segment: 'Mid-size Sedan', image: 'verna.jpg' },
    { name: 'Creta', brand: 'Hyundai', segment: 'Mid-size SUV', image: 'creta.jpg' },
    { name: 'Venue', brand: 'Hyundai', segment: 'Compact SUV', image: 'venue.jpg' },

    { name: 'City', brand: 'Honda', segment: 'Mid-size Sedan', image: 'city.jpg' },
    { name: 'Amaze', brand: 'Honda', segment: 'Compact Sedan', image: 'amaze.jpg' },
    { name: 'Jazz', brand: 'Honda', segment: 'Premium Hatchback', image: 'jazz.jpg' },

    { name: 'Altroz', brand: 'Tata', segment: 'Premium Hatchback', image: 'altroz.jpg' },
    { name: 'XUV700', brand: 'Mahindra', segment: 'Mid-size SUV', image: 'xuv700.jpg' },

    { name: 'Fortuner', brand: 'Toyota', segment: 'Full-size SUV', image: 'fortuner.jpg' },
    { name: 'Camry', brand: 'Toyota', segment: 'Executive Sedan', image: 'camry.jpg' },

    { name: 'C-Class', brand: 'Mercedes-Benz', segment: 'Luxury', image: 'c-class.jpg' },
    { name: 'E-Class', brand: 'Mercedes-Benz', segment: 'Luxury', image: 'e-class.jpg' },
    { name: 'A-Class', brand: 'Mercedes-Benz', segment: 'Luxury', image: 'a-class.jpg' },

    { name: '3 Series', brand: 'BMW', segment: 'Luxury', image: '3-series.jpg' },
    { name: '5 Series', brand: 'BMW', segment: 'Luxury', image: '5-series.jpg' },
];

const servicesList = [
    {
        title: "Basic Wash",
        description: "Complete exterior wash with interior vacuuming.",
        basePrice: 499,
        duration: "45 mins",
        features: ["Exterior Foam Wash", "Interior Vacuum", "Dashboard Polish", "Tyre Dressing"],
        pricingRules: { "Hatchback": 499, "SUV": 699, "Luxury": 999 },
        image: "/images/models/swift.jpg"
    },
    {
        title: "Deep Interior Cleaning",
        description: "Intensive cleaning of upholstery, carpets, and roof.",
        basePrice: 1299,
        duration: "2 hours",
        features: ["Seat Shampoo", "Roof Cleaning", "Carpet Scrubbing", "Odor Removal"],
        pricingRules: { "Hatchback": 1299, "SUV": 1599, "Luxury": 1999 },
        image: "/images/models/altroz.jpg"
    },
    {
        title: "Premium Polish",
        description: "High-quality wax polish for long-lasting shine.",
        basePrice: 899,
        duration: "1.5 hours",
        features: ["Body Waxing", "Scratch Removal", "Headlight Restoration", "Chrome Polishing"],
        pricingRules: { "Hatchback": 899, "SUV": 1199, "Luxury": 1599 },
        image: "/images/models/city.jpg"
    },
    {
        title: "Ceramic Coating",
        description: "Advanced paint protection layer.",
        basePrice: 4999,
        duration: "4 hours",
        features: ["3-Layer Coating", "Hydrophobic Effect", "Gloss Enhancement", "1 Year Warranty"],
        pricingRules: { "Hatchback": 4999, "SUV": 5999, "Luxury": 7999 },
        image: "/images/models/creta.jpg"
    },
    {
        title: "Full Detailing",
        description: "Complete interior and exterior makeover.",
        basePrice: 2499,
        duration: "5 hours",
        features: ["Wait & Polish", "Engine Bay Cleaning", "AC Vent Cleaning", "Leather Conditioning"],
        pricingRules: { "Hatchback": 2499, "SUV": 2999, "Luxury": 3999 },
        image: "/images/models/fortuner.jpg"
    }
];

const locationsList = ["Surat", "Ahmedabad", "Vadodara", "Mumbai"];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // CLEAR DATA
        await CarBrand.deleteMany({});
        await CarModel.deleteMany({});
        await Service.deleteMany({});
        await Location.deleteMany({});
        console.log('Old Data Cleared');

        // SEED LOCATIONS
        const createdLocations = await Location.insertMany(
            locationsList.map(city => ({ city }))
        );
        console.log('Locations Seeded');

        // SEED BRANDS
        const createdBrands = await CarBrand.insertMany(brandsList);
        console.log(`Brands Seeded: ${createdBrands.length}`);

        // SEED MODELS
        const modelsWithIds = modelsList.map(model => {
            const brandDoc = createdBrands.find(b => b.name === model.brand);
            if (!brandDoc) {
                console.warn(`Brand not found for model: ${model.name}`);
                return null;
            }

            let type = 'hatchback';
            const seg = model.segment.toLowerCase();
            if (seg.includes('sedan')) type = 'sedan';
            else if (seg.includes('suv')) type = 'suv';
            else if (seg.includes('luxury') || model.segment === 'Luxury') type = 'luxury';
            else if (seg.includes('hatchback')) type = 'hatchback';

            return {
                ...model,
                brand: brandDoc._id,
                type: type,
                image: `/images/models/${model.image}`
            };
        }).filter(m => m !== null);

        await CarModel.insertMany(modelsWithIds);
        console.log(`Models Seeded: ${modelsWithIds.length}`);

        // SEED SERVICES
        const servicesWithLocs = servicesList.map(service => ({
            ...service,
            availableLocations: createdLocations.map(l => l._id)
        }));

        await Service.insertMany(servicesWithLocs);
        console.log(`Services Seeded: ${servicesWithLocs.length}`);

        console.log('SUCCESS: Database Restored');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
