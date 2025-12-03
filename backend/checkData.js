const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');
const Location = require('./models/Location');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected. Checking data...');
        const services = await Service.find({});
        const locations = await Location.find({});

        console.log(`Found ${services.length} services.`);
        console.log(`Found ${locations.length} locations.`);

        if (locations.length > 0) {
            console.log('Sample Location:', locations[0]);
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
