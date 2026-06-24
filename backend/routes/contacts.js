const express = require('express');
const router = express.Router();
const {
    createContact,
    getContact,
    updateContact,
    deleteContact
} = require('../controllers/contactController');

// POST - Create contact information
router.post('/', createContact);

// GET - Get contact information
router.get('/', getContact);

// PUT - Update contact information
router.put('/', updateContact);

// DELETE - Delete contact information
router.delete('/', deleteContact);

module.exports = router;