const express = require('express');

const User = require('../../db/models/User');
const router = express.Router();

router.get('/whoami', (req, res) => {
    if (req.session.user) {
        return res.status(200).json({
            loggedIn: true,
            user: req.session.user
        });
    }
    return res.status(200).json({
        loggedIn: false,
        user: null
    });
});

router.get('/username', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const isAvailable = await User.checkUsername(username);

    if (isAvailable) {
        return res.status(200).json({ available: true, message: 'Username is available' });
    } else {
        return res.status(409).json({ available: false, message: 'Username is already taken' });
    }
});

module.exports = router;
