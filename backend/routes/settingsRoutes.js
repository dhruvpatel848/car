const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Get all settings
router.get('/', async (req, res) => {
    try {
        const settings = await Settings.find();
        // Convert array to object for easier frontend consumption
        const settingsMap = {};
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });
        res.json(settingsMap);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Initialize/Seed Settings (Internal use or first run)
router.post('/seed', async (req, res) => {
    try {
        const defaultSettings = [
            { key: 'charge_suv', value: 500, label: 'SUV Extra Charge', description: 'Extra amount for SUV/Crossover' },
            { key: 'charge_sedan', value: 200, label: 'Sedan Extra Charge', description: 'Extra amount for Sedan' },
            { key: 'charge_hatchback', value: 0, label: 'Hatchback Extra Charge', description: 'Extra amount for Hatchback' },
            { key: 'charge_luxury', value: 1000, label: 'Luxury Car Extra Charge', description: 'Extra amount for Luxury cars' }
        ];

        for (const setting of defaultSettings) {
            await Settings.findOneAndUpdate(
                { key: setting.key },
                setting,
                { upsert: true, new: true }
            );
        }
        res.json({ message: 'Settings seeded' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a setting
router.put('/:key', async (req, res) => {
    try {
        const { value } = req.body;
        const setting = await Settings.findOneAndUpdate(
            { key: req.params.key },
            { value },
            { new: true }
        );
        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
