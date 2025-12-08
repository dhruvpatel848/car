const axios = require('axios');

const API_URL = 'https://car-9hr9.onrender.com/api/services';

const serviceData = {
    title: "Premium Hand Wash",
    description: "Complete exterior hand wash with premium wax finish.",
    price: 500,
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1000",
    features: [
        "Hand Wash",
        "Tyre Dressing",
        "Wax Finish"
    ],
    availableLocations: [
        "Surat"
    ]
};

async function createService() {
    try {
        console.log('Sending request to:', API_URL);
        console.log('Payload:', JSON.stringify(serviceData, null, 2));
        const response = await axios.post(API_URL, serviceData);
        console.log('Success! Service created:', response.data);
    } catch (error) {
        console.error('Error creating service:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

createService();
