const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CarBrand = require('./models/CarBrand');
const CarModel = require('./models/CarModel');
const Service = require('./models/Service');
const Location = require('./models/Location');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await CarBrand.deleteMany({});
        await CarModel.deleteMany({});
        await Service.deleteMany({});
        console.log('Cleared existing data');

        // 1. Create Brands
        const brands = [
            { name: 'Maruti Suzuki', logo: '/images/brands/maruti_suzuki.svg' },
            { name: 'Hyundai', logo: '/images/brands/hyundai.svg' },
            { name: 'Tata', logo: '/images/brands/tata.svg' },
            { name: 'Honda', logo: '/images/brands/honda.svg' },
            { name: 'Volkswagen', logo: '/images/brands/volkswagen.svg' },
            { name: 'Skoda', logo: '/images/brands/skoda.svg' },
            { name: 'Toyota', logo: '/images/brands/toyota.svg' },
            { name: 'Kia', logo: '/images/brands/kia.svg' },
            { name: 'Mercedes-Benz', logo: '/images/brands/mercedes.svg' },
            { name: 'BMW', logo: '/images/brands/bmw.svg' },
            { name: 'Audi', logo: '/images/brands/audi.svg' },
            { name: 'Mahindra', logo: '/images/brands/mahindra.svg' },
            { name: 'Ford', logo: '/images/brands/ford.svg' }
        ];

        const createdBrands = await CarBrand.insertMany(brands);
        const brandMap = {};
        createdBrands.forEach(b => brandMap[b.name] = b._id);
        console.log('Brands created');

        // 2. Create Models
        const models = [
            // Hatchback
            { name: 'Alto', brand: 'Maruti Suzuki', type: 'hatchback', segment: 'Hatchback', image: '/images/models/alto.jpg' },
            { name: 'WagonR', brand: 'Maruti Suzuki', type: 'hatchback', segment: 'Hatchback', image: '/images/models/wagonr.jpg' },
            { name: 'Swift', brand: 'Maruti Suzuki', type: 'hatchback', segment: 'Hatchback', image: '/images/models/swift.jpg' },
            { name: 'i10', brand: 'Hyundai', type: 'hatchback', segment: 'Hatchback', image: '/images/models/i10.jpg' },

            // Premium Hatchback
            { name: 'Baleno', brand: 'Maruti Suzuki', type: 'hatchback', segment: 'Premium Hatchback', image: '/images/models/baleno.jpg' },
            { name: 'i20', brand: 'Hyundai', type: 'hatchback', segment: 'Premium Hatchback', image: '/images/models/i20.jpg' },
            { name: 'Altroz', brand: 'Tata', type: 'hatchback', segment: 'Premium Hatchback', image: '/images/models/altroz.jpg' },
            { name: 'Jazz', brand: 'Honda', type: 'hatchback', segment: 'Premium Hatchback', image: '/images/models/jazz.jpg' },
            { name: 'Polo', brand: 'Volkswagen', type: 'hatchback', segment: 'Premium Hatchback', image: '/images/models/polo.jpg' },

            // Compact Sedan
            { name: 'Dzire', brand: 'Maruti Suzuki', type: 'sedan', segment: 'Compact Sedan', image: '/images/models/dzire.jpg' },
            { name: 'Amaze', brand: 'Honda', type: 'sedan', segment: 'Compact Sedan', image: '/images/models/amaze.jpg' },
            { name: 'Aura', brand: 'Hyundai', type: 'sedan', segment: 'Compact Sedan', image: '/images/models/aura.jpg' },

            // Mid-size Sedan
            { name: 'City', brand: 'Honda', type: 'sedan', segment: 'Mid-size Sedan', image: '/images/models/city.jpg' },
            { name: 'Verna', brand: 'Hyundai', type: 'sedan', segment: 'Mid-size Sedan', image: '/images/models/verna.jpg' },
            { name: 'Ciaz', brand: 'Maruti Suzuki', type: 'sedan', segment: 'Mid-size Sedan', image: '/images/models/ciaz.jpg' },
            { name: 'Virtus', brand: 'Volkswagen', type: 'sedan', segment: 'Mid-size Sedan', image: '/images/models/virtus.jpg' },

            // Executive Sedan
            { name: 'Superb', brand: 'Skoda', type: 'sedan', segment: 'Executive Sedan', image: '/images/models/superb.jpg' },
            { name: 'Octavia', brand: 'Skoda', type: 'sedan', segment: 'Executive Sedan', image: '/images/models/octavia.jpg' },
            { name: 'Camry', brand: 'Toyota', type: 'sedan', segment: 'Executive Sedan', image: '/images/models/camry.jpg' },

            // Compact SUV
            { name: 'Brezza', brand: 'Maruti Suzuki', type: 'suv', segment: 'Compact SUV', image: '/images/models/brezza.jpg' },
            { name: 'Venue', brand: 'Hyundai', type: 'suv', segment: 'Compact SUV', image: '/images/models/venue.jpg' },
            { name: 'Sonet', brand: 'Kia', type: 'suv', segment: 'Compact SUV', image: '/images/models/sonet.jpg' },

            // Mid-size SUV
            { name: 'Creta', brand: 'Hyundai', type: 'suv', segment: 'Mid-size SUV', image: '/images/models/creta.jpg' },
            { name: 'Seltos', brand: 'Kia', type: 'suv', segment: 'Mid-size SUV', image: '/images/models/seltos.jpg' },
            { name: 'Kushaq', brand: 'Skoda', type: 'suv', segment: 'Mid-size SUV', image: '/images/models/kushaq.jpg' },

            // Full-size SUV
            { name: 'Fortuner', brand: 'Toyota', type: 'suv', segment: 'Full-size SUV', image: '/images/models/fortuner.jpg' },
            { name: 'Endeavour', brand: 'Ford', type: 'suv', segment: 'Full-size SUV', image: '/images/models/endeavour.jpg' },
            { name: 'XUV700', brand: 'Mahindra', type: 'suv', segment: 'Full-size SUV', image: '/images/models/xuv700.jpg' },

            // Entry Luxury
            { name: 'A-Class', brand: 'Mercedes-Benz', type: 'luxury', segment: 'Entry Luxury', image: '/images/models/a-class.jpg' },
            { name: '2 Series', brand: 'BMW', type: 'luxury', segment: 'Entry Luxury', image: '/images/models/2-series.jpg' },

            // Executive Luxury
            { name: 'C-Class', brand: 'Mercedes-Benz', type: 'luxury', segment: 'Executive Luxury', image: '/images/models/c-class.jpg' },
            { name: '3 Series', brand: 'BMW', type: 'luxury', segment: 'Executive Luxury', image: '/images/models/3-series.jpg' },
            { name: 'A4', brand: 'Audi', type: 'luxury', segment: 'Executive Luxury', image: '/images/models/a4.jpg' },

            // Premium Luxury
            { name: 'E-Class', brand: 'Mercedes-Benz', type: 'luxury', segment: 'Premium Luxury', image: '/images/models/e-class.jpg' },
            { name: '5 Series', brand: 'BMW', type: 'luxury', segment: 'Premium Luxury', image: '/images/models/5-series.jpg' },
            { name: 'A6', brand: 'Audi', type: 'luxury', segment: 'Premium Luxury', image: '/images/models/a6.jpg' }
        ];

        const modelDocs = models.map(m => ({ ...m, brand: brandMap[m.brand] }));
        await CarModel.insertMany(modelDocs);
        console.log('Models created');

        // 3. Create Services
        const locations = await Location.find();
        const locationIds = locations.map(l => l._id);

        const services = [
            {
                title: 'Basic Wash',
                description: 'Exterior wash, Wheel cleaning, Drying',
                basePrice: 499,
                image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                features: ['Exterior wash', 'Wheel cleaning', 'Drying'],
                availableLocations: locationIds,
                pricingRules: {
                    'Hatchback': 499,
                    'Premium Hatchback': 549,
                    'Compact Sedan': 599,
                    'Mid-size Sedan': 649,
                    'Executive Sedan': 749,
                    'Compact SUV': 699,
                    'Mid-size SUV': 799,
                    'Full-size SUV': 899,
                    'Entry Luxury': 899,
                    'Executive Luxury': 999,
                    'Premium Luxury': 1199
                }
            },
            {
                title: 'Deluxe Wash',
                description: 'Exterior + Interior: Foam wash, Interior vacuuming, Dashboard cleaning, Wheel deep clean',
                basePrice: 899,
                image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                features: ['Foam wash', 'Interior vacuuming', 'Dashboard cleaning', 'Wheel deep clean'],
                availableLocations: locationIds,
                pricingRules: {
                    'Hatchback': 899,
                    'Premium Hatchback': 949,
                    'Compact Sedan': 949,
                    'Mid-size Sedan': 999,
                    'Executive Sedan': 1199,
                    'Compact SUV': 1099,
                    'Mid-size SUV': 1199,
                    'Full-size SUV': 1399,
                    'Entry Luxury': 1499,
                    'Executive Luxury': 1799,
                    'Premium Luxury': 2199
                }
            },
            {
                title: 'Premium Wash',
                description: 'Complete Detailing: Clay bar treatment, Waxing, Interior shampooing, Alloy polishing',
                basePrice: 1499,
                image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                features: ['Clay bar treatment', 'Waxing', 'Interior shampooing', 'Dashboard polishing', 'Leather treatment', 'Alloy polishing'],
                availableLocations: locationIds,
                pricingRules: {
                    'Hatchback': 1299,
                    'Premium Hatchback': 1499,
                    'Compact Sedan': 1599,
                    'Mid-size Sedan': 1799,
                    'Executive Sedan': 1999,
                    'Compact SUV': 1899,
                    'Mid-size SUV': 2199,
                    'Full-size SUV': 2499,
                    'Entry Luxury': 2999,
                    'Executive Luxury': 3299,
                    'Premium Luxury': 3499
                }
            }
        ];

        await Service.insertMany(services);
        console.log('Services created');

        console.log('Database seeded successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
