const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const adminEmail = process.env.ADMIN_MAIL;
        const adminPassword = process.env.ADMIN_PASS;

        if (!adminEmail || !adminPassword) {
            throw new Error('Admin email or password is missing in environment variables');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.findOneAndUpdate(
            { email: adminEmail },
            { name: 'Admin', email: adminEmail, password: hashedPassword, role: 'authority' },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log('Authority access configured successfully');

    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
