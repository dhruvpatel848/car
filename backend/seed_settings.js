const axios = require('axios');

async function seedSettings() {
    try {
        console.log('Seeding Settings...');
        const res = await axios.post('https://car-9hr9.onrender.com/api/settings/seed');
        console.log('Result:', res.data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

seedSettings();
