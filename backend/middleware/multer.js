import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define uploads directory - make it relative to the root directory
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

console.log('Uploads directory configured at:', uploadsDir);

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at:', uploadsDir);
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);

        // Use different prefixes based on the route/context
        let prefix = 'file';
        if (req.originalUrl && req.originalUrl.includes('/papers/')) {
            prefix = 'paper';
        } else if (req.originalUrl && req.originalUrl.includes('/admin/')) {
            prefix = 'admin';
        }

        cb(null, `${prefix}-${uniqueSuffix}${extension}`);
    }
});

// File filter for papers (PDF only)
const paperFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for paper submissions'), false);
    }
};

// File filter for admin uploads (PDF only)
const adminFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for admin uploads'), false);
    }
};

// File filter for chat attachments (Images and PDFs)
const chatFileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, image files (JPEG, PNG, GIF, WebP), and Word documents are allowed for chat attachments'), false);
    }
};

// Export the configured multer instances
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: paperFileFilter
});

// Admin-specific multer for file uploads
export const adminUpload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: adminFileFilter
});

// Chat-specific multer for file uploads
export const chatUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file for chat
        files: 5 // Maximum 5 files per message
    },
    fileFilter: chatFileFilter
});