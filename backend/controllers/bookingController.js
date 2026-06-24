const Booking = require('../models/bookings'); // ✅ lowercase, plural
const Room = require('../models/room');

// Create new booking
const createBooking = async (req, res) => {
    try {
        const { guestName, email, phone, roomId, checkIn, checkOut, adults, children, specialRequests } = req.body;

        // Input validation
        if (!guestName || !email || !phone || !roomId || !checkIn || !checkOut || !adults) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Date validation
        if (new Date(checkIn) >= new Date(checkOut)) {
            return res.status(400).json({
                success: false,
                message: 'Check-out date must be after check-in date'
            });
        }

        // Get room
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        if (!room.available) {
            return res.status(400).json({
                success: false,
                message: 'Room is not available for booking'
            });
        }

        // Calculate price
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        const totalPrice = room.pricePerNight * nights;

        // Capacity check
        const totalGuests = adults + (children || 0);
        if (totalGuests > room.maxAdults + room.maxChildren) {
            return res.status(400).json({
                success: false,
                message: `This room can only accommodate ${room.maxAdults} adults and ${room.maxChildren} children`
            });
        }

        // Create booking
        const booking = await Booking.create({
            guestName,
            email: email.toLowerCase(),
            phone,
            room: roomId,
            checkIn,
            checkOut,
            adults,
            children: children || 0,
            roomType: room.type,
            totalPrice,
            specialRequests: specialRequests || '',
            status: 'pending'
        });

        await booking.populate('room', 'name type pricePerNight images amenities');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });

    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('room', 'name type pricePerNight images')
            .sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get bookings by email
const getBookingsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const bookings = await Booking.find({ email: email.toLowerCase() })
            .populate('room', 'name type images pricePerNight amenities')
            .sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single booking
const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('room', 'name type pricePerNight images amenities');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update booking
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('room', 'name type pricePerNight images');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking updated successfully',
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getBookingsByEmail,
    getBooking,
    updateBooking,
    deleteBooking
};