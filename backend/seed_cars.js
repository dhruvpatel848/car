const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CarBrand = require('./models/CarBrand');
const CarModel = require('./models/CarModel');

dotenv.config();

const brandsData = [
    { name: 'Maruti Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Maruti_Suzuki_logo.svg/1200px-Maruti_Suzuki_logo.svg.png' },
    { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/2560px-Hyundai_Motor_Company_logo.svg.png' },
    { name: 'Tata Motors', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/2560px-Tata_logo.svg.png' },
    { name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Mahindra_Rise_New_Logo.svg/1200px-Mahindra_Rise_New_Logo.svg.png' },
    { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/2560px-Toyota_carlogo.svg.png' },
    { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/2560px-Honda.svg.png' },
    { name: 'Kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kia_logo.svg/1200px-Kia_logo.svg.png' },
    { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/2560px-Mercedes-Logo.svg.png' },
    { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2560px-BMW.svg.png' },
    { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/2560px-Audi-Logo_2016.svg.png' }
];

const carTypeImages = {
    'hatchback': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=500',
    'sedan': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=500',
    'suv': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500',
    'luxury': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=500'
};

const modelsData = {
    'Maruti Suzuki': [
        { name: 'Swift', type: 'hatchback' },
        { name: 'Baleno', type: 'hatchback' },
        { name: 'Dzire', type: 'sedan' },
        { name: 'Brezza', type: 'suv' },
        { name: 'Grand Vitara', type: 'suv' }
    ],
    'Hyundai': [
        { name: 'i20', type: 'hatchback' },
        { name: 'Verna', type: 'sedan' },
        { name: 'Creta', type: 'suv' },
        { name: 'Venue', type: 'suv' },
        { name: 'Tucson', type: 'suv' }
    ],
    'Tata Motors': [
        { name: 'Tiago', type: 'hatchback' },
        { name: 'Altroz', type: 'hatchback' },
        { name: 'Nexon', type: 'suv' },
        { name: 'Harrier', type: 'suv' },
        { name: 'Safari', type: 'suv' }
    ],
    'Mahindra': [
        { name: 'Thar', type: 'suv' },
        { name: 'XUV700', type: 'suv' },
        { name: 'Scorpio-N', type: 'suv' },
        { name: 'Bolero', type: 'suv' }
    ],
    'Toyota': [
        { name: 'Glanza', type: 'hatchback' },
        { name: 'Innova Crysta', type: 'suv' },
        { name: 'Fortuner', type: 'suv' },
        { name: 'Camry', type: 'luxury' }
    ],
    'Honda': [
        { name: 'Amaze', type: 'sedan' },
        { name: 'City', type: 'sedan' },
        { name: 'Elevate', type: 'suv' }
    ],
    'Kia': [
        { name: 'Seltos', type: 'suv' },
        { name: 'Sonet', type: 'suv' },
        { name: 'Carens', type: 'suv' }
    ],
    'Mercedes-Benz': [
        { name: 'C-Class', type: 'luxury' },
        { name: 'E-Class', type: 'luxury' },
        { name: 'GLC', type: 'luxury' }
    ],
    'BMW': [
        { name: '3 Series', type: 'luxury' },
        { name: '5 Series', type: 'luxury' },
        { name: 'X1', type: 'luxury' }
    ],
    'Audi': [
        { name: 'A4', type: 'luxury' },
        { name: 'A6', type: 'luxury' },
        { name: 'Q3', type: 'luxury' }
    ]
};

const seedCars = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await CarBrand.deleteMany({});
        await CarModel.deleteMany({});
        console.log('Cleared existing car data');

        // Insert Brands
        const createdBrands = await CarBrand.insertMany(brandsData);
        console.log(`Seeded ${createdBrands.length} brands`);

        // Insert Models
        let modelCount = 0;
        for (const brand of createdBrands) {
            const models = modelsData[brand.name];
            if (models) {
                const modelsWithBrandId = models.map(m => ({
                    ...m,
                    brand: brand._id,
                    image: carTypeImages[m.type] || carTypeImages['sedan']
                }));
                await CarModel.insertMany(modelsWithBrandId);
                modelCount += models.length;
            }
        }
        console.log(`Seeded ${modelCount} models`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedCars();
