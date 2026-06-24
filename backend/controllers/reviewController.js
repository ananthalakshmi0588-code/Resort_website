const Review = require('../models/review');

// Create new review
const createReview = async (req, res) => {
    try {
        const { guestName, email, rating, title, comment, roomType, stayDate } = req.body;

        const review = await Review.create({
            guestName,
            email,
            rating,
            title,
            comment,
            roomType,
            stayDate
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully. It will be visible after approval.',
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all reviews (for admin)
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get approved reviews (for public)
const getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ 
            approved: true 
        }).sort({ featured: -1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get featured reviews
const getFeaturedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ 
            approved: true,
            featured: true 
        }).sort({ createdAt: -1 }).limit(6);
        
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get review by ID
const getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update review (admin only)
const updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete review
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Approve review
const approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review approved successfully',
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Add admin response to review
const addResponse = async (req, res) => {
    try {
        const { adminReply } = req.body;
        
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { 
                response: {
                    adminReply,
                    repliedAt: new Date()
                }
            },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Response added successfully',
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get reviews by rating
const getReviewsByRating = async (req, res) => {
    try {
        const { rating } = req.params;
        const reviews = await Review.find({ 
            rating: parseInt(rating),
            approved: true 
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
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
};