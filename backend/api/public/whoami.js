const express = require('express');
const whoamiRouter = express.Router();

whoamiRouter.get('/', (req, res) => {
    if (req.session.userId) {
        return res.status(200).json({
            loggedIn: true,
            role: req.session.role,
            name: req.session.name
        });
    }
    return res.status(200).json({
        loggedIn: false,
        role: null,
        name: null
    });
});

module.exports = whoamiRouter;
