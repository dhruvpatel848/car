const express = require('express');
const router = express.Router();
const CarBrand = require('../models/CarBrand');
const CarModel = require('../models/CarModel');

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

// Create a brand
router.post('/brands', async (req, res) => {
    const brand = new CarBrand(req.body);
    try {
        const newBrand = await brand.save();
        res.status(201).json(newBrand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a brand
router.delete('/brands/:id', async (req, res) => {
    try {
        await CarBrand.findByIdAndDelete(req.params.id);
        // Optionally delete associated models
        await CarModel.deleteMany({ brand: req.params.id });
        res.json({ message: 'Brand deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- MODELS ---

// Get models by brand
router.get('/models/:brandId', async (req, res) => {
    try {
        const models = await CarModel.find({ brand: req.params.brandId }).sort({ name: 1 });
        res.json(models);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a model
router.post('/models', async (req, res) => {
    const model = new CarModel(req.body);
    try {
        const newModel = await model.save();
        res.status(201).json(newModel);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
