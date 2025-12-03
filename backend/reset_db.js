const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const resetDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear Collections
        await mongoose.connection.collection('carbrands').deleteMany({});
        console.log('Cleared CarBrands');

        await mongoose.connection.collection('carmodels').deleteMany({});
        console.log('Cleared CarModels');

        await mongoose.connection.collection('services').deleteMany({});
        console.log('Cleared Services');

        console.log('Database reset complete');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetDb();
