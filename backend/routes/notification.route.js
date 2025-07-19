import express from 'express';
import {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createSystemNotification,
    getAllNotifications
} from '../controller/notification.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// User notification routes
router.get('/', protect, getUserNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.patch('/:notificationId/read', protect, markAsRead);
router.patch('/read-all', protect, markAllAsRead);
router.delete('/:notificationId', protect, deleteNotification);

// Admin notification routes
router.post('/system', protect, admin, createSystemNotification);
router.get('/admin/all', protect, admin, getAllNotifications);

export default router;
