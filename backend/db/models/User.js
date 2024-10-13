const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        validate: {
            validator: function (v) {

                return v.length <= 100;
            },
            message: 'Name cannot have more than 100 characters.'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
        validate: {
            validator: function (v) {

                return validator.isEmail(v);
            },
            message: 'Invalid email address.'
        }
    },
    phone: {
        type: String,
        default: null,
        validate: {
            validator: function (v) {
                return v === null || validator.isMobilePhone(v, 'any', { strictMode: true });
            },
            message: 'Invalid phone number.'
        }
    },
    specialty: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'authority'],
        required: true
    },
    avatar: {
        type: String,
        default: null
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
