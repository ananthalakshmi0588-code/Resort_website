const express = require('express');
const router = express.Router();
const {
    createAmenity,
    getAmenities,
    getAmenity,
    updateAmenity,
    deleteAmenity,
    getAmenitiesByCategory,
    getFeaturedAmenities
} = require('../controllers/amenityController');

// POST - Create new amenity
router.post('/', createAmenity);

// GET - Get all amenities
router.get('/', getAmenities);

// GET - Get featured amenities
router.get('/featured', getFeaturedAmenities);

// GET - Get amenities by category
router.get('/category/:category', getAmenitiesByCategory);

// GET - Get single amenity
router.get('/:id', getAmenity);

// PUT - Update amenity
router.put('/:id', updateAmenity);

// DELETE - Delete amenity
router.delete('/:id', deleteAmenity);

module.exports = router;