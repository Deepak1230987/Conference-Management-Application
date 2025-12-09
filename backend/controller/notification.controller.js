import NotificationService from '../utils/notificationService.js';
import Notification from '../models/notification.model.js';

// Get user notifications
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, onlyUnread = false } = req.query;

        console.log('=== getUserNotifications ===');
        console.log('User ID:', userId);
        console.log('Query params:', { page, limit, onlyUnread });

        const result = await NotificationService.getUserNotifications(
            userId,
            parseInt(page),
            parseInt(limit),
            onlyUnread === 'true'
        );

        console.log('Notifications found:', result.notifications.length);
        console.log('First notification:', result.notifications[0]);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        res.json({
            success: true,
            count
        });

    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching unread count',
            error: error.message
        });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await NotificationService.markAsRead(notificationId, userId);

        res.json({
            success: true,
            data: notification
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        const modifiedCount = await NotificationService.markAllAsRead(userId);

        res.json({
            success: true,
            message: `Marked ${modifiedCount} notifications as read`
        });

    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking all notifications as read',
            error: error.message
        });
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

// Admin: Create system notification
export const createSystemNotification = async (req, res) => {
    try {
        const { recipientId, title, message, type = 'system_notification', priority = 'medium' } = req.body;
        const senderId = req.user.id;

        if (!recipientId || !title || !message) {
            return res.status(400).json({
                success: false,
                message: 'recipientId, title, and message are required'
            });
        }

        const notification = await NotificationService.createNotification({
            recipientId,
            senderId,
            type,
            title,
            message,
            priority
        });

        res.status(201).json({
            success: true,
            data: notification
        });

    } catch (error) {
        console.error('Error creating system notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating system notification',
            error: error.message
        });
    }
};

// Admin: Get all notifications (for monitoring)
export const getAllNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 50, type, recipientId } = req.query;

        const query = {};
        if (type) query.type = type;
        if (recipientId) query.recipient = recipientId;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const notifications = await Notification.find(query)
            .populate('recipient', 'name email')
            .populate('sender', 'name email')
            .populate('paperId', 'title ictacemId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Notification.countDocuments(query);

        res.json({
            success: true,
            data: {
                notifications,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalNotifications: total,
                    hasNext: parseInt(page) * parseInt(limit) < total,
                    hasPrev: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching all notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};