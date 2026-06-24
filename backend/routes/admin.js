const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Admin only routes
router.get('/', authorize('admin', 'manager'), getUsers);
router.get('/:id', authorize('admin', 'manager'), getUser);
router.put('/:id', authorize('admin', 'manager'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;