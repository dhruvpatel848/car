const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@glocars.in';
        const password = 'Glocar@07#';

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists. Updating password...');
            existingAdmin.password = password;
            await existingAdmin.save();
        } else {
            console.log('Creating new admin...');
            await Admin.create({ email, password });
        }

        console.log('Admin seeded successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
