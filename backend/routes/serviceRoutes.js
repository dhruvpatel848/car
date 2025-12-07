const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

const upload = require('../middleware/upload');

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
                return res.json([]);
            }
        }

        const services = await Service.find(query).populate('availableLocations');
        // Removed Cache-Control to ensure fresh data after updates
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a service
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const serviceData = { ...req.body };
        // If file uploaded, use relative web path
        if (req.file) {
            serviceData.image = `/images/uploads/${req.file.filename}`;
        }

        // Convert city names to Location IDs
        if (serviceData.availableLocations) {
            // Ensure array (sometimes req.body.array comes as comma string or single val if multipart)
            let locations = serviceData.availableLocations;
            if (typeof locations === 'string') {
                try {
                    locations = JSON.parse(locations);
                } catch (e) {
                    locations = [locations];
                }
            }

            if (Array.isArray(locations)) {
                const Location = require('../models/Location');
                const locationDocs = await Location.find({
                    city: { $in: locations }
                });
                serviceData.availableLocations = locationDocs.map(loc => loc._id);
            }
        }

        // Parse pricingRules if it comes as string
        if (typeof serviceData.pricingRules === 'string') {
            try {
                serviceData.pricingRules = JSON.parse(serviceData.pricingRules);
            } catch (e) { }
        }

        // Parse features if it comes as string (should be array)
        if (typeof serviceData.features === 'string') {
            serviceData.features = serviceData.features.split(',').map(f => f.trim());
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
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const serviceData = { ...req.body };

        if (req.file) {
            serviceData.image = `/images/uploads/${req.file.filename}`;
        }

        // Handle availableLocations parsing
        if (serviceData.availableLocations) {
            let locations = serviceData.availableLocations;
            if (typeof locations === 'string') {
                try { locations = JSON.parse(locations); } catch (e) { locations = [locations]; }
            }

            if (Array.isArray(locations)) {
                // Check if need conversion (are they cities?)
                const needsConversion = locations.some(loc => typeof loc === 'string' && !loc.match(/^[0-9a-fA-F]{24}$/));
                if (needsConversion) {
                    const Location = require('../models/Location');
                    const locationDocs = await Location.find({
                        city: { $in: locations }
                    });
                    serviceData.availableLocations = locationDocs.map(loc => loc._id);
                } else {
                    serviceData.availableLocations = locations;
                }
            }
        }

        // Parse pricingRules
        if (typeof serviceData.pricingRules === 'string') {
            try { serviceData.pricingRules = JSON.parse(serviceData.pricingRules); } catch (e) { }
        }

        // Parse features
        if (typeof serviceData.features === 'string') {
            if (serviceData.features.startsWith('[')) {
                try { serviceData.features = JSON.parse(serviceData.features); } catch (e) { }
            } else {
                serviceData.features = serviceData.features.split(',').map(f => f.trim());
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
