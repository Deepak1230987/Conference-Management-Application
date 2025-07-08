import Paper from '../models/paper.model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Submit a new paper
export const submitPaper = async (req, res) => {
    try {
        console.log('Paper submission attempt received');
        console.log('Request body:', req.body);
        console.log('File:', req.file);

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        const { title, authors, theme, ictacemId, modeOfPresentation } = req.body;

        // Debug logging
        console.log('Paper submission - Required fields present:', {
            title: !!title,
            authors: !!authors,
            theme: !!theme,
            ictacemId: !!ictacemId,
            modeOfPresentation: !!modeOfPresentation
        });

        // Validate required fields
        if (!title || !theme || !ictacemId || !authors || !modeOfPresentation) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Save the PDF file path - ensure it's relative to make it easier to serve later
        const relativePath = req.file.path.replace(/^.*[\\\/]uploads[\\\/]/, '');
        const pdfPath = path.join('uploads', relativePath);

        console.log('Storing PDF path as:', pdfPath);

        // Parse authors safely
        let parsedAuthors;
        try {
            parsedAuthors = typeof authors === 'string' ? JSON.parse(authors) : authors;
        } catch (error) {
            console.error('Error parsing authors:', error);
            return res.status(400).json({ message: 'Invalid authors data format' });
        }

        // Create the paper in the database with submission history
        const paperData = {
            user: req.user._id,
            title,
            authors: parsedAuthors,
            pdfPath,
            ictacemId,
            theme,
            modeOfPresentation,
            abstractSubmissionHistory: [{
                filePath: pdfPath,
                fileName: req.file.originalname,
                submittedAt: new Date(),
                status: 'current',
                version: 1
            }]
        };

        console.log('Creating paper with data:', {
            ...paperData,
            abstractSubmissionHistory: 'Array with 1 item'
        });

        const paper = await Paper.create(paperData);

        console.log('Paper created successfully with ID:', paper._id);
        console.log('Saved modeOfPresentation:', paper.modeOfPresentation);

        res.status(201).json({
            success: true,
            paper: {
                id: paper._id,
                title: paper.title,
                ictacemId: paper.ictacemId,
                status: paper.status,
                submittedAt: paper.submittedAt
            }
        });
    } catch (error) {
        console.error('Paper submission error:', error);
        // If it's a validation error from Mongoose
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (const field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return res.status(400).json({
                message: 'Validation error',
                errors: validationErrors
            });
        }

        res.status(500).json({
            message: 'Server error during paper submission',
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
        });
    }
};

// Get all papers for the logged in user
export const getUserPapers = async (req, res) => {
    try {
        const papers = await Paper.find({ user: req.user._id })
            .sort({ submittedAt: -1 });

        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get paper details by ID
export const getPaperById = async (req, res) => {
    try {
        let paper;

        // Check if user is admin
        const isAdmin = req.user.role === 'admin';

        if (isAdmin) {
            // Admin can access any paper
            paper = await Paper.findById(req.params.id);
        } else {
            // Regular users can only access their own papers
            paper = await Paper.findOne({
                _id: req.params.id,
                user: req.user._id
            });
        }

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        res.status(200).json({ paper });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Download paper PDF
export const downloadPaper = async (req, res) => {
    try {
        const paperId = req.params.id;

        // Validate paper ID
        if (!paperId) {
            return res.status(400).json({ message: 'Paper ID is required' });
        }

        // Find paper by ID
        const paper = await Paper.findById(paperId);

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Check if user is authorized to download this paper
        const isOwner = paper.user.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to download this paper' });
        }

        console.log('Paper PDF path from database:', paper.pdfPath);

        // Get path to the PDF file - trying multiple possible locations
        let pdfPath = paper.pdfPath;
        let filePaths = [
            // Direct path as stored in DB
            pdfPath,
            // Resolve relative to project root
            path.join(__dirname, '..', pdfPath),
            // Remove any leading slash and resolve relative to uploads dir
            path.join(__dirname, '..', 'uploads', pdfPath.replace(/^\/uploads\//, '')),
            // Uploads dir without additional path
            path.join(__dirname, '..', 'uploads', path.basename(pdfPath)),
        ];

        // Try all possible paths
        let foundPath = null;
        for (const pathToCheck of filePaths) {
            console.log('Checking path:', pathToCheck);
            if (fs.existsSync(pathToCheck)) {
                foundPath = pathToCheck;
                console.log('Found PDF at path:', foundPath);
                break;
            }
        }

        if (!foundPath) {
            console.error('PDF file not found at any tried paths');
            return res.status(404).json({ message: 'PDF file not found on server' });
        }

        // Set headers for file download
        const filename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Stream the file to the response
        const fileStream = fs.createReadStream(foundPath);
        fileStream.on('error', (error) => {
            console.error('Error streaming PDF:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error streaming PDF file' });
            }
        });

        fileStream.pipe(res);
    } catch (error) {
        console.error('Error downloading paper:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// View paper PDF in browser
export const viewPaper = async (req, res) => {
    try {
        const paperId = req.params.id;

        if (!paperId) {
            return res.status(400).json({ message: 'Paper ID is required' });
        }

        // Find paper by ID
        const paper = await Paper.findById(paperId);

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Check if paper has a PDF path
        if (!paper.pdfPath) {
            return res.status(404).json({
                message: 'Abstract PDF not available. This paper may have been reset by an administrator.'
            });
        }

        // Check if user is authorized to view this paper
        const isOwner = paper.user.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this paper' });
        }

        console.log('Paper PDF path from database:', paper.pdfPath);

        // Get path to the PDF file - trying multiple possible locations
        let pdfPath = paper.pdfPath;
        let filePaths = [
            // Direct path as stored in DB
            path.resolve(pdfPath),
            // Resolve relative to project root
            path.join(__dirname, '..', pdfPath),
            // Remove any leading slash and resolve relative to uploads dir
            path.join(__dirname, '..', 'uploads', pdfPath.replace(/^\/uploads\//, '')),
            // Uploads dir with just the filename
            path.join(__dirname, '..', 'uploads', path.basename(pdfPath)),
        ];

        // Try all possible paths
        let foundPath = null;
        for (const pathToCheck of filePaths) {
            console.log('Checking path:', pathToCheck);
            if (fs.existsSync(pathToCheck)) {
                foundPath = pathToCheck;
                console.log('Found PDF at path:', foundPath);
                break;
            }
        }

        if (!foundPath) {
            console.error('PDF file not found at any tried paths for paper:', paperId);
            return res.status(404).json({
                message: 'PDF file not found on server. The file may have been moved or deleted.'
            });
        }

        // Set headers for inline viewing
        const safeFilename = paper.title.replace(/[^a-zA-Z0-9\s]/g, '_') + '.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
        res.setHeader('Cache-Control', 'no-cache');

        // Stream the file directly
        const fileStream = fs.createReadStream(foundPath);
        fileStream.on('error', (error) => {
            console.error('Error streaming PDF:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error streaming PDF file' });
            }
        });

        fileStream.pipe(res);
    } catch (error) {
        console.error('Error viewing paper:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update paper payment ID
export const updatePaymentId = async (req, res) => {
    try {
        const { paymentId } = req.body;

        if (!paymentId) {
            return res.status(400).json({ message: 'Payment ID is required' });
        }

        const paper = await Paper.findById(req.params.id);

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Check if user is authorized to update this paper
        if (paper.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this paper' });
        }

        // Check if paper is approved (only approved papers should have payment)
        if (paper.status !== 'abstract_accepted') {
            return res.status(400).json({ message: 'Only approved papers can have payment information updated' });
        }

        // Update the payment ID
        paper.paymentId = paymentId;
        await paper.save();

        res.status(200).json({
            success: true,
            message: 'Payment ID updated successfully',
            paper: paper
        });
    } catch (error) {
        console.error('Error updating payment ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Submit full-length paper
export const submitFullPaper = async (req, res) => {
    try {
        const paperId = req.params.id;

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: 'Full-length paper PDF file is required' });
        }

        // Find paper by ID
        const paper = await Paper.findById(paperId);

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Check if user is authorized to submit full paper
        if (paper.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to submit full paper for this abstract' });
        }

        // Check if paper is approved and payment is completed
        if (paper.status !== 'abstract_accepted') {
            return res.status(400).json({ message: 'Only approved papers can have full-length submissions' });
        }

        if (!paper.paymentId || paper.paymentId === '') {
            return res.status(400).json({ message: 'Payment must be completed before submitting full paper' });
        }

        // Save the full paper PDF file path
        const relativePath = req.file.path.replace(/^.*[\\\/]uploads[\\\/]/, '');
        const fullPaperPdfPath = path.join('uploads', relativePath);

        console.log('Storing full paper PDF path as:', fullPaperPdfPath);

        // Calculate next version number for full paper
        const nextVersion = paper.fullPaperSubmissionHistory.length + 1;

        // Mark previous full paper submission as superseded if exists
        if (paper.fullPaperSubmissionHistory.length > 0) {
            paper.fullPaperSubmissionHistory.forEach(submission => {
                if (submission.status === 'current') {
                    submission.status = 'superseded';
                }
            });
        }

        // Add new full paper submission to history
        paper.fullPaperSubmissionHistory.push({
            filePath: fullPaperPdfPath,
            fileName: req.file.originalname,
            submittedAt: new Date(),
            status: 'current',
            version: nextVersion
        });

        // Update the paper with full paper details
        paper.fullPaperPdfPath = fullPaperPdfPath;
        paper.fullPaperSubmittedAt = Date.now();
        await paper.save();

        res.status(200).json({
            success: true,
            message: 'Full-length paper submitted successfully',
            paper: {
                id: paper._id,
                title: paper.title,
                fullPaperSubmittedAt: paper.fullPaperSubmittedAt
            }
        });
    } catch (error) {
        console.error('Error submitting full paper:', error);
        res.status(500).json({
            message: 'Server error during full paper submission',
            error: error.message
        });
    }
};

// View full paper PDF in browser
export const viewFullPaper = async (req, res) => {
    try {
        const paperId = req.params.id;

        if (!paperId) {
            return res.status(400).json({ message: 'Paper ID is required' });
        }

        // Find paper by ID
        const paper = await Paper.findById(paperId);

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Check if full paper exists
        if (!paper.fullPaperPdfPath) {
            return res.status(404).json({ message: 'Full paper has not been submitted yet' });
        }

        // Check if user is authorized to view this paper
        const isOwner = paper.user.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this paper' });
        }

        // Extract just the filename from the path
        const filename = path.basename(paper.fullPaperPdfPath);

        // Find the actual file
        const uploadDir = path.join(__dirname, '..', 'uploads');
        const pdfFullPath = path.join(uploadDir, filename);

        console.log('Looking for full paper PDF at:', pdfFullPath);

        // Check if file exists
        if (!fs.existsSync(pdfFullPath)) {
            return res.status(404).json({ message: 'Full paper PDF file not found on server' });
        }

        // Set headers for inline viewing
        const safeFilename = paper.title.replace(/[^a-zA-Z0-9]/g, '_') + '_full_paper.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

        // Stream the file directly
        const fileStream = fs.createReadStream(pdfFullPath);
        fileStream.on('error', (error) => {
            console.error('Error streaming full paper PDF:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error streaming PDF file' });
            }
        });

        fileStream.pipe(res);
    } catch (error) {
        console.error('Error viewing full paper:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Re-upload abstract paper (when reset by admin)
export const reUploadAbstract = async (req, res) => {
    try {
        const paperId = req.params.id;

        console.log('Abstract re-upload attempt received for paper:', paperId);
        console.log('File:', req.file);

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        // Find paper by ID
        const paper = await Paper.findById(paperId);

        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Check if user is authorized to re-upload this paper
        if (paper.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to re-upload this paper' });
        }

        // Check if paper is in a state that allows re-upload (pdfPath should be null)
        if (paper.pdfPath) {
            return res.status(400).json({ message: 'Paper already has an abstract. Contact admin if you need to replace it.' });
        }

        // Save the new PDF file path
        const relativePath = req.file.path.replace(/^.*[\\\/]uploads[\\\/]/, '');
        const pdfPath = path.join('uploads', relativePath);

        console.log('Storing new PDF path as:', pdfPath);

        // Calculate next version number
        const nextVersion = paper.abstractSubmissionHistory.length + 1;

        // Mark previous submissions as superseded if they exist
        if (paper.abstractSubmissionHistory.length > 0) {
            paper.abstractSubmissionHistory.forEach(submission => {
                if (submission.status === 'current') {
                    submission.status = 'superseded';
                }
            });
        }

        // Create the new submission date
        const newSubmissionDate = new Date();

        // Add new submission to history with all required fields
        paper.abstractSubmissionHistory.push({
            filePath: pdfPath,
            fileName: req.file.originalname,
            submittedAt: newSubmissionDate,
            status: 'current',
            version: nextVersion
        });

        // Update the paper with new abstract and reset status to review_awaited
        paper.pdfPath = pdfPath;
        paper.status = 'review_awaited';
        // Update the main submission date to reflect the re-upload date
        paper.submittedAt = newSubmissionDate;
        // Clear any previous review comments since this is a new submission
        paper.review = '';

        await paper.save();

        res.status(200).json({
            success: true,
            message: 'Abstract re-uploaded successfully',
            paper: {
                id: paper._id,
                title: paper.title,
                ictacemId: paper.ictacemId,
                status: paper.status,
                submittedAt: paper.submittedAt
            }
        });
    } catch (error) {
        console.error('Error re-uploading abstract:', error);
        res.status(500).json({
            message: 'Server error during abstract re-upload',
            error: error.message
        });
    }
};

// Get count of user's submitted papers
export const getUserSubmissionsCount = async (req, res) => {
    try {
        const count = await Paper.countDocuments({ user: req.user._id });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};