const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await Order.deleteMany({});
        console.log('All orders cleared.');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
