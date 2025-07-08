import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Hook for managing papers data in the admin panel
 * @returns {Object} Papers data and management functions
 */
export const usePapers = () => {
    const [allPapers, setAllPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [activePaper, setActivePaper] = useState(null);
    const [filter, setFilter] = useState('all');
    const [themeFilter, setThemeFilter] = useState('all');
    const [modeOfPresentationFilter, setModeOfPresentationFilter] = useState('all');
    const [paperSearchQuery, setPaperSearchQuery] = useState('');

    // Fetch all papers
    const fetchAllPapers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/admin/papers');
            setAllPapers(response.data);
            setIsLoading(false);
            return response.data; // Return data for use in other hooks
        } catch (err) {
            setError({
                type: 'error',
                message: `Failed to load papers: ${err.response?.data?.message || err.message}`
            });
            setIsLoading(false);
            return [];
        }
    }, []);

    // Update paper status and review
    const updatePaperStatus = async (paperId, status, updateErrorState, localReviewText, updatePaperInUserState) => {
        try {
            // Make sure we have a defined value for review, even if it's empty
            const reviewText = localReviewText !== undefined ? localReviewText : '';

            // Create the data object with both status and review
            const reviewData = {
                status,
                review: reviewText
            };

            console.log('Updating paper status:', status);
            console.log('Updating paper review:', reviewText);
            console.log('Sending to API:', reviewData);

            const response = await axios.patch(`/api/admin/papers/${paperId}/status`, reviewData);

            // Get the updated paper from the response
            const updatedPaper = response.data;

            // Log the response for debugging
            console.log('API response:', updatedPaper);

            // Update the papers list with the new data
            setAllPapers((prevPapers) =>
                prevPapers.map((paper) =>
                    paper._id === paperId ? { ...updatedPaper } : paper
                )
            );

            // If we have the updatePaperInUserState function, use it to update the user-specific papers
            if (typeof updatePaperInUserState === 'function') {
                updatePaperInUserState(updatedPaper);
            }

            // Reset state after successful update
            setReviewText('');
            setActivePaper(null);

            // Show success message
            updateErrorState && updateErrorState({
                type: 'success',
                message: `Paper status updated to ${status}${reviewText ? ' with review comments' : ''}`,
            });

            return updatedPaper;
        } catch (err) {
            console.error('Error updating paper status:', err);

            updateErrorState && updateErrorState({
                type: 'error',
                message: `Failed to update paper status: ${err.response?.data?.message || err.message}`,
            });

            throw err;
        }
    };

    // Download paper PDF
    const downloadPaper = useCallback(async (paperId, errorSetter) => {
        try {
            const response = await axios.get(`/api/admin/papers/download/${paperId}`, {
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `paper_${paperId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error downloading paper:', err);
            errorSetter && errorSetter({
                type: 'error',
                message: 'Failed to download paper'
            });
        }
    }, []);

    // Toggle submission function
    const toggleSubmission = useCallback(async (paperId, type, reset) => {
        try {
            const endpoint = type === 'abstract' ? 'toggle-abstract' : 'toggle-fullpaper';
            const body = type === 'abstract' ? { resetAbstract: reset } : { resetFullPaper: reset };

            const response = await axios.put(`/api/admin/papers/${paperId}/${endpoint}`, body);

            // Update the papers list with the updated paper
            setAllPapers(prevPapers =>
                prevPapers.map(paper =>
                    paper._id === paperId ? response.data.paper : paper
                )
            );

            setError({
                type: 'success',
                message: response.data.message
            });

            return response.data.paper;
        } catch (err) {
            console.error(`Error toggling ${type}:`, err);
            setError({
                type: 'error',
                message: err.response?.data?.message || `Failed to toggle ${type} submission`
            });
            throw err;
        }
    }, []);

    // Filter papers by status and theme
    const filterPapers = (userPapers) => {
        let filtered = userPapers;

        if (filter !== 'all') {
            filtered = filtered.filter((paper) => paper.status === filter);
        }

        if (themeFilter !== 'all') {
            filtered = filtered.filter((paper) => paper.theme === themeFilter);
        }

        if (modeOfPresentationFilter !== 'all') {
            filtered = filtered.filter((paper) => paper.modeOfPresentation === modeOfPresentationFilter);
        }

        return filtered;
    };

    // Filter papers by search query, status, and theme
    const getFilteredAllPapers = () => {
        return allPapers.filter(
            (paper) =>
                (paperSearchQuery === '' ||
                    paper.title.toLowerCase().includes(paperSearchQuery.toLowerCase()) ||
                    paper.ictacemId
                        .toLowerCase()
                        .includes(paperSearchQuery.toLowerCase()) ||
                    paper.authors.some((author) =>
                        author.name.toLowerCase().includes(paperSearchQuery.toLowerCase())
                    ) ||
                    paper.paymentId
                        .toLowerCase()
                        .includes(paperSearchQuery.toLowerCase())) &&
                (filter === 'all' || paper.status === filter) &&
                (themeFilter === 'all' || paper.theme === themeFilter) &&
                (modeOfPresentationFilter === 'all' || paper.modeOfPresentation === modeOfPresentationFilter)
        );
    };

    return {
        allPapers,
        isLoading,
        error,
        setError,
        reviewText,
        setReviewText,
        activePaper,
        setActivePaper,
        filter,
        setFilter,
        themeFilter,
        setThemeFilter,
        modeOfPresentationFilter,
        setModeOfPresentationFilter,
        paperSearchQuery,
        setPaperSearchQuery,
        fetchAllPapers,
        updatePaperStatus,
        downloadPaper,
        toggleSubmission,
        filterPapers,
        filteredAllPapers: getFilteredAllPapers(),
    };
};