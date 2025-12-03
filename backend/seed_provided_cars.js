const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Schemas
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
    { brand: 'Maruti Suzuki', models: ['Alto', 'WagonR', 'Swift', 'Baleno', 'Baleno Alpha', 'Dzire', 'Brezza'] },
    { brand: 'Hyundai', models: ['i10', 'i20', 'Aura', 'Verna', 'Venue'] },
    { brand: 'Tata Motors', models: ['Altroz', 'Altroz XZ+'] },
    { brand: 'Honda', models: ['Jazz', 'Amaze', 'City'] },
    { brand: 'Volkswagen', models: ['Polo', 'Virtus'] },
    { brand: 'Skoda', models: ['Octavia', 'Superb'] },
    { brand: 'Kia', models: ['Seltos', 'Sonet'] },
    { brand: 'Toyota', models: ['Camry'] },
    { brand: 'Mahindra', models: ['XUV700'] },
    { brand: 'Audi', models: ['Audi A4', 'Audi A6'] },
    { brand: 'BMW', models: ['BMW 2 Series', 'BMW 3 Series', 'BMW 5 Series'] },
    { brand: 'Mercedes-Benz', models: ['Mercedes A-Class', 'Mercedes C-Class', 'Mercedes E-Class'] }
];

const carTypeImages = {
    'hatchback': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=500',
    'sedan': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=500',
    'suv': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500',
    'luxury': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=500'
};

const getType = (model, brand) => {
    const m = model.toLowerCase();
    const b = brand.toLowerCase();

    if (b === 'audi' || b === 'bmw' || b === 'mercedes-benz') return 'luxury';
    if (m.includes('camry') || m.includes('superb')) return 'luxury';

    if (m.includes('brezza') || m.includes('venue') || m.includes('seltos') || m.includes('sonet') || m.includes('xuv700')) return 'suv';

    if (m.includes('alto') || m.includes('wagonr') || m.includes('swift') || m.includes('baleno') || m.includes('i10') || m.includes('i20') || m.includes('altroz') || m.includes('jazz') || m.includes('polo') || m.includes('a-class')) return 'hatchback';

    return 'sedan'; // Default for Dzire, Aura, Verna, Amaze, City, Virtus, Octavia, etc.
};

const seedProvidedCars = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Upsert Brands
        for (const b of brandsData) {
            await CarBrand.findOneAndUpdate(
                { name: b.name },
                { logo: b.logo },
                { upsert: true, new: true }
            );
            console.log(`Upserted Brand: ${b.name}`);
        }

        // 2. Process Models
        for (const group of carsList) {
            const brand = await CarBrand.findOne({ name: group.brand });
            if (!brand) {
                console.error(`Brand not found: ${group.brand}`);
                continue;
            }

            for (const modelName of group.models) {
                const type = getType(modelName, group.brand);

                // Check if model exists (possibly under 'Other' or wrong brand) and update it
                // Or create new
                const existingModel = await CarModel.findOne({ name: modelName });

                if (existingModel) {
                    existingModel.brand = brand._id;
                    existingModel.type = type;
                    existingModel.image = carTypeImages[type];
                    await existingModel.save();
                    console.log(`Updated Model: ${modelName} -> ${group.brand}`);
                } else {
                    await CarModel.create({
                        name: modelName,
                        brand: brand._id,
                        type: type,
                        image: carTypeImages[type]
                    });
                    console.log(`Created Model: ${modelName} (${group.brand})`);
                }
            }
        }

        // 3. Cleanup "Other" brand if empty (Optional, but good for hygiene)
        const otherBrand = await CarBrand.findOne({ name: 'Other' });
        if (otherBrand) {
            const modelsInOther = await CarModel.countDocuments({ brand: otherBrand._id });
            if (modelsInOther === 0) {
                await CarBrand.findByIdAndDelete(otherBrand._id);
                console.log('Deleted empty "Other" brand');
            }
        }

        console.log('Car list enforcement complete');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedProvidedCars();
