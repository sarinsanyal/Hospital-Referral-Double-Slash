const express = require('express');
const User = require('../../db/models/User');

const router = express.Router();
const randomPFPs = [
    "https://i.ibb.co/Vtv8pJM/notion-avatar-1734263349216.png",
    "https://i.ibb.co/Dzv4Y0f/notion-avatar-1734263083425.png",
    "https://i.ibb.co/x8WVSt4/notion-avatar-1734263470907.png",
    "https://i.ibb.co/1K77SBC/notion-avatar-1734263518113.png"
]



router.post('/register', async (req, res) => {
    let { name, username, password } = req.body;

    name = name.trim();
    username = username.trim();
    password = password.trim();
    avatar = randomPFPs[Math.floor(Math.random() * randomPFPs.length)];

    if (!name || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const nameRegex = /^[A-Za-z]+(\s[A-Za-z]+)*$/;
    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: 'Name must contain only English letters and spaces.' });
    }
    if (name.length > 100) {
        return res.status(400).json({ message: 'Name must be 100 characters or less.' });
    }

    const usernameRegex = /^[A-Za-z0-9_.]+$/;
    if (username.length < 4) {
        return res.status(400).json({ message: 'Username must be at least 4 characters.' });
    }
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Username must contain only letters, numbers, _ or .' });
    }

    const passwordRegex = /^[A-Za-z\d@$!%*?&]+$/;
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password can only contain letters, numbers, and the special characters @$!%*?&.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            name,
            username,
            avatar,
            password
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});



router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    username = username.trim();
    password = password.trim();

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const usernameRegex = /^[A-Za-z0-9_.]+$/;
    if (username.length < 4) {
        return res.status(400).json({ message: 'Username must be at least 4 characters.' });
    }
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Username must contain only letters, numbers, _ or .' });
    }

    const passwordRegex = /^[A-Za-z\d@$!%*?&]+$/;
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password can only contain letters, numbers, and the special characters @$!%*?&.' });
    }


    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Username not found.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong password!' });
        }

        req.session.user = { username: user.username, name: user.name, avatar: user.avatar };

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Something went wrong" });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

module.exports = router;
