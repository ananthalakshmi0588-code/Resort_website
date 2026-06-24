const Package = require('../models/package');

// Create new package
const createPackage = async (req, res) => {
    try {
        const package = await Package.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Package created successfully',
            data: package
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all packages
const getPackages = async (req, res) => {
    try {
        const packages = await Package.find().sort({ featured: -1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get active packages
const getActivePackages = async (req, res) => {
    try {
        const now = new Date();
        const packages = await Package.find({
            active: true,
            validFrom: { $lte: now },
            validTo: { $gte: now }
        }).sort({ featured: -1, price: 1 });
        
        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get featured packages
const getFeaturedPackages = async (req, res) => {
    try {
        const now = new Date();
        const packages = await Package.find({
            featured: true,
            active: true,
            validFrom: { $lte: now },
            validTo: { $gte: now }
        }).sort({ createdAt: -1 }).limit(4);
        
        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get package by ID
const getPackage = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        
        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        res.status(200).json({
            success: true,
            data: package
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update package
const updatePackage = async (req, res) => {
    try {
        const package = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Package updated successfully',
            data: package
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete package
const deletePackage = async (req, res) => {
    try {
        const package = await Package.findByIdAndDelete(req.params.id);

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Package deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get packages by tag
const getPackagesByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const now = new Date();
        
        const packages = await Package.find({
            tags: tag,
            active: true,
            validFrom: { $lte: now },
            validTo: { $gte: now }
        }).sort({ featured: -1, price: 1 });

        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Increment booking count
const incrementBookingCount = async (req, res) => {
    try {
        const package = await Package.findByIdAndUpdate(
            req.params.id,
            { $inc: { bookingCount: 1 } },
            { new: true }
        );

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking count updated',
            data: package
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPackage,
    getPackages,
    getActivePackages,
    getFeaturedPackages,
    getPackage,
    updatePackage,
    deletePackage,
    getPackagesByTag,
    incrementBookingCount
};