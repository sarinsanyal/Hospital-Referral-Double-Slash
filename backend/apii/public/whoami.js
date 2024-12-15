const express = require('express');
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

module.exports = router;
