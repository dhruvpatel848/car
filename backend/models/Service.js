const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // URL or path
    features: [{ type: String }], // List of features (e.g., "Exterior Wash", "Vacuum")
    availableLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }], // References Location model
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
