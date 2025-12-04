const mongoose = require('mongoose');
require('dotenv').config();

const serviceSchema = new mongoose.Schema({
    title: String,
    basePrice: Number,
    pricingRules: { type: Map, of: Number }
});
const Service = mongoose.model('Service', serviceSchema);

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const services = await Service.find({});
        console.log(`Found ${services.length} services`);

        services.forEach(s => {
            console.log(`Service: ${s.title}, Base: ${s.basePrice}`);
            console.log('Rules:', JSON.stringify(s.pricingRules));
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
