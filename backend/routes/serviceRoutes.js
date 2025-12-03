const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services
router.get('/', async (req, res) => {
    try {
        const { location } = req.query;
        let query = {};

        // If location query is present, we need to find the Location ID first
        if (location) {
            const Location = require('../models/Location');
            const locDoc = await Location.findOne({ city: location });
            if (locDoc) {
                query.availableLocations = locDoc._id;
            } else {
                // If location not found, return empty or handle as needed
                // For now, let's return empty if the requested location doesn't exist
                return res.json([]);
            }
        }

        const services = await Service.find(query).populate('availableLocations');
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a service
router.post('/', async (req, res) => {
    try {
        const serviceData = { ...req.body };

        // Convert city names to Location IDs
        if (serviceData.availableLocations && Array.isArray(serviceData.availableLocations)) {
            const Location = require('../models/Location');
            const locationDocs = await Location.find({
                city: { $in: serviceData.availableLocations }
            });
            serviceData.availableLocations = locationDocs.map(loc => loc._id);
        }

        const service = new Service(serviceData);
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (err) {
        console.error("Error adding service:", err);
        res.status(400).json({ message: err.message });
    }
});

// Update a service
router.put('/:id', async (req, res) => {
    try {
        const serviceData = { ...req.body };

        // Convert city names to Location IDs if provided
        if (serviceData.availableLocations && Array.isArray(serviceData.availableLocations)) {
            // Check if the array contains strings (city names) or already IDs
            const needsConversion = serviceData.availableLocations.some(loc => typeof loc === 'string' && !loc.match(/^[0-9a-fA-F]{24}$/));

            if (needsConversion) {
                const Location = require('../models/Location');
                const locationDocs = await Location.find({
                    city: { $in: serviceData.availableLocations }
                });
                serviceData.availableLocations = locationDocs.map(loc => loc._id);
            }
        }

        const updatedService = await Service.findByIdAndUpdate(req.params.id, serviceData, { new: true });
        res.json(updatedService);
    } catch (err) {
        console.error("Error updating service:", err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a service
router.delete('/:id', async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
