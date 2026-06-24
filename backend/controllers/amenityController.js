const Amenity = require('../models/amenity');

// Create new amenity
const createAmenity = async (req, res) => {
    try {
        const { name, category, description, icon, available, featured, displayOrder } = req.body;

        const amenity = await Amenity.create({
            name,
            category,
            description,
            icon,
            available,
            featured,
            displayOrder
        });

        res.status(201).json({
            success: true,
            message: 'Amenity created successfully',
            data: amenity
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all amenities
const getAmenities = async (req, res) => {
    try {
        const amenities = await Amenity.find().sort({ displayOrder: 1, name: 1 });
        
        res.status(200).json({
            success: true,
            count: amenities.length,
            data: amenities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get amenity by ID
const getAmenity = async (req, res) => {
    try {
        const amenity = await Amenity.findById(req.params.id);
        
        if (!amenity) {
            return res.status(404).json({
                success: false,
                message: 'Amenity not found'
            });
        }

        res.status(200).json({
            success: true,
            data: amenity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update amenity
const updateAmenity = async (req, res) => {
    try {
        const amenity = await Amenity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!amenity) {
            return res.status(404).json({
                success: false,
                message: 'Amenity not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Amenity updated successfully',
            data: amenity
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete amenity
const deleteAmenity = async (req, res) => {
    try {
        const amenity = await Amenity.findByIdAndDelete(req.params.id);

        if (!amenity) {
            return res.status(404).json({
                success: false,
                message: 'Amenity not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Amenity deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get amenities by category
const getAmenitiesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const amenities = await Amenity.find({ 
            category: category,
            available: true 
        }).sort({ displayOrder: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: amenities.length,
            data: amenities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get featured amenities
const getFeaturedAmenities = async (req, res) => {
    try {
        const amenities = await Amenity.find({ 
            featured: true,
            available: true 
        }).sort({ displayOrder: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: amenities.length,
            data: amenities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createAmenity,
    getAmenities,
    getAmenity,
    updateAmenity,
    deleteAmenity,
    getAmenitiesByCategory,
    getFeaturedAmenities
};