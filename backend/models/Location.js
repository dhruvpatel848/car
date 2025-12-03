const mongoose = require('mongoose');

if (mongoose.models.Location) {
    delete mongoose.models.Location;
}

const locationSchema = new mongoose.Schema({
    city: { type: String, required: true, unique: true },
    areas: [{ type: String }], // Specific areas if needed, or just city level
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

console.log('DEFINING LOCATION MODEL. Schema:', locationSchema.obj);
module.exports = mongoose.model('Location', locationSchema);
