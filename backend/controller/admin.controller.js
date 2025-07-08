import User from '../models/user.model.js';
import Paper from '../models/paper.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all users (for admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// Get papers by a specific user (for admin only)
export const getUserPapers = async (req, res) => {
    try {
        const { userId } = req.params;

        const papers = await Paper.find({ user: userId })
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            papers: papers
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching papers',
            error: error.message
        });
    }
};

// Update paper status (approve/reject)
export const updatePaperStatus = async (req, res) => {
    try {
        const { paperId } = req.params;
        const { status, review } = req.body;

        console.log('updatePaperStatus called with:', { paperId, status, review });
        console.log('req.user:', req.user);

        if (!['review_awaited', 'review_in_progress', 'author_response_awaited', 'abstract_accepted', 'declined'].includes(status)) {
            console.log('Invalid status provided:', status);
            return res.status(400).json({ message: 'Invalid status' });
        }

        const paper = await Paper.findById(paperId);
        if (!paper) {
            console.log('Paper not found:', paperId);
            return res.status(404).json({ message: 'Paper not found' });
        }

        console.log('Paper found:', paper.title);

        // Check if user has proper ID
        if (!req.user || !req.user._id) {
            console.error('req.user or req.user._id is missing:', req.user);
            return res.status(401).json({ message: 'User authentication error' });
        }

        // Update the paper status and review directly
        paper.status = status;
        paper.review = review || '';

        // Update admin evaluation with reviewer info if not already set
        if (!paper.adminEvaluation) {
            paper.adminEvaluation = {};
        }
        paper.adminEvaluation.reviewedBy = req.user._id;
        paper.adminEvaluation.reviewedAt = new Date();

        console.log('About to save paper with status:', status);
        console.log('Paper adminEvaluation before save:', paper.adminEvaluation);

        await paper.save();

        console.log('Paper saved successfully');
        res.status(200).json(paper);
    } catch (error) {
        console.error('Error in updatePaperStatus:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        // More detailed error response
        res.status(500).json({
            message: 'Error updating paper status',
            error: error.message,
            errorName: error.name,
            details: process.env.NODE_ENV === 'development' ? error.stack : 'Internal server error'
        });
    }
};

// Get all papers (for admin dashboard)
export const getAllPapers = async (req, res) => {
    try {
        const papers = await Paper.find()
            .populate('user', 'username email customUserId')
            .sort({ submittedAt: -1 });

        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching papers',
            error: error.message
        });
    }
};

// Download any paper (admin access)
export const downloadPaper = async (req, res) => {
    try {
        const { paperId } = req.params;

        const paper = await Paper.findById(paperId);

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        const filePath = paper.pdfPath;

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Set content disposition and content type for proper download
        const filename = paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_' + paper.ictacemId + '.pdf';
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        res.status(500).json({
            message: 'Error downloading paper',
            error: error.message
        });
    }
};

// Get paper count and status statistics for a specific user
export const getUserPaperCount = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get papers for this user
        const papers = await Paper.find({ user: userId });

        // Count papers by status using new status values
        const counts = {
            count: papers.length,
            review_awaited: papers.filter(p => p.status === 'review_awaited').length,
            review_in_progress: papers.filter(p => p.status === 'review_in_progress').length,
            author_response_awaited: papers.filter(p => p.status === 'author_response_awaited').length,
            abstract_accepted: papers.filter(p => p.status === 'abstract_accepted').length,
            declined: papers.filter(p => p.status === 'declined').length
        };

        res.json(counts);
    } catch (error) {
        console.error('Error fetching paper count:', error);
        res.status(500).json({ message: 'Server error fetching paper count' });
    }
};

// Toggle abstract submission (reset to allow re-upload)
export const toggleAbstractSubmission = async (req, res) => {
    try {
        const { paperId } = req.params;
        const { resetAbstract, resetReason } = req.body;

        // Check if user is authenticated and has valid ID
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated or invalid user data'
            });
        }

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({
                success: false,
                message: 'Paper not found'
            });
        }

        if (resetAbstract) {
            // Mark current abstract submission as reset by admin
            if (paper.abstractSubmissionHistory && paper.abstractSubmissionHistory.length > 0) {
                const currentSubmission = paper.abstractSubmissionHistory.find(sub => sub.status === 'current');
                if (currentSubmission) {
                    currentSubmission.status = 'reset_by_admin';
                    currentSubmission.resetBy = req.user._id;
                    currentSubmission.resetAt = new Date();
                    currentSubmission.resetReason = resetReason || 'Reset by admin';
                }
            }

            // Instead of deleting the file, we'll just move it to preserve history
            // The file will remain accessible for historical viewing
            if (paper.pdfPath && fs.existsSync(paper.pdfPath)) {
                console.log('Preserving historical file:', paper.pdfPath);
                // Don't delete the file - keep it for historical access
                // The historical record in abstractSubmissionHistory will still point to it
            }

            // Reset paper fields to allow re-upload
            paper.pdfPath = null;
            paper.status = 'author_response_awaited';
            paper.review = '';
            paper.submittedAt = null;
        }

        await paper.save();

        res.status(200).json({
            success: true,
            message: resetAbstract ? 'Abstract submission reset successfully' : 'Abstract submission restored',
            paper
        });
    } catch (error) {
        console.error('Error in toggleAbstractSubmission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle abstract submission',
            error: error.message
        });
    }
};

// Toggle full paper submission (reset to allow re-upload)
export const toggleFullPaperSubmission = async (req, res) => {
    try {
        const { paperId } = req.params;
        const { resetFullPaper, resetReason } = req.body;

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        if (resetFullPaper) {
            // Mark current full paper submission as reset by admin
            if (paper.fullPaperSubmissionHistory && paper.fullPaperSubmissionHistory.length > 0) {
                const currentSubmission = paper.fullPaperSubmissionHistory.find(sub => sub.status === 'current');
                if (currentSubmission) {
                    currentSubmission.status = 'reset_by_admin';
                    currentSubmission.resetBy = req.user._id;
                    currentSubmission.resetAt = new Date();
                    currentSubmission.resetReason = resetReason || 'Reset by admin';
                }
            }

            // Instead of deleting the file, preserve it for historical access
            if (paper.fullPaperPdfPath && fs.existsSync(paper.fullPaperPdfPath)) {
                console.log('Preserving historical full paper file:', paper.fullPaperPdfPath);
                // Don't delete the file - keep it for historical access
            }

            // Reset full paper fields and set status to author response awaited
            paper.fullPaperPdfPath = null;
            paper.fullPaperSubmittedAt = null;
            paper.status = 'author_response_awaited';
        }

        await paper.save();

        res.status(200).json({
            success: true,
            message: resetFullPaper ? 'Full paper submission reset successfully' : 'Full paper submission restored',
            paper
        });
    } catch (error) {
        console.error('Error toggling full paper submission:', error);
        res.status(500).json({
            message: 'Error toggling full paper submission',
            error: error.message
        });
    }
};

// Update paper marks and confidential comments (admin only)
export const updatePaperEvaluation = async (req, res) => {
    try {
        const { paperId } = req.params;
        const { marks, confidentialComments } = req.body;

        // Validate marks if provided
        if (marks !== undefined && marks !== null && (marks < 0 || marks > 100)) {
            return res.status(400).json({ message: 'Marks must be between 0 and 100' });
        }

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Initialize adminEvaluation if it doesn't exist
        if (!paper.adminEvaluation) {
            paper.adminEvaluation = {};
        }

        // Update evaluation fields
        if (marks !== undefined) {
            paper.adminEvaluation.marks = marks;
        }

        if (confidentialComments !== undefined) {
            paper.adminEvaluation.confidentialComments = confidentialComments;
        }

        // Set reviewer information
        paper.adminEvaluation.reviewedBy = req.user._id;
        paper.adminEvaluation.reviewedAt = new Date();

        await paper.save();

        // Populate reviewer info for response
        await paper.populate('adminEvaluation.reviewedBy', 'username email');

        res.status(200).json({
            success: true,
            message: 'Paper evaluation updated successfully',
            paper
        });
    } catch (error) {
        console.error('Error updating paper evaluation:', error);
        res.status(500).json({
            message: 'Error updating paper evaluation',
            error: error.message
        });
    }
};

// Get paper evaluation details (admin only)
export const getPaperEvaluation = async (req, res) => {
    try {
        const { paperId } = req.params;

        const paper = await Paper.findById(paperId)
            .populate('adminEvaluation.reviewedBy', 'username email');

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        res.status(200).json({
            success: true,
            evaluation: paper.adminEvaluation || {
                marks: null,
                confidentialComments: '',
                reviewedBy: null,
                reviewedAt: null
            }
        });
    } catch (error) {
        console.error('Error getting paper evaluation:', error);
        res.status(500).json({
            message: 'Error getting paper evaluation',
            error: error.message
        });
    }
};

// Get detailed paper information with user data (admin only)
export const getPaperDetails = async (req, res) => {
    try {
        const { paperId } = req.params;

        const paper = await Paper.findById(paperId)
            .populate('user', 'username email customUserId createdAt')
            .populate('adminEvaluation.reviewedBy', 'username email');

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        res.status(200).json({
            success: true,
            paper: paper,
            user: paper.user
        });
    } catch (error) {
        console.error('Error getting paper details:', error);
        res.status(500).json({
            message: 'Error getting paper details',
            error: error.message
        });
    }
};

// Get user details with papers (admin only)
export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Error getting user details:', error);
        res.status(500).json({
            message: 'Error getting user details',
            error: error.message
        });
    }
};

// Get submission history for a paper (admin only)
export const getPaperSubmissionHistory = async (req, res) => {
    try {
        const { paperId } = req.params;

        const paper = await Paper.findById(paperId)
            .populate('user', 'username email customUserId')
            .populate('abstractSubmissionHistory.adminId', 'username email')
            .populate('fullPaperSubmissionHistory.adminId', 'username email');

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        res.status(200).json({
            success: true,
            paper: {
                id: paper._id,
                title: paper.title,
                ictacemId: paper.ictacemId,
                user: paper.user,
                abstractSubmissionHistory: paper.abstractSubmissionHistory || [],
                fullPaperSubmissionHistory: paper.fullPaperSubmissionHistory || []
            }
        });
    } catch (error) {
        console.error('Error getting paper submission history:', error);
        res.status(500).json({
            message: 'Error getting paper submission history',
            error: error.message
        });
    }
};

// Download historical submission (admin only)
export const downloadHistoricalSubmission = async (req, res) => {
    try {
        const { paperId, submissionId, type } = req.params;

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        let submission;
        if (type === 'abstract') {
            submission = paper.abstractSubmissionHistory.id(submissionId);
        } else if (type === 'fullpaper') {
            submission = paper.fullPaperSubmissionHistory.id(submissionId);
        } else {
            return res.status(400).json({ message: 'Invalid submission type' });
        }

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Get the file path and try multiple possible locations
        const storedFilePath = submission.filePath;
        const baseFilename = path.basename(storedFilePath);

        // Try different path combinations
        const possiblePaths = [
            // Direct path as stored
            path.join(__dirname, '..', storedFilePath),
            // Just filename in uploads directory
            path.join(__dirname, '..', 'uploads', baseFilename),
            // Remove uploads prefix and add it back
            path.join(__dirname, '..', 'uploads', storedFilePath.replace(/^uploads\//, '')),
            // Absolute path if stored as such
            storedFilePath
        ];

        let foundPath = null;
        for (const pathToCheck of possiblePaths) {
            console.log('Checking historical submission path for download:', pathToCheck);
            if (fs.existsSync(pathToCheck)) {
                foundPath = pathToCheck;
                console.log('Found historical submission for download at:', foundPath);
                break;
            }
        }

        if (!foundPath) {
            console.error('Historical submission file not found for download. Tried paths:', possiblePaths);
            return res.status(404).json({ message: 'File not found on server' });
        }

        // Set headers for download
        const downloadFilename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}_v${submission.version}_${type}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);

        // Stream the file
        const fileStream = fs.createReadStream(foundPath);
        fileStream.on('error', (error) => {
            console.error('Error streaming historical submission:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error streaming file' });
            }
        });

        fileStream.pipe(res);
    } catch (error) {
        console.error('Error downloading historical submission:', error);
        res.status(500).json({
            message: 'Error downloading historical submission',
            error: error.message
        });
    }
};

// View historical submission in browser (admin only)
export const viewHistoricalSubmission = async (req, res) => {
    try {
        const { paperId, submissionId, type } = req.params;

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        let submission;
        if (type === 'abstract') {
            submission = paper.abstractSubmissionHistory.id(submissionId);
        } else if (type === 'fullpaper') {
            submission = paper.fullPaperSubmissionHistory.id(submissionId);
        } else {
            return res.status(400).json({ message: 'Invalid submission type' });
        }

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Special handling for reset submissions - try to find the current PDF
        if (submission.status === 'reset_by_admin') {
            console.log('Handling reset submission, trying to find current PDF...');

            // For reset submissions, try to use the current PDF path if available
            if (paper.pdfPath && fs.existsSync(path.join(__dirname, '..', paper.pdfPath))) {
                const currentPdfPath = path.join(__dirname, '..', paper.pdfPath);
                console.log('Using current PDF for reset submission:', currentPdfPath);

                const safeFilename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}_v${submission.version}_${type}.pdf`;
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

                const fileStream = fs.createReadStream(currentPdfPath);
                fileStream.on('error', (error) => {
                    console.error('Error streaming current PDF for reset submission:', error);
                    if (!res.headersSent) {
                        res.status(500).json({ message: 'Error streaming file' });
                    }
                });

                fileStream.pipe(res);
                return;
            }
        }

        // Get the file path and try multiple possible locations
        const storedFilePath = submission.filePath;
        const filename = path.basename(storedFilePath);
        const uploadsDir = path.join(__dirname, '..', 'uploads');

        // Try different path combinations
        const possiblePaths = [
            // Direct path as stored
            path.join(__dirname, '..', storedFilePath),
            // Just filename in uploads directory
            path.join(uploadsDir, filename),
            // Remove uploads prefix and add it back
            path.join(uploadsDir, storedFilePath.replace(/^uploads\//, '')),
            // Absolute path if stored as such
            storedFilePath
        ];

        let foundPath = null;
        for (const pathToCheck of possiblePaths) {
            console.log('Checking historical submission path:', pathToCheck);
            if (fs.existsSync(pathToCheck)) {
                foundPath = pathToCheck;
                console.log('Found historical submission at:', foundPath);
                break;
            }
        }

        // If exact file not found, try to find a similar file by timestamp or use current PDF
        if (!foundPath) {
            console.log('Exact file not found, trying alternative approaches...');

            // First, try using the current PDF if this is an older version
            if (paper.pdfPath && fs.existsSync(path.join(__dirname, '..', paper.pdfPath))) {
                foundPath = path.join(__dirname, '..', paper.pdfPath);
                console.log('Using current PDF as fallback:', foundPath);
            } else {
                // Try to find a similar file by timestamp
                try {
                    const files = fs.readdirSync(uploadsDir);
                    const targetFilename = filename.replace(/^paper-/, '').replace(/\.pdf$/, '');
                    const targetTimestamp = targetFilename.split('-')[0];

                    // Look for files with similar timestamps (within 2 hours = 7200000ms)
                    const similarFiles = files.filter(file => {
                        if (!file.startsWith('paper-') || !file.endsWith('.pdf')) return false;
                        const fileTimestamp = file.replace(/^paper-/, '').split('-')[0];
                        const timeDiff = Math.abs(parseInt(targetTimestamp) - parseInt(fileTimestamp));
                        return timeDiff < 7200000; // Within 2 hours
                    });

                    if (similarFiles.length > 0) {
                        // Use the closest match
                        const closestFile = similarFiles.sort((a, b) => {
                            const aTimestamp = a.replace(/^paper-/, '').split('-')[0];
                            const bTimestamp = b.replace(/^paper-/, '').split('-')[0];
                            const aDiff = Math.abs(parseInt(targetTimestamp) - parseInt(aTimestamp));
                            const bDiff = Math.abs(parseInt(targetTimestamp) - parseInt(bTimestamp));
                            return aDiff - bDiff;
                        })[0];

                        foundPath = path.join(uploadsDir, closestFile);
                        console.log('Found similar file:', foundPath);
                    }
                } catch (dirError) {
                    console.error('Error reading uploads directory:', dirError);
                }
            }
        }

        if (!foundPath) {
            console.error('Historical submission file not found. Tried paths:', possiblePaths);
            return res.status(404).json({
                message: 'File not found on server',
                details: 'This file may have been deleted during an admin reset. The submission history is preserved but the original file is no longer available.'
            });
        }

        // Set headers for inline viewing
        const safeFilename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}_v${submission.version}_${type}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

        // Stream the file
        const fileStream = fs.createReadStream(foundPath);
        fileStream.on('error', (error) => {
            console.error('Error streaming historical submission:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error streaming file' });
            }
        });

        fileStream.pipe(res);
    } catch (error) {
        console.error('Error viewing historical submission:', error);
        res.status(500).json({
            message: 'Error viewing historical submission',
            error: error.message
        });
    }
};

// Upload admin file for a paper (admin only)
export const uploadAdminFile = async (req, res) => {
    try {
        console.log('=== New Admin File Upload ===');
        console.log('Request received:', {
            method: req.method,
            url: req.url,
            paperId: req.params.paperId,
            file: req.file ? {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                path: req.file.path
            } : 'No file',
            body: req.body,
            user: req.user ? {
                id: req.user._id,
                role: req.user.role,
                username: req.user.username
            } : 'No user'
        });

        const { paperId } = req.params;
        const { description, fileType, visibleToUser } = req.body;

        console.log('Extracted params:', { paperId, description, fileType, visibleToUser });

        // Basic validation
        if (!paperId) {
            console.log('❌ Paper ID validation failed');
            return res.status(400).json({
                success: false,
                message: 'Paper ID is required'
            });
        }

        if (!req.file) {
            console.log('❌ File validation failed');
            return res.status(400).json({
                success: false,
                message: 'File is required'
            });
        }

        // Check if user is authenticated and has valid ID
        if (!req.user || !req.user._id) {
            console.error('❌ User authentication error:', req.user);
            return res.status(401).json({
                success: false,
                message: 'User not authenticated or invalid user data'
            });
        }

        // Check if user is admin
        if (req.user.role !== 'admin') {
            console.log('❌ Admin role validation failed, user role:', req.user.role);
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        console.log('✅ All validations passed');

        // Find the paper
        console.log('🔍 Finding paper with ID:', paperId);
        const paper = await Paper.findById(paperId);
        if (!paper) {
            console.log('❌ Paper not found');
            return res.status(404).json({
                success: false,
                message: 'Paper not found'
            });
        }

        console.log('✅ Paper found:', paper.title);

        // Create file entry
        const newFile = {
            filePath: req.file.path,
            fileName: req.file.originalname,
            uploadedBy: req.user._id,
            description: description || '',
            fileType: fileType || 'review_comment_file',
            visibleToUser: visibleToUser === 'true',
            uploadedAt: new Date()
        };

        console.log('📄 Creating file entry:', newFile);

        // Initialize array if needed
        if (!paper.adminUploadedFiles) {
            paper.adminUploadedFiles = [];
            console.log('🔧 Initialized adminUploadedFiles array');
        }

        paper.adminUploadedFiles.push(newFile);
        console.log('📥 Added file to paper, total files:', paper.adminUploadedFiles.length);

        console.log('💾 Saving paper to database...');
        await paper.save();

        console.log('✅ File uploaded successfully:', newFile.fileName);

        // Populate the paper with user info for complete response
        await paper.populate('user', 'username email customUserId createdAt');
        await paper.populate('adminEvaluation.reviewedBy', 'username email');

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            file: newFile,
            paper: paper // Include the full updated paper
        });

    } catch (error) {
        console.error('=== Admin File Upload Error ===');
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
        console.error('Error stack:', error.stack);
        console.error('Request details:', {
            method: req.method,
            url: req.url,
            paperId: req.params.paperId,
            hasFile: !!req.file,
            hasUser: !!req.user,
            userRole: req.user?.role,
            body: req.body
        });

        // Check if it's a validation error
        if (error.name === 'ValidationError') {
            console.error('🚨 Mongoose Validation Error:', error.errors);
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors,
                details: process.env.NODE_ENV === 'development' ? error.errors : undefined
            });
        }

        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// View admin uploaded file (admin and users)
export const viewAdminUploadedFile = async (req, res) => {
    try {
        const { paperId, fileId } = req.params;

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Find the specific admin uploaded file
        const adminFile = paper.adminUploadedFiles.id(fileId);
        if (!adminFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check authorization
        const isAdmin = req.user.role === 'admin';
        const isOwner = paper.user.toString() === req.user._id.toString();

        // If user is not admin, check if they own the paper and file is visible to user
        if (!isAdmin && (!isOwner || !adminFile.visibleToUser)) {
            return res.status(403).json({ message: 'Not authorized to view this file' });
        }

        // Get the file path and try multiple possible locations
        const storedFilePath = adminFile.filePath;
        const filename = path.basename(storedFilePath);
        const uploadsDir = path.join(__dirname, '..', 'uploads');

        // Try different path combinations
        const possiblePaths = [
            path.join(__dirname, '..', storedFilePath),
            path.join(uploadsDir, filename),
            path.join(uploadsDir, storedFilePath.replace(/^uploads\//, '')),
            storedFilePath
        ];

        let foundPath = null;
        for (const pathToCheck of possiblePaths) {
            if (fs.existsSync(pathToCheck)) {
                foundPath = pathToCheck;
                break;
            }
        }

        if (!foundPath) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        // Set headers for inline viewing
        const safeFilename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}_admin_${adminFile.fileType}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

        // Stream the file
        const fileStream = fs.createReadStream(foundPath);
        fileStream.on('error', (error) => {
            console.error('Error streaming admin uploaded file:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error streaming file' });
            }
        });

        fileStream.pipe(res);
    } catch (error) {
        console.error('Error viewing admin uploaded file:', error);
        res.status(500).json({
            message: 'Error viewing file',
            error: error.message
        });
    }
};

// Delete admin uploaded file (admin only)
export const deleteAdminUploadedFile = async (req, res) => {
    try {
        const { paperId, fileId } = req.params;

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Find and remove the admin uploaded file
        const adminFile = paper.adminUploadedFiles.id(fileId);
        if (!adminFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete the physical file
        const filePath = path.join(__dirname, '..', adminFile.filePath);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (fileError) {
                console.error('Error deleting physical file:', fileError);
            }
        }

        // Remove from database
        paper.adminUploadedFiles.pull(fileId);
        await paper.save();

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting admin uploaded file:', error);
        res.status(500).json({
            message: 'Error deleting file',
            error: error.message
        });
    }
};