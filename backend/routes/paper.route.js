import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { submitPaper, getUserPapers, getPaperById, downloadPaper, updatePaymentId, viewPaper, submitFullPaper, viewFullPaper, reUploadAbstract, getUserSubmissionsCount } from '../controller/paper.controller.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// Routes
router.post('/submit', protect, upload.single('paperPdf'), submitPaper);
router.get('/user', protect, getUserPapers);
router.get('/user-submissions', protect, getUserSubmissionsCount);
router.get('/download/:id', protect, downloadPaper);
router.get('/view/:id', protect, viewPaper); // New route for viewing PDFs in browser
router.get('/:id', protect, getPaperById);
router.patch('/:id/payment', protect, updatePaymentId);

// Re-upload abstract route (when reset by admin)
router.post('/:id/re-upload-abstract', protect, upload.single('paperPdf'), reUploadAbstract);

// Full paper routes
router.post('/:id/full-paper', protect, upload.single('fullPaperPdf'), submitFullPaper);
router.get('/view-full/:id', protect, viewFullPaper);

export default router;

