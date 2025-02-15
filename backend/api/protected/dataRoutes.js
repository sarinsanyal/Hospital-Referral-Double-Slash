const express = require('express');
const User = require('../../db/models/User');

const router = express.Router();

router.get('/hospitals', async (req, res) => {
    try {
        const hospitals = await User.find({ userType: 'hospital' }, 'name totalBeds emptyBeds username');
        res.status(200).json(hospitals);
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ message: 'Error fetching hospitals' });
    }
});

router.post('/request', async (req, res) => {
    try {
        const { to } = req.body;

        const hospital = await User.findOne({ username: to, userType: 'hospital' });
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        const user = await User.findOne({ username: req.session.user.username });
        user.state = "pending";
        user.to = to;
        await user.save();
        req.session.user.to = to;
        req.session.user.state = "pending";

        if (!hospital.requests.includes(user.username)) {
            hospital.requests.push(user.username);
            await hospital.save();
        }

        res.status(200).json({ message: "Request sent successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error processing request" });
    }
});




module.exports = router;
