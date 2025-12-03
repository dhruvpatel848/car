const mongoose = require('mongoose');

const carModelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'CarBrand', required: true },
    type: {
        type: String,
        enum: ['hatchback', 'sedan', 'suv', 'luxury'],
        required: true
    },
    image: { type: String } // URL to car image
}, { timestamps: true });

module.exports = mongoose.model('CarModel', carModelSchema);
