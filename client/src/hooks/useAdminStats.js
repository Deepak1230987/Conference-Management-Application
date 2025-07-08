import { useState, useCallback, useMemo } from 'react';

/**
 * Hook for managing admin dashboard statistics
 * @param {Array} allPapers - Array of all papers
 * @param {Number} userCount - Number of users
 * @returns {Object} Stats data and utility functions
 */
export const useAdminStats = (allPapers = [], userCount = 0) => {
    const [stats, setStats] = useState({
        totalUsers: userCount,
        totalPapers: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        themeStats: {},
    });

    // List of available themes
    const themes = useMemo(
        () => [
            "Fluid Mechanics",
            "Solid Mechanics and Dynamics",
            "Flight Mechanics, Control and Navigation",
            "Propulsion and Combustion",
        ],
        []
    );

    // Calculate statistics
    const calculateStats = useCallback(() => {
        if (!allPapers.length) {
            setStats(prevStats => ({
                ...prevStats,
                totalUsers: userCount,
                totalPapers: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                themeStats: {},
            }));
            return;
        }

        let paperCount = allPapers.length;
        let pendingCount = allPapers.filter(
            (paper) => paper.status === "pending"
        ).length;
        let approvedCount = allPapers.filter(
            (paper) => paper.status === "approved"
        ).length;
        let rejectedCount = allPapers.filter(
            (paper) => paper.status === "rejected"
        ).length;

        // Calculate theme statistics
        const themeStats = {};
        themes.forEach((theme) => {
            themeStats[theme] = allPapers.filter(
                (paper) => paper.theme === theme
            ).length;
        });

        setStats({
            totalUsers: userCount,
            totalPapers: paperCount,
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
            themeStats: themeStats,
        });
    }, [allPapers, themes, userCount]);

    // Calculate statistics from papers data
    const calculateNewStats = useCallback(() => {
        if (!allPapers || allPapers.length === 0) {
            setStats(prevStats => ({
                ...prevStats,
                totalUsers: userCount,
                total: 0,
                review_awaited: 0,
                review_in_progress: 0,
                author_response_awaited: 0,
                abstract_accepted: 0,
                declined: 0,
                fullPaperSubmitted: 0,
                abstractOnlySubmitted: 0,
                paymentCompleted: 0,
                pendingPayment: 0,
                evaluatedPapers: 0,
                pendingEvaluation: 0,
                presentationModes: {},
                themeDistribution: {}
            }));
            return;
        }

        // Calculate theme distribution
        const themeDistribution = {};
        themes.forEach((theme) => {
            themeDistribution[theme] = allPapers.filter(
                (paper) => paper.theme === theme
            ).length;
        });

        // Calculate presentation mode distribution
        const presentationModes = {
            'Oral': allPapers.filter(p => p.modeOfPresentation === 'Oral').length,
            'Poster (Only for Students)': allPapers.filter(p => p.modeOfPresentation === 'Poster (Only for Students)').length,
            'Video (Only for Students)': allPapers.filter(p => p.modeOfPresentation === 'Video (Only for Students)').length
        };

        const newStats = {
            totalUsers: userCount,
            total: allPapers.length,
            review_awaited: allPapers.filter(p => p.status === 'review_awaited').length,
            review_in_progress: allPapers.filter(p => p.status === 'review_in_progress').length,
            author_response_awaited: allPapers.filter(p => p.status === 'author_response_awaited').length,
            abstract_accepted: allPapers.filter(p => p.status === 'abstract_accepted').length,
            declined: allPapers.filter(p => p.status === 'declined').length,
            // Additional metrics
            fullPaperSubmitted: allPapers.filter(p => p.fullPaperPdfPath && p.fullPaperPdfPath.trim() !== '').length,
            abstractOnlySubmitted: allPapers.filter(p => (!p.fullPaperPdfPath || p.fullPaperPdfPath.trim() === '') && p.pdfPath).length,
            paymentCompleted: allPapers.filter(p => p.paymentId && p.paymentId.trim() !== '').length,
            pendingPayment: allPapers.filter(p => !p.paymentId || p.paymentId.trim() === '').length,
            evaluatedPapers: allPapers.filter(p => p.adminEvaluation?.marks !== null && p.adminEvaluation?.marks !== undefined).length,
            pendingEvaluation: allPapers.filter(p => p.adminEvaluation?.marks === null || p.adminEvaluation?.marks === undefined).length,
            presentationModes,
            themeDistribution
        };

        setStats(newStats);
    }, [allPapers, userCount, themes]);

    // Get theme distribution data for visualizations
    const getThemeDistribution = useCallback(() => {
        const themeDistribution = {};
        themes.forEach((theme) => {
            themeDistribution[theme] = allPapers.filter(
                (paper) => paper.theme === theme
            ).length;
        });
        return themeDistribution;
    }, [allPapers, themes]);

    // Get recent submissions
    const getRecentSubmissions = useCallback(() => {
        return [...allPapers]
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
            .slice(0, 5);
    }, [allPapers]);

    return {
        stats,
        themes,
        calculateStats,
        calculateNewStats,
        themeDistribution: getThemeDistribution(),
        recentSubmissions: getRecentSubmissions(),
    };
};