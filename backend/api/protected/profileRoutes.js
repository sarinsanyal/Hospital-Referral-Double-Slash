const express = require('express');
const multer = require('multer');
const User = require('../../db/models/User');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|gif|webp/;
        const isValid = allowedTypes.test(file.mimetype);
        if (isValid) {
            cb(null, true);
        } else {
            cb(null, true);
            req.fileValidationError = 'Unsupported file type';
        }
    }
});

router.put('/newavatar', upload.single('avatar'), async (req, res) => {
    if (req.fileValidationError) {
        return res.status(404).json({ message: req.fileValidationError });
    }

    try {
        const username = req.session.user.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No image file found' });
        }

        const base64Image = req.file.buffer.toString('base64');
        const imageType = req.file.mimetype;
        const avatarString = `data:${imageType};base64,${base64Image}`;

        user.avatar = avatarString;
        await user.save();

        user.password = '';
        req.session.user.avatar = user.avatar;
        res.status(200).json({ message: 'Avatar updated successfully', user: req.session.user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
});


router.put('/updateme', async (req, res) => {
    try {
        const { name, email, phone, specialty, password } = req.body;
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

        if (password) {
            const allowedCharsRegex = /^[A-Za-z\d@$!%*?&]+$/;

            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }

            if (!allowedCharsRegex.test(password)) {
                return res.status(400).json({ message: 'Password can only contain letters, numbers, and the special characters @$!%*?&' });
            }

            updates.password = password;
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
        req.session.user = { ...updatedUser.toObject(), password: '' };

        res.status(200).json({ message: 'Profile updated successfully', user: req.session.user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get('/test', (req, res) => {
    res.json({ message: 'Profile routes working' });
});

module.exports = router;
