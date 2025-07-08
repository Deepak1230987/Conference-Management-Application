import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Hook for managing users data in the admin panel
 * @param {Object} options - Configuration options
 * @returns {Object} User data and management functions
 */
export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [papers, setPapers] = useState({});
    const [expandedUser, setExpandedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all users
    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/admin/users');
            setUsers(response.data);
            setIsLoading(false);
        } catch (err) {
            setError(`Failed to load users: ${err.response?.data?.message || err.message}`);
            setIsLoading(false);
        }
    }, []);

    // Fetch papers for a specific user
    const fetchUserPapers = async (userId) => {
        try {
            // Toggle expanded user
            if (expandedUser === userId) {
                setExpandedUser(null);
                return;
            }

            setExpandedUser(userId);

            // Check if we already have the papers for this user
            if (papers[userId]) return;

            const response = await axios.get(`/api/admin/users/${userId}/papers`);
            setPapers((prev) => ({ ...prev, [userId]: response.data }));
        } catch (err) {
            setError(`Failed to load papers: ${err.response?.data?.message || err.message}`);
        }
    };

    // Update a specific paper in the papers state (for real-time updates)
    const updatePaperInUserState = (updatedPaper) => {
        if (!updatedPaper || !updatedPaper.user) return;

        const userId = updatedPaper.user;

        // If we have papers for this user, update the specific paper
        if (papers[userId]) {
            setPapers((prev) => ({
                ...prev,
                [userId]: prev[userId].map((paper) =>
                    paper._id === updatedPaper._id ? updatedPaper : paper
                )
            }));
        }
    };

    // Get filtered users based on search query
    const filteredUsers = users.filter((user) => {
        // Handle potential undefined values or nested user structure
        const username = user?.username || user?.user?.username || '';
        const email = user?.email || user?.user?.email || '';
        const userId = user?.customUserId || user?.user?.customUserId || '';

        const searchLower = searchQuery.toLowerCase().trim();

        return username.toLowerCase().includes(searchLower) ||
            email.toLowerCase().includes(searchLower) ||
            userId.toLowerCase().includes(searchLower);
    });

    return {
        users,
        papers,
        setPapers,
        expandedUser,
        isLoading,
        error,
        setError,
        searchQuery,
        setSearchQuery,
        fetchUsers,
        fetchUserPapers,
        updatePaperInUserState,
        filteredUsers,
    };
};