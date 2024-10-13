const express = require('express');
const User = require('../../db/models/User');

const router = express.Router();

router.put('/updateme', async (req, res) => {
    try {
        const { name, email, phone, specialty } = req.body;
        const userId = req.session.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updates = {};

        if (name) updates.name = name;

        if (email) {
            const emailInUse = await User.findOne({ email, _id: { $ne: userId } });
            if (emailInUse) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            updates.email = email;
        }

        if (user.role === 'patient') {
            if (phone) updates.phone = phone;
        } else if (user.role === 'doctor') {
            if (specialty) updates.specialty = specialty;
        } else {
            return res.status(400).json({ message: 'Update profile permission not allowed' });
        }

        Object.assign(user, updates);

        const updatedUser = await user.save();
        req.session.user = { ...updatedUser.toObject(), password: undefined };

        res.status(200).json({ message: 'Profile updated successfully', user: req.session.user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;
