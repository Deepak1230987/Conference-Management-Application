import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { adminUpload } from '../middleware/multer.js';
import {
    getAllUsers,
    getUserPapers,
    updatePaperStatus,
    getAllPapers,
    downloadPaper,
    getUserPaperCount,
    toggleAbstractSubmission,
    toggleFullPaperSubmission,
    updatePaperEvaluation,
    getPaperEvaluation,
    getPaperDetails,
    getUserDetails,
    getPaperSubmissionHistory,
    downloadHistoricalSubmission,
    viewHistoricalSubmission,
    uploadAdminFile,
    viewAdminUploadedFile,
    deleteAdminUploadedFile
} from '../controller/admin.controller.js';

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// Protect all admin routes with authentication
router.use(protect);

// Admin routes (with admin check)
router.get('/users', adminOnly, getAllUsers);
router.get('/users/:userId', adminOnly, getUserDetails);
router.get('/users/:userId/papers', adminOnly, getUserPapers);
router.get('/users/:userId/papers/count', adminOnly, getUserPaperCount);
router.get('/papers', adminOnly, getAllPapers);
router.get('/papers/:paperId', adminOnly, getPaperDetails);
router.put('/papers/:paperId/status', adminOnly, updatePaperStatus);
router.get('/papers/download/:paperId', adminOnly, downloadPaper);
router.put('/papers/:paperId/toggle-abstract', adminOnly, toggleAbstractSubmission);
router.put('/papers/:paperId/toggle-fullpaper', adminOnly, toggleFullPaperSubmission);
router.put('/papers/:paperId/evaluate', adminOnly, updatePaperEvaluation);
router.get('/papers/:paperId/evaluation', adminOnly, getPaperEvaluation);
router.get('/papers/:paperId/history', adminOnly, getPaperSubmissionHistory);
router.get('/papers/:paperId/history/:type/:submissionId/download', adminOnly, downloadHistoricalSubmission);
router.get('/papers/:paperId/history/:type/:submissionId/view', adminOnly, viewHistoricalSubmission);

// Admin file upload routes
router.post('/papers/:paperId/upload-file', adminOnly, adminUpload.single('adminFile'), uploadAdminFile);

// View admin uploaded file (users can view if visible to them)
router.get('/papers/:paperId/admin-files/:fileId/view', viewAdminUploadedFile);

// Delete admin uploaded file (admin only)
router.delete('/papers/:paperId/admin-files/:fileId', adminOnly, deleteAdminUploadedFile);

export default router;
