const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Admin Login (Simple)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Master Admin Credentials
    const masterEmail = 'admin@glocars.in';
    const masterPass = 'Glocar@07#';

    if (email === masterEmail && password === masterPass) {
        return res.json({ token: 'master-admin-token', email });
    }

    // Check DB
    const admin = await Admin.findOne({ email });
    if (admin && admin.password === password) { // In real app, compare hash
        return res.json({ token: 'db-admin-token', email });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
