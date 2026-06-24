const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Package description is required'],
        trim: true
    },
    shortDescription: {
        type: String,
        trim: true,
        maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Price cannot be negative']
    },
    duration: {
        type: Number, // Number of nights
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 night']
    },
    inclusions: [{
        name: { type: String, required: true },
        description: { type: String }
    }],
    roomTypes: [{
        type: String,
        enum: ['villa-garden-view', 'villa-balcony-view', 'suite', 'deluxe', 'family']
    }],
    validFrom: {
        type: Date,
        required: [true, 'Valid from date is required']
    },
    validTo: {
        type: Date,
        required: [true, 'Valid to date is required']
    },
    images: [{
        type: String
    }],
    featured: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    maxGuests: {
        adults: { type: Number, default: 2 },
        children: { type: Number, default: 0 }
    },
    tags: [{
        type: String,
        enum: ['honeymoon', 'family', 'romantic', 'adventure', 'luxury', 'weekend', 'seasonal', 'couple', 'wellness', 'beach']
    }],
    bookingCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Virtual for discount percentage
packageSchema.virtual('discountPercentage').get(function() {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Virtual for package validity
packageSchema.virtual('isValid').get(function() {
    const now = new Date();
    return this.validFrom <= now && this.validTo >= now && this.active;
});

// Enable virtuals
packageSchema.set('toJSON', { virtuals: true });
packageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Package', packageSchema);