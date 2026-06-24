const express = require('express');
const router = express.Router();


const {createBooking,getBookings,getBooking,updateBooking,deleteBooking,getBookingsByEmail} = require('../controllers/bookingController');

router.post('/' , createBooking);

router.get('/', getBookings);

router.get('/email/:email', getBookingsByEmail);

router.get('/:id', getBooking);

router.put('/:id', updateBooking);

router.delete('/:id', deleteBooking);

module.exports = router;