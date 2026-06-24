const Gallery = require('../models/gallery');

// Create new gallery image
const createGallery = async (req, res) => {
    try {
        const { title, imageUrl, category, description, featured, displayOrder } = req.body;

        const gallery = await Gallery.create({
            title,
            imageUrl,
            category,
            description,
            featured,
            displayOrder
        });

        res.status(201).json({
            success: true,
            message: 'Gallery image created successfully',
            data: gallery
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all gallery images
const getGalleries = async (req, res) => {
    try {
        const galleries = await Gallery.find({ active: true })
                                      .sort({ displayOrder: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: galleries.length,
            data: galleries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get gallery image by ID
const getGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);
        
        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        res.status(200).json({
            success: true,
            data: gallery
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update gallery image
const updateGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gallery image updated successfully',
            data: gallery
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete gallery image (soft delete)
const deleteGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gallery image deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get galleries by category
const getGalleriesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const galleries = await Gallery.find({ 
            category: category,
            active: true 
        }).sort({ displayOrder: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: galleries.length,
            data: galleries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get featured gallery images
const getFeaturedGalleries = async (req, res) => {
    try {
        const galleries = await Gallery.find({ 
            featured: true,
            active: true 
        }).sort({ displayOrder: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: galleries.length,
            data: galleries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createGallery,
    getGalleries,
    getGallery,
    updateGallery,
    deleteGallery,
    getGalleriesByCategory,
    getFeaturedGalleries
};