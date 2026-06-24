const express = require('express');
const router = express.Router();
const {
    createPackage,
    getPackages,
    getActivePackages,
    getFeaturedPackages,
    getPackage,
    updatePackage,
    deletePackage,
    getPackagesByTag,
    incrementBookingCount
} = require('../controllers/packageController');

// POST - Create new package
router.post('/', createPackage);

// GET - Get all packages (admin)
router.get('/', getPackages);

// GET - Get active packages (public)
router.get('/active', getActivePackages);

// GET - Get featured packages (public)
router.get('/featured', getFeaturedPackages);

// GET - Get packages by tag (public)
router.get('/tag/:tag', getPackagesByTag);

// GET - Get single package
router.get('/:id', getPackage);

// PUT - Update package
router.put('/:id', updatePackage);

// PUT - Increment booking count
router.put('/:id/increment-booking', incrementBookingCount);

// DELETE - Delete package
router.delete('/:id', deletePackage);

module.exports = router;