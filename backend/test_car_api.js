const axios = require('axios');

const API_URL = 'https://car-9hr9.onrender.com/api/cars';

const test = async () => {
    try {
        console.log('Testing Car API...');

        // 1. Get Brands
        console.log('Fetching Brands...');
        const brands = await axios.get(`${API_URL}/brands`);
        console.log(`Found ${brands.data.length} brands.`);
        if (brands.data.length === 0) throw new Error('No brands found');

        const firstBrand = brands.data[0];
        console.log(`First Brand: ${firstBrand.name}`);

        // 2. Get Models for First Brand
        console.log(`Fetching Models for ${firstBrand.name}...`);
        const models = await axios.get(`${API_URL}/models/${firstBrand._id}`);
        console.log(`Found ${models.data.length} models.`);
        if (models.data.length === 0) throw new Error('No models found');

        console.log('Car API Test Passed!');
    } catch (err) {
        console.error('Test Failed:', err.message);
        if (err.response) console.error(err.response.data);
    }
};

test();
