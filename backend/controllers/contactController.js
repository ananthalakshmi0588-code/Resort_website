const Contact = require('../models/contact');

// Create contact information
const createContact = async (req, res) => {
    try {
        // Check if contact info already exists
        const existingContact = await Contact.findOne();
        if (existingContact) {
            return res.status(400).json({
                success: false,
                message: 'Contact information already exists. Use update instead.'
            });
        }

        const contact = await Contact.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Contact information created successfully',
            data: contact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get contact information
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findOne();
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact information not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update contact information
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findOneAndUpdate(
            {},
            req.body,
            { 
                new: true,
                runValidators: true,
                upsert: true // Create if doesn't exist
            }
        );

        res.status(200).json({
            success: true,
            message: 'Contact information updated successfully',
            data: contact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete contact information
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete();

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact information not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact information deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createContact,
    getContact,
    updateContact,
    deleteContact
};