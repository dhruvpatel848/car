const mongoose = require('mongoose');

const carBrandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String, required: true } // URL to logo image
}, { timestamps: true });

module.exports = mongoose.model('CarBrand', carBrandSchema);
