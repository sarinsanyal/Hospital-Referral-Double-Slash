const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    speciality: {
        type: String,
        required: true,
    },
    contacts: {
        type: [String],
        validate: [arrayLimit, 'Contacts array exceeds the limit of 10'],
    },
}, { timestamps: true });

// Validate the length of contacts array
function arrayLimit(val) {
    return val.length <= 10;
}

// Hash password before saving to the database
doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
