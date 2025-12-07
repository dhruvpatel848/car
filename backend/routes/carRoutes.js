const express = require('express');
const router = express.Router();
const CarBrand = require('../models/CarBrand');
const CarModel = require('../models/CarModel');
const upload = require('../middleware/upload');

// --- BRANDS ---

// Get all brands
router.get('/brands', async (req, res) => {
    try {
        const brands = await CarBrand.find().sort({ name: 1 });
        res.json(brands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Delete a model
router.delete('/models/:id', async (req, res) => {
    try {
        await CarModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Model deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
