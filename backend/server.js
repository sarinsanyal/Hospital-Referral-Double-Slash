const express = require('express');
const path = require('path');
const connectDB = require('./db/connect.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const whoamiRouter = require('./api/public/whoami');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const frontendOutDir = path.join(__dirname, '..', 'frontend', 'dist');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 }
}));

app.use('/api/auth', require('./api/public/auth.js'));
app.use('/api/public/whoami', whoamiRouter);
app.use(express.static(frontendOutDir));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Running at: http://127.0.0.1:${PORT}`);
    });
}

startServer();
