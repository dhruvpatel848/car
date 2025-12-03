const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');
const Location = require('./models/Location');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedServices = [
    {
        title: 'Premium Hand Wash',
        description: 'Complete exterior hand wash with premium wax finish.',
        price: 500,
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1000',
        features: ['Hand Wash', 'Tyre Dressing', 'Wax Finish'],
        availableLocations: ['Ahmedabad', 'Surat']
    },
    {
        title: 'Interior Detailing',
        description: 'Deep cleaning of all interior surfaces, seats, and carpets.',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1000',
        features: ['Vacuuming', 'Steam Cleaning', 'Leather Conditioning'],
        availableLocations: ['Ahmedabad']
    },
    {
        title: 'Ceramic Coating',
        description: 'Long-lasting protection for your car paint.',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1000',
        features: ['Paint Correction', 'Ceramic Layer', '3 Year Warranty'],
        availableLocations: ['Surat']
    }
];

const seedLocations = [
    { city: 'Ahmedabad', areas: ['Satellite', 'Bopal', 'Gota'] },
    { city: 'Surat', areas: ['Adajan', 'Vesu', 'Varachha'] }
];

const seedDB = async () => {
    try {
        await Service.deleteMany({});
        await Location.deleteMany({});

        const createdLocations = await Location.insertMany(seedLocations);

        const ahmedabad = createdLocations.find(l => l.city === 'Ahmedabad');
        const surat = createdLocations.find(l => l.city === 'Surat');

        const servicesWithIds = seedServices.map(service => {
            let locationIds = [];
            if (service.availableLocations.includes('Ahmedabad') && ahmedabad) locationIds.push(ahmedabad._id);
            if (service.availableLocations.includes('Surat') && surat) locationIds.push(surat._id);

            return { ...service, availableLocations: locationIds };
        });

        await Service.insertMany(servicesWithIds);

        console.log('Database Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
