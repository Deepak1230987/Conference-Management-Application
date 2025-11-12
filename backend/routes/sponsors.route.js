import express from 'express';
import {
    getSponsors,
    getSponsorImage,
    getHomeSponsors
} from '../controller/sponsors.controller.js';

const router = express.Router();

// Get all sponsors (for admin/full sponsors page)
router.get('/', getSponsors);

// Get limited sponsors for home page (randomized)
router.get('/home', getHomeSponsors);

// Serve sponsor image files
router.get('/image/:filename', getSponsorImage);

export default router;
