import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all sponsor logos
export const getSponsors = async (req, res) => {
    try {
        const sponsorsDir = path.join(__dirname, '..', 'public', 'sponsors');

        // Check if sponsors directory exists
        if (!fs.existsSync(sponsorsDir)) {
            return res.json({ sponsors: [] });
        }

        // Read all files in sponsors directory
        const files = fs.readdirSync(sponsorsDir);

        // Filter for image files only
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const sponsorImages = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });

        // Create sponsor objects with image URLs
        const sponsors = sponsorImages.map((filename, index) => ({
            id: index + 1,
            filename: filename,
            url: `/ictacem2025/api/sponsors/image/${filename}`,
            name: `Sponsor ${index + 1}`
        }));

        // Shuffle array randomly
        const shuffledSponsors = sponsors.sort(() => Math.random() - 0.5);

        res.json({
            success: true,
            count: shuffledSponsors.length,
            sponsors: shuffledSponsors
        });

    } catch (error) {
        console.error('Error fetching sponsors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sponsors',
            error: error.message
        });
    }
};

// Serve sponsor image
export const getSponsorImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const imagePath = path.join(__dirname, '..', 'public', 'sponsors', filename);

        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({
                success: false,
                message: 'Sponsor image not found'
            });
        }

        // Set appropriate content type based on file extension
        const ext = path.extname(filename).toLowerCase();
        const contentTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        };

        const contentType = contentTypes[ext] || 'image/jpeg';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

        // Send the image file
        res.sendFile(imagePath);

    } catch (error) {
        console.error('Error serving sponsor image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to serve sponsor image',
            error: error.message
        });
    }
};

// Get sponsors for home page (limited and randomized)
export const getHomeSponsors = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4; // Default to 4 sponsors for bigger display

        const sponsorsDir = path.join(__dirname, '..', 'public', 'sponsors');

        if (!fs.existsSync(sponsorsDir)) {
            return res.json({ sponsors: [] });
        }

        const files = fs.readdirSync(sponsorsDir);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const sponsorImages = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });

        // Shuffle and limit
        const shuffled = sponsorImages.sort(() => Math.random() - 0.5);
        const limited = shuffled.slice(0, limit);

        const sponsors = limited.map((filename, index) => ({
            id: index + 1,
            filename: filename,
            url: `/ictacem2025/api/sponsors/image/${filename}`,
            name: `Sponsor ${index + 1}`
        }));

        res.json({
            success: true,
            count: sponsors.length,
            totalAvailable: sponsorImages.length,
            sponsors: sponsors
        });

    } catch (error) {
        console.error('Error fetching home sponsors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch home sponsors',
            error: error.message
        });
    }
};
