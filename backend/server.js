import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import paperRoutes from './routes/paper.route.js';
import adminRoutes from './routes/admin.route.js';
import chatRoutes from './routes/chat.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://10.25.32.177/ictacem2025',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

// Add request logging middleware to debug API calls
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.url.includes('/api/admin/papers') && req.method === 'POST') {
        console.log('Admin file upload request received:', {
            url: req.url,
            method: req.method,
            headers: req.headers,
            body: req.body
        });
    }
    next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files - make sure this is before the routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount all API routes under /ictacem2025 prefix FIRST (most specific routes first)
app.use('/ictacem2025/api/auth', authRoutes);
app.use('/ictacem2025/api/papers', paperRoutes);
app.use('/ictacem2025/api/admin', adminRoutes);
app.use('/ictacem2025/api/chat', chatRoutes);

// Also keep the original routes for backward compatibility
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Routes with /ictacem2025 prefix
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// PDF viewer route - serves PDF files for viewing in browser
app.get('/view-pdf/:filepath', (req, res) => {
    try {
        // Get file path from URL
        const filepath = req.params.filepath;
        const fullPath = path.join(__dirname, filepath);

        // Set content type to application/pdf for browser viewing
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="paper.pdf"');

        // Send file for viewing, not downloading
        res.sendFile(fullPath);
    } catch (error) {
        console.error('Error serving PDF:', error);
        res.status(500).json({ message: 'Error serving PDF file' });
    }
});

// Start server - listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoints available at:`);
    console.log(`- http://localhost:${PORT}/api/`);
    console.log(`- http://localhost:${PORT}/ictacem2025/api/`);
});

