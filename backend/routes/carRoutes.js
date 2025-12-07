const express = require('express');
const router = express.Router();
const path = require('path');
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

// Add Brand
router.post('/brands', upload.single('logo'), async (req, res) => {
    try {
        const { name } = req.body;
        let logo = '';
        if (req.file) {
            logo = `/api/images/${path.parse(req.file.filename).name}`; // Use dynamic image API
        }
        const brand = new CarBrand({ name, logo });
        await brand.save();
        res.status(201).json(brand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Brand
router.put('/brands/:id', upload.single('logo'), async (req, res) => {
    try {
        const { name } = req.body;
        const updateData = { name };
        if (req.file) {
            updateData.logo = `/api/images/${path.parse(req.file.filename).name}`;
        }
        const brand = await CarBrand.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(brand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Brand
router.delete('/brands/:id', async (req, res) => {
    try {
        await CarBrand.findByIdAndDelete(req.params.id);
        res.json({ message: 'Brand deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// --- MODELS ---

// Get models for a brand
router.get('/models/:brandId', async (req, res) => {
    try {
        const models = await CarModel.find({ brand: req.params.brandId }).sort({ name: 1 });
        res.json(models);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add Model
router.post('/models', upload.single('image'), async (req, res) => {
    try {
        const { name, brandId, type, segment } = req.body;
        let image = '';
        if (req.file) {
            image = `/api/images/${path.parse(req.file.filename).name}`;
        }
        const model = new CarModel({ name, brand: brandId, type, segment, image });
        await model.save();
        res.status(201).json(model);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Model
router.put('/models/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, type, segment } = req.body;
        const updateData = { name, type, segment };
        if (req.file) {
            updateData.image = `/api/images/${path.parse(req.file.filename).name}`;
        }
        const model = await CarModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(model);
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
