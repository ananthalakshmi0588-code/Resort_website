const express = require('express');
const router = express.Router();
const {
    createGallery,
    getGalleries,
    getGallery,
    updateGallery,
    deleteGallery,
    getGalleriesByCategory,
    getFeaturedGalleries
} = require('../controllers/galleryController');

// POST - Create new gallery image
router.post('/', createGallery);

// GET - Get all gallery images
router.get('/', getGalleries);

// GET - Get featured gallery images
router.get('/featured', getFeaturedGalleries);

// GET - Get galleries by category
router.get('/category/:category', getGalleriesByCategory);

// GET - Get single gallery image
router.get('/:id', getGallery);

// PUT - Update gallery image
router.put('/:id', updateGallery);

// DELETE - Delete gallery image
router.delete('/:id', deleteGallery);

module.exports = router;