import express from 'express';
import { sendEmail, verifyEmailConfig } from '../utils/emailService.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public test email endpoint (no auth required for testing)
router.post('/test-email-public', async (req, res) => {
    try {
        console.log('=== PUBLIC EMAIL TEST START ===');
        const { to } = req.body;

        if (!to) {
            return res.status(400).json({
                success: false,
                message: 'Email address is required'
            });
        }

        // Test data
        const testData = {
            userName: 'Test User',
            paperTitle: 'Test Paper for Email Service',
            ictacemId: 'ICTACEM-TEST-001',
            previousStatus: 'review_awaited',
            newStatus: 'approved',
            reviewComments: 'This is a test review comment from the notification system.',
            dashboardUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/profile`,
        };

        console.log('Sending test email to:', to);
        const result = await sendEmail(to, 'paperStatusChange', testData);

        console.log('Email service result:', result);
        console.log('=== PUBLIC EMAIL TEST END ===');

        if (result.success) {
            res.json({
                success: true,
                message: 'Test email sent successfully!',
                messageId: result.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email',
                error: result.error
            });
        }

    } catch (error) {
        console.error('Public email test error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during email test',
            error: error.message
        });
    }
});

// Test email endpoint
router.post('/test-email', protect, admin, async (req, res) => {
    try {
        const { to, templateKey, testData } = req.body;

        // Default test data
        const defaultTestData = {
            userName: 'Test User',
            paperTitle: 'Test Paper Title',
            ictacemId: 'ICTACEM-TEST-001',
            previousStatus: 'review_awaited',
            newStatus: 'approved',
            reviewComments: 'This is a test review comment.',
            dashboardUrl: `${process.env.CLIENT_URL}/profile`,
            uploadUrl: `${process.env.CLIENT_URL}/submit-paper`,
            scheduleUrl: `${process.env.CLIENT_URL}/schedule`,
            resetReason: 'Testing email functionality',
            resetBy: 'Test Admin',
            resetAt: new Date(),
            reviewerName: 'Test Reviewer',
            reviewDate: new Date(),
            presentationMode: 'Oral'
        };

        const emailData = { ...defaultTestData, ...testData };

        console.log('Testing email with data:', emailData);

        const result = await sendEmail(to, templateKey, emailData);

        res.json({
            success: true,
            message: 'Test email attempted',
            result: result
        });

    } catch (error) {
        console.error('Error in test email endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending test email',
            error: error.message
        });
    }
});

// Verify email configuration endpoint
router.get('/verify-config', protect, admin, async (req, res) => {
    try {
        const isValid = await verifyEmailConfig();

        res.json({
            success: true,
            isValid,
            config: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                user: process.env.SMTP_USER,
                from: process.env.FROM_EMAIL,
                hasPassword: !!process.env.SMTP_PASS
            }
        });

    } catch (error) {
        console.error('Error verifying email config:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email configuration',
            error: error.message
        });
    }
});

export default router;
