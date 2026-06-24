const express = require('express');
const router = express.Router();
const {
    createReview,
    getReviews,
    getApprovedReviews,
    getFeaturedReviews,
    getReview,
    updateReview,
    deleteReview,
    approveReview,
    addResponse,
    getReviewsByRating
} = require('../controllers/reviewController');

// POST - Create new review (public)
router.post('/', createReview);

// GET - Get all reviews (admin)
router.get('/', getReviews);

// GET - Get approved reviews (public)
router.get('/approved', getApprovedReviews);

// GET - Get featured reviews (public)
router.get('/featured', getFeaturedReviews);

// GET - Get reviews by rating (public)
router.get('/rating/:rating', getReviewsByRating);

// GET - Get single review
router.get('/:id', getReview);

// PUT - Update review (admin)
router.put('/:id', updateReview);

// PUT - Approve review (admin)
router.put('/:id/approve', approveReview);

// PUT - Add response to review (admin)
router.put('/:id/response', addResponse);

// DELETE - Delete review (admin)
router.delete('/:id', deleteReview);

module.exports = router;