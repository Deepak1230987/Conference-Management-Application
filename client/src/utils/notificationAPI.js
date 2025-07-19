import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.25.1.5/ictacem2025';

class NotificationAPI {
    // Get user notifications with pagination
    static async getUserNotifications(page = 1, limit = 20, onlyUnread = false) {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
                params: { page, limit, onlyUnread },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error.response?.data || error;
        }
    }

    // Get unread notification count
    static async getUnreadCount() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/notifications/unread-count`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error.response?.data || error;
        }
    }

    // Mark notification as read
    static async markAsRead(notificationId) {
        try {
            const response = await axios.patch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {}, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error.response?.data || error;
        }
    }

    // Mark all notifications as read
    static async markAllAsRead() {
        try {
            const response = await axios.patch(`${API_BASE_URL}/api/notifications/read-all`, {}, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error.response?.data || error;
        }
    }

    // Delete notification
    static async deleteNotification(notificationId) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/notifications/${notificationId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error.response?.data || error;
        }
    }

    // Admin: Create system notification
    static async createSystemNotification(recipientId, title, message, type = 'system_notification', priority = 'medium') {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/notifications/system`, {
                recipientId,
                title,
                message,
                type,
                priority
            }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error creating system notification:', error);
            throw error.response?.data || error;
        }
    }

    // Admin: Get all notifications
    static async getAllNotifications(page = 1, limit = 50, type = null, recipientId = null) {
        try {
            const params = { page, limit };
            if (type) params.type = type;
            if (recipientId) params.recipientId = recipientId;

            const response = await axios.get(`${API_BASE_URL}/api/notifications/admin/all`, {
                params,
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all notifications:', error);
            throw error.response?.data || error;
        }
    }
}

export default NotificationAPI;
