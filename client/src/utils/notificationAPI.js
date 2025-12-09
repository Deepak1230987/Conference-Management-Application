import axios from 'axios';

// Note: axios.defaults.baseURL is already set to '/ictacem2025' in AuthContext.jsx
// So we only need to specify '/api/notifications' and it will become '/ictacem2025/api/notifications'
const API_BASE_URL = '/api';

console.log('NotificationAPI initialized. axios.defaults.baseURL:', axios.defaults.baseURL);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Full notification URL will be:', axios.defaults.baseURL + API_BASE_URL + '/notifications');

// Add response interceptor to detect HTML responses (means proxy is broken)
axios.interceptors.response.use(
    response => {
        // Check if we got HTML instead of JSON
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('text/html') && typeof response.data === 'string') {
            console.error('❌ Received HTML instead of JSON! This means the API request is not reaching the backend.');
            console.error('Request URL:', response.config.url);
            console.error('Content-Type:', contentType);
            console.error('This usually means:');
            console.error('1. Apache proxy is not configured correctly');
            console.error('2. The backend server is not running');
            console.error('3. The URL path is being caught by the frontend router');

            throw new Error('API Error: Received HTML instead of JSON. The backend API is not accessible. Please check Apache proxy configuration.');
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

class NotificationAPI {
    // Get user notifications with pagination
    static async getUserNotifications(page = 1, limit = 20, onlyUnread = false) {
        try {
            const response = await axios.get(`${API_BASE_URL}/notifications`, {
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
            const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
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
            const response = await axios.post(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
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
            const response = await axios.post(`${API_BASE_URL}/notifications/read-all`, {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
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
            const response = await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
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
            const response = await axios.post(`${API_BASE_URL}/notifications/system`, {
                recipientId,
                title,
                message,
                type,
                priority
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
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

            const response = await axios.get(`${API_BASE_URL}/notifications/admin/all`, {
                params,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all notifications:', error);
            throw error.response?.data || error;
        }
    }
}

export default NotificationAPI;
