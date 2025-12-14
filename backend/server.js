import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import paperRoutes from './routes/paper.route.js';
import adminRoutes from './routes/admin.route.js';
import chatRoutes from './routes/chat.route.js';
import notificationRoutes from './routes/notification.route.js';
import emailTestRoutes from './routes/email-test.route.js';
import sponsorsRoutes from './routes/sponsors.route.js';
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
    origin: [
        process.env.CLIENT_URL || 'http://10.25.1.5/ictacem2025',
        'http://www.ae.iitkgp.ac.in',
        'https://www.ae.iitkgp.ac.in',
        'http://ae.iitkgp.ac.in',
        'https://ae.iitkgp.ac.in',
        'http://10.25.1.5',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

// Add request logging middleware to debug API calls
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url}`);
    console.log(`  Origin: ${req.headers.origin || 'none'}`);
    console.log(`  User-Agent: ${req.headers['user-agent'] || 'none'}`);
    console.log(`  IP: ${req.ip || req.connection.remoteAddress}`);

    // Log payment update requests for debugging
    if (req.url.includes('/payment') && req.method === 'PATCH') {
        console.log('Payment update request:', {
            url: req.url,
            method: req.method,
            origin: req.headers.origin,
            cookies: Object.keys(req.cookies || {}),
            hasAuthHeader: !!req.headers.authorization,
            contentType: req.headers['content-type']
        });
    }

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

// Serve documents from public/documents folder
app.use('/ictacem2025/api/documents', express.static(path.join(__dirname, 'public/documents')));
app.use('/api/documents', express.static(path.join(__dirname, 'public/documents')));

// Specific route for brochure with proper headers
app.get('/ictacem2025/api/brochure', (req, res) => {
    try {
        const brochurePath = path.join(__dirname, 'public/documents/ICTACEM 2025 Brochure.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="ICTACEM_2025_Brochure.pdf"');
        res.sendFile(brochurePath);
    } catch (error) {
        console.error('Error serving brochure:', error);
        res.status(500).json({ message: 'Error serving brochure file' });
    }
});

// Specific route for extended abstract format with proper headers
app.get('/ictacem2025/api/extended-abstract-format', (req, res) => {
    try {
        const formatPath = path.join(__dirname, 'public/documents/format_for_Extended_Abstract.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="ICTACEM_2025_Extended_Abstract_Format.pdf"');
        res.sendFile(formatPath);
    } catch (error) {
        console.error('Error serving extended abstract format:', error);
        res.status(500).json({ message: 'Error serving extended abstract format file' });
    }
});

// Specific route for full-length paper format with proper headers
app.get('/ictacem2025/api/full-length-paper-format', (req, res) => {
    try {
        const formatPath = path.join(__dirname, 'public/documents/ICTACEM2025_Full_Length_Template.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="ICTACEM_2025_Full_Length_Paper_Format.pdf"');
        res.sendFile(formatPath);
    } catch (error) {
        console.error('Error serving full-length paper format:', error);
        res.status(500).json({ message: 'Error serving full-length paper format file' });
    }
});

// Specific route for sponsorship brochure with proper headers
app.get('/ictacem2025/api/sponsorship-brochure', (req, res) => {
    try {
        const sponsorshipPath = path.join(__dirname, 'public/documents/ICTACEM-2025_Sponsorship_Brochure[1].pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="ICTACEM_2025_Sponsorship_Brochure.pdf"');
        res.sendFile(sponsorshipPath);
    } catch (error) {
        console.error('Error serving sponsorship brochure:', error);
        res.status(500).json({ message: 'Error serving sponsorship brochure file' });
    }
});

// Specific route for payment procedure with proper headers
app.get('/ictacem2025/api/payment-procedure', (req, res) => {
    try {
        const paymentPath = path.join(__dirname, 'public/documents/PaymentProcedurePreview.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="ICTACEM_2025_Payment_Procedure.pdf"');
        res.sendFile(paymentPath);
    } catch (error) {
        console.error('Error serving payment procedure:', error);
        res.status(500).json({ message: 'Error serving payment procedure file' });
    }
});

// Specific route for technical schedule with proper headers
app.get('/ictacem2025/api/book-of-abstracts', (req, res) => {
    try {
        const schedulePath = path.join(__dirname, 'public/documents/Technical Schedule.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="ICTACEM_2025_Technical_Schedule.pdf"');
        res.sendFile(schedulePath);
    } catch (error) {
        console.error('Error serving technical schedule:', error);
        res.status(500).json({ message: 'Error serving technical schedule file' });
    }
});

// Specific route for venue map with proper headers
app.get('/ictacem2025/api/venue-map', (req, res) => {
    try {
        const mapPath = path.join(__dirname, 'public/documents/ICTACEM2025_Map.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="ICTACEM_2025_Venue_Map.pdf"');
        res.sendFile(mapPath);
    } catch (error) {
        console.error('Error serving venue map:', error);
        res.status(500).json({ message: 'Error serving venue map file' });
    }
});

// Specific route for book of abstracts PDF with proper headers
app.get('/ictacem2025/api/book-of-abstracts-pdf', (req, res) => {
    try {
        const abstractsPath = path.join(__dirname, 'public/documents/Book of abstracts.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="ICTACEM_2025_Book_of_Abstracts.pdf"');
        res.sendFile(abstractsPath);
    } catch (error) {
        console.error('Error serving book of abstracts:', error);
        res.status(500).json({ message: 'Error serving book of abstracts file' });
    }
});

// Mount all API routes under /ictacem2025 prefix FIRST (most specific routes first)
app.use('/ictacem2025/api/auth', authRoutes);
app.use('/ictacem2025/api/papers', paperRoutes);
app.use('/ictacem2025/api/admin', adminRoutes);
app.use('/ictacem2025/api/chat', chatRoutes);
app.use('/ictacem2025/api/notifications', notificationRoutes);
app.use('/ictacem2025/api/sponsors', sponsorsRoutes);


// Also keep the original routes for backward compatibility
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sponsors', sponsorsRoutes);




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

