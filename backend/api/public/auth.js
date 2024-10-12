const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../db/models/User');

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    const { role, name, email, phone, password, specialty } = req.body;

    if (!role || !name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (role === 'doctor') {
        if (!specialty) return res.status(400).json({ message: 'Specialty is required' });
    } else {
        if (!phone) return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            phone: role !== 'doctor' ? phone : null,
            specialty: role === 'doctor' ? specialty : null,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        req.session.role = user.role;

        res.cookie('user', user.email, { maxAge: 3600000, httpOnly: true });
        res.status(200).json({ message: 'Login successful', role: req.session.role });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

authRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('user');
        res.status(200).json({ message: 'Logout successful' });
    });
});

module.exports = authRouter;
