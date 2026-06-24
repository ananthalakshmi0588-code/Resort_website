const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    guestName: {
        type: String,
        required: [true, 'Guest name is required'], 
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String, 
        required: [true, 'Phone number is required'],
        trim: true
    },
    
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    
    checkIn: {
        type: Date,
        required: [true, 'Check-in date is required']
    },
    checkOut: {
        type: Date,
        required: [true, 'Check-out date is required']
    },
    adults: {
        type: Number,
        required: [true, 'Number of adults is required'],
        min: [1, 'At least 1 adult is required']
    },
    children: {
        type: Number,
        default: 0,
        min: [0, 'Children cannot be negative']
    },

    roomType: {
        type: String,
        required: [true, 'Room type is required'],
        enum: ['villa-garden-view', 'villa-balcony-view', 'suite', 'deluxe', 'family'],
        default: 'deluxe'
    },

    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Price cannot be negative']
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    }, 

    specialRequests: {
        type: String,
        maxlength: 500
    },

    bookingDate: {
        type: Date,
        default: Date.now
    }
});

bookingSchema.virtual('totalNights').get(function(){
    if (this.checkIn && this.checkOut) {
        const diffTime = Math.abs(this.checkOut - this.checkIn);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
});

bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// ✅ Use the safe export pattern
module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);