const mongoose = require('mongoose');
require('dotenv').config();

try {
    const CarModel = require('./models/CarModel');
    console.log('CarModel loaded successfully');
    console.log('Model Name:', CarModel.modelName);
    process.exit(0);
} catch (error) {
    console.error('Error loading CarModel:', error);
    process.exit(1);
}
