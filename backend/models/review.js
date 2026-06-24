const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    guestName: {
        type: String,
        required: [true, 'Guest name is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    title: {
        type: String,
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    roomType: {
        type: String,
        enum: ['villa-garden-view', 'villa-balcony-view', 'suite', 'deluxe', 'family', ''],
        default: ''
    },
    stayDate: {
        type: Date
    },
    approved: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    response: {
        adminReply: { type: String, trim: true },
        repliedAt: { type: Date }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);