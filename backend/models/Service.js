const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true }, // Baseline price
    pricingRules: { type: Map, of: Number }, // Segment-specific prices
    image: { type: String, required: true }, // URL or path
    features: [{ type: String }], // List of features (e.g., "Exterior Wash", "Vacuum")
    availableLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }], // References Location model
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
