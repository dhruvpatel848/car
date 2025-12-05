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
            { name: 'Maruti Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Suzuki_logo_2.svg' },
            { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' },
            { name: 'Tata', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg' },
            { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg' },
            { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg' },
            { name: 'Skoda', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Skoda_Auto_logo_%282023%29.svg' },
            { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg' },
            { name: 'Kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Kia_logo.svg' },
            { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_logo.svg' },
            { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
            { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
            { name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Mahindra_Rise_New_Logo.svg' },
            { name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg' }
        ];

        const createdBrands = await CarBrand.insertMany(brands);
        const brandMap = {};
        createdBrands.forEach(b => brandMap[b.name] = b._id);
        console.log('Brands created');

        // 2. Create Models
        const models = [
            // Hatchback
            { name: 'Alto', brand: 'Maruti Suzuki', type: 'hatchback', segment: 'Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/39013/alto-exterior-right-front-three-quarter-61.jpeg' },
            { name: 'WagonR', brand: 'Maruti Suzuki', type: 'hatchback', segment: 'Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/112947/wagon-r-2022-exterior-right-front-three-quarter-3.jpeg' },
            { name: 'Swift', brand: 'Maruti Suzuki', type: 'hatchback', segment: 'Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/54399/swift-exterior-right-front-three-quarter-64.jpeg' },
            { name: 'i10', brand: 'Hyundai', type: 'hatchback', segment: 'Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140591/grand-i10-nios-exterior-right-front-three-quarter-7.jpeg' },

            // Premium Hatchback
            { name: 'Baleno', brand: 'Maruti Suzuki', type: 'hatchback', segment: 'Premium Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/112939/baleno-exterior-right-front-three-quarter-4.jpeg' },
            { name: 'i20', brand: 'Hyundai', type: 'hatchback', segment: 'Premium Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40530/i20-exterior-right-front-three-quarter-5.jpeg' },
            { name: 'Altroz', brand: 'Tata', type: 'hatchback', segment: 'Premium Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/32597/altroz-exterior-right-front-three-quarter-79.jpeg' },
            { name: 'Jazz', brand: 'Honda', type: 'hatchback', segment: 'Premium Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48547/jazz-exterior-right-front-three-quarter-2.jpeg' },
            { name: 'Polo', brand: 'Volkswagen', type: 'hatchback', segment: 'Premium Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/45230/polo-exterior-right-front-three-quarter-2.jpeg' },

            // Compact Sedan
            { name: 'Dzire', brand: 'Maruti Suzuki', type: 'sedan', segment: 'Compact Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/45691/dzire-exterior-right-front-three-quarter-3.jpeg' },
            { name: 'Amaze', brand: 'Honda', type: 'sedan', segment: 'Compact Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/amaze-exterior-right-front-three-quarter-3.jpeg' },
            { name: 'Aura', brand: 'Hyundai', type: 'sedan', segment: 'Compact Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140593/aura-exterior-right-front-three-quarter-7.jpeg' },

            // Mid-size Sedan
            { name: 'City', brand: 'Honda', type: 'sedan', segment: 'Mid-size Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg' },
            { name: 'Verna', brand: 'Hyundai', type: 'sedan', segment: 'Mid-size Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144159/verna-exterior-right-front-three-quarter-6.jpeg' },
            { name: 'Ciaz', brand: 'Maruti Suzuki', type: 'sedan', segment: 'Mid-size Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48542/ciaz-exterior-right-front-three-quarter-4.jpeg' },
            { name: 'Virtus', brand: 'Volkswagen', type: 'sedan', segment: 'Mid-size Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/113245/virtus-exterior-right-front-three-quarter-6.jpeg' },

            // Executive Sedan
            { name: 'Superb', brand: 'Skoda', type: 'sedan', segment: 'Executive Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48367/superb-exterior-right-front-three-quarter-2.jpeg' },
            { name: 'Octavia', brand: 'Skoda', type: 'sedan', segment: 'Executive Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/51261/octavia-exterior-right-front-three-quarter-2.jpeg' },
            { name: 'Camry', brand: 'Toyota', type: 'sedan', segment: 'Executive Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/110235/camry-exterior-right-front-three-quarter-3.jpeg' },

            // Compact SUV
            { name: 'Brezza', brand: 'Maruti Suzuki', type: 'suv', segment: 'Compact SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/121345/brezza-exterior-right-front-three-quarter-5.jpeg' },
            { name: 'Venue', brand: 'Hyundai', type: 'suv', segment: 'Compact SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/venue-exterior-right-front-three-quarter-3.jpeg' },
            { name: 'Sonet', brand: 'Kia', type: 'suv', segment: 'Compact SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139599/sonet-exterior-right-front-three-quarter-2.jpeg' },

            // Mid-size SUV
            { name: 'Creta', brand: 'Hyundai', type: 'suv', segment: 'Mid-size SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg' },
            { name: 'Seltos', brand: 'Kia', type: 'suv', segment: 'Mid-size SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144163/seltos-exterior-right-front-three-quarter.jpeg' },
            { name: 'Kushaq', brand: 'Skoda', type: 'suv', segment: 'Mid-size SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/55159/kushaq-exterior-right-front-three-quarter-3.jpeg' },

            // Full-size SUV
            { name: 'Fortuner', brand: 'Toyota', type: 'suv', segment: 'Full-size SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-19.jpeg' },
            { name: 'Endeavour', brand: 'Ford', type: 'suv', segment: 'Full-size SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/37640/endeavour-exterior-right-front-three-quarter-149473.jpeg' },
            { name: 'XUV700', brand: 'Mahindra', type: 'suv', segment: 'Full-size SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter-3.jpeg' },

            // Entry Luxury
            { name: 'A-Class', brand: 'Mercedes-Benz', type: 'luxury', segment: 'Entry Luxury', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/50409/a-class-limousine-exterior-right-front-three-quarter-4.jpeg' },
            { name: '2 Series', brand: 'BMW', type: 'luxury', segment: 'Entry Luxury', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/50219/2-series-gran-coupe-exterior-right-front-three-quarter-2.jpeg' },

            // Executive Luxury
            { name: 'C-Class', brand: 'Mercedes-Benz', type: 'luxury', segment: 'Executive Luxury', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/116203/c-class-exterior-right-front-three-quarter-2.jpeg' },
            { name: '3 Series', brand: 'BMW', type: 'luxury', segment: 'Executive Luxury', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139049/3-series-gran-limousine-exterior-right-front-three-quarter-2.jpeg' },
            { name: 'A4', brand: 'Audi', type: 'luxury', segment: 'Executive Luxury', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/51909/a4-exterior-right-front-three-quarter-2.jpeg' },

            // Premium Luxury
            { name: 'E-Class', brand: 'Mercedes-Benz', type: 'luxury', segment: 'Premium Luxury', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48017/e-class-exterior-right-front-three-quarter-3.jpeg' },
            { name: '5 Series', brand: 'BMW', type: 'luxury', segment: 'Premium Luxury', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/124145/5-series-exterior-right-front-three-quarter-2.jpeg' },
            { name: 'A6', brand: 'Audi', type: 'luxury', segment: 'Premium Luxury', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41035/a6-exterior-right-front-three-quarter-3.jpeg' }
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
