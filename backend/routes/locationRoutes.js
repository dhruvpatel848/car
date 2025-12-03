const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Get all active locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find({ isActive: true }).select('city areas');
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new location
router.post('/', async (req, res) => {
    console.log('POST /api/locations request body:', req.body);
    console.log('Location Schema Paths:', Object.keys(Location.schema.paths));
    try {
        const location = new Location({
            city: req.body.city,
            areas: req.body.areas
        });
        const newLocation = await location.save();
        res.status(201).json(newLocation);
    } catch (err) {
        console.error('Error in POST /api/locations:', err);
        console.error('Stack:', err.stack);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Location with this city already exists' });
        }
        res.status(500).json({ message: err.message, stack: err.stack });
    }
});

// Delete a location
router.delete('/:id', async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.json({ message: 'Location deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
