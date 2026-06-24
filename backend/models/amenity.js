const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Amenity name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['dining', 'recreation', 'wellness', 'technology', 'room-features', 'pool', 'sports'],
        default: 'room-features'
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        trim: true
    },
    available: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Amenity', amenitySchema);