const axios = require('axios');

const API_URL = 'http://localhost:5000/api/cars';

const testDelete = async () => {
    try {
        console.log('Testing Model Deletion...');

        // 1. Get a Brand ID
        const brands = await axios.get(`${API_URL}/brands`);
        if (brands.data.length === 0) throw new Error('No brands found');
        const brandId = brands.data[0]._id;

        // 2. Create a Dummy Model
        console.log('Creating dummy model...');
        const newModel = await axios.post(`${API_URL}/models`, {
            name: 'DeleteMe',
            brand: brandId,
            type: 'hatchback',
            image: 'https://via.placeholder.com/150'
        });
        const modelId = newModel.data._id;
        console.log(`Created model: ${modelId}`);

        // 3. Delete the Model
        console.log(`Deleting model: ${modelId}...`);
        await axios.delete(`${API_URL}/models/${modelId}`);
        console.log('Delete request successful');

        // 4. Verify Deletion
        const models = await axios.get(`${API_URL}/models/${brandId}`);
        const found = models.data.find(m => m._id === modelId);
        if (found) throw new Error('Model still exists after deletion');

        console.log('Model Deletion Test Passed!');
    } catch (err) {
        console.error('Test Failed:', err.message);
        if (err.response) console.error(err.response.data);
    }
};

testDelete();
