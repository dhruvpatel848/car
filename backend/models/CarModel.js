const mongoose = require('mongoose');

const carModelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'CarBrand', required: true },
    type: {
        type: String,
        enum: ['hatchback', 'sedan', 'suv', 'luxury'],
        required: true
    },
    segment: { type: String, required: true }, // e.g., 'Compact Sedan', 'Mid-size SUV'
    image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CarModel', carModelSchema);
