const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Room name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Room type is required'],
        enum: ['villa-garden-view', 'villa-balcony-view', 'suite', 'deluxe'],
        default: 'villa-garden-view'
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    pricePerNight: {
        type: Number,
        required: [true, 'Price per night is required'],
        min: [0, 'Price cannot be negative']
    },
    maxAdults: {
        type: Number,
        required: [true, 'Max adults capacity is required'],
        min: [1, 'At least 1 adult capacity required']
    },
    maxChildren: {
        type: Number,
        default: 0,
        min: [0, 'Children capacity cannot be negative']
    },
    amenities: [{
        type: String
    }],
    images: [{
        type: String
    }],
    available: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Simple, single export for the model
module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);