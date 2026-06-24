const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    mapLink: {
        type: String,
        trim: true
    },
    operatingHours: {
        type: String,
        default: '24/7'
    },
    socialMedia: {
        facebook: { type: String, trim: true },
        instagram: { type: String, trim: true },
        twitter: { type: String, trim: true },
        youtube: { type: String, trim: true }
    },
    emergencyContact: {
        type: String,
        trim: true
    },
    reservationEmail: {
        type: String,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);