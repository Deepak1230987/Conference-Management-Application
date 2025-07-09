import express from 'express';
import { register, login, getUserProfile, logout, forgotPassword, resetPassword } from '../controller/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);  // Changed from GET to POST
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Test endpoint
router.get('/test', (req, res) => {
    console.log('Test endpoint hit!');
    res.json({ message: 'Test endpoint working!' });
});

// Protected routes
router.get('/profile', protect, getUserProfile);

export default router;