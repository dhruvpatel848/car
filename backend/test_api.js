const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:5000/api';
const LOG_FILE = 'api_test_results.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function testEndpoints() {
    fs.writeFileSync(LOG_FILE, 'Starting API Test\n');
    log('Testing API Endpoints...');

    // 0. Login
    let token;
    try {
        log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/admin/login`, {
            email: 'admin@glocar.com',
            password: 'admin123'
        });
        token = loginRes.data.token;
        log('Login Success. Token received.');
    } catch (err) {
        log(`Login Failed: ${err.message}`);
        // Try with hardcoded env values if possible, or skip
    }

    // 1. Test Orders (GET)
    try {
        log('Testing GET /orders...');
        const res = await axios.get(`${API_URL}/orders`);
        log(`GET /orders Success: Status ${res.status}, ${res.data.length} orders found`);
    } catch (err) {
        log(`GET /orders Failed: ${err.response ? err.response.status : err.message}`);
        if (err.response) log(`Data: ${JSON.stringify(err.response.data)}`);
    }

    // 2. Test Locations (POST)
    if (token) {
        try {
            log('Testing POST /locations with token...');
            const res = await axios.post(`${API_URL}/locations`, {
                city: 'TestCity_' + Date.now(),
                areas: ['Area1', 'Area2']
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            log(`POST /locations Success: Status ${res.status}, ID: ${res.data._id}`);
        } catch (err) {
            log(`POST /locations Failed: ${err.response ? err.response.status : err.message}`);
            if (err.response) log(`Data: ${JSON.stringify(err.response.data)}`);
        }
    } else {
        log('Skipping POST /locations (No Token)');
    }

    // 3. Test Services (GET)
    try {
        log('Testing GET /services...');
        const res = await axios.get(`${API_URL}/services`);
        log(`GET /services Success: Status ${res.status}, ${res.data.length} services found`);
    } catch (err) {
        log(`GET /services Failed: ${err.response ? err.response.status : err.message}`);
    }
}

testEndpoints();
