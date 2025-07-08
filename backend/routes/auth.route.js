import express from 'express';
import { register, login, getUserProfile, logout } from '../controller/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);  // Changed from GET to POST

// Protected routes
router.get('/profile', protect, getUserProfile);

export default router;