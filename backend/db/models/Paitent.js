const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\+\d{1,3}\d{4,14}(?:x\d+)?$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number with country code!`,
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
}, { timestamps: true });

// Hash password before saving to the database
patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
