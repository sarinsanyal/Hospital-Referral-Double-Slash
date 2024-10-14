const express = require('express');
const whoamiRouter = express.Router();

whoamiRouter.get('/whoami', (req, res) => {
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

module.exports = whoamiRouter;
