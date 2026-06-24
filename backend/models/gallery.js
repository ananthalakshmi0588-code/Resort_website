const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Image title is required'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['rooms', 'amenities', 'pool', 'garden', 'beach', 'restaurant', 'lobby', 'spa'],
        default: 'rooms'
    },
    description: {
        type: String,
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);
