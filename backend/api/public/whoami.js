const express = require('express');
const whoamiRouter = express.Router();

whoamiRouter.get('/', (req, res) => {
    if (req.session.userId) {
        return res.status(200).json({
            loggedIn: true,
            role: req.session.role
        });
    }
    return res.status(200).json({
        loggedIn: false,
        role: null
    });
});

module.exports = whoamiRouter;
