const axios = require('axios');

const API_URL = 'https://car-9hr9.onrender.com/api/admin/login';

const testLogin = async () => {
    try {
        console.log('Testing Admin Login...');
        const res = await axios.post(API_URL, {
            email: 'admin',
            password: 'admin123'
        });
        console.log('Login Successful!');
        console.log('Token:', res.data.token ? 'Received' : 'Missing');
    } catch (err) {
        console.error('Login Failed:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        }
    }
};

testLogin();
