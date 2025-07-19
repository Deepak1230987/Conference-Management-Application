import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Format status values for display
const formatStatus = (status) => {
    const statusMap = {
        'submitted': 'Submitted',
        'review_awaited': 'Review Awaited',
        'review_in_progress': 'Review in Progress',
        'author_response_awaited': 'Author Response Awaited',
        'abstract_accepted': 'Abstract Accepted',
        'declined': 'Declined'
    };

    return statusMap[status] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
    // Use Gmail service directly (same as auth controller)
    return nodemailer.createTransport({
        service: 'gmail', // Use Gmail service directly
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Alternative transporter for backup (same as auth controller)
const createAlternativeTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 60000,
        greetingTimeout: 60000,
        socketTimeout: 60000
    });
};

// Email templates
const emailTemplates = {
    paperStatusChange: (data) => ({
        subject: `ICTACEM 2025 - Paper Status Update: ${data.paperTitle || 'Your Paper'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0;">ICTACEM 2025</h1>
                    <p style="color: #7f8c8d; margin: 5px 0;">International Conference on Theoretical Applied Computational and Experimental Mechanics</p>
                </header>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                    <h2 style="color: #2980b9; margin-top: 0;">Paper Status Update</h2>
                    <p>Dear ${data.userName || 'Valued Author'},</p>
                    <p>The status of your paper has been updated:</p>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Paper Title:</strong> ${data.paperTitle || 'N/A'}</p>
                        <p><strong>ICTACEM ID:</strong> ${data.ictacemId || 'N/A'}</p>
                        <p><strong>Previous Status:</strong> <span style="color: #e74c3c;">${formatStatus(data.previousStatus) || 'N/A'}</span></p>
                        <p><strong>New Status:</strong> <span style="color: #27ae60;">${formatStatus(data.newStatus) || 'N/A'}</span></p>
                        ${data.reviewComments ? `<p><strong>Review Comments:</strong><br>${data.reviewComments}</p>` : ''}
                    </div>
                    
                    <p>Please log in to your dashboard to view more details and take any necessary actions.</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${data.dashboardUrl || '#'}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a>
                    </div>
                </div>
                
                <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #7f8c8d; font-size: 12px;">This is an automated email from ICTACEM 2025. Please do not reply to this email.</p>
                </footer>
            </div>
        `
    }),

    abstractReset: (data) => ({
        subject: `ICTACEM 2025 - Abstract Reset Required: ${data.paperTitle || 'Your Paper'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0;">ICTACEM 2025</h1>
                    <p style="color: #7f8c8d; margin: 5px 0;">International Conference on Theoretical Applied Computational and Experimental Mechanics</p>
                </header>
                
                <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                    <h2 style="color: #856404; margin-top: 0;">Abstract Resubmission Required</h2>
                    <p>Dear ${data.userName || 'Valued Author'},</p>
                    <p>Your abstract needs to be resubmitted for the following paper:</p>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Paper Title:</strong> ${data.paperTitle || 'N/A'}</p>
                        <p><strong>ICTACEM ID:</strong> ${data.ictacemId || 'N/A'}</p>
                        ${data.resetReason ? `<p><strong>Reason for Reset:</strong> ${data.resetReason}</p>` : ''}
                        <p><strong>Reset By:</strong> ${data.resetBy || 'Administrator'}</p>
                        <p><strong>Reset Date:</strong> ${data.resetAt ? new Date(data.resetAt).toLocaleString() : new Date().toLocaleString()}</p>
                    </div>
                    
                    <p><strong style="color: #d63384;">Action Required:</strong> Please upload a new abstract as soon as possible.</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${data.uploadUrl || '#'}" style="background-color: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Upload New Abstract</a>
                    </div>
                </div>
                
                <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #7f8c8d; font-size: 12px;">This is an automated email from ICTACEM 2025. Please do not reply to this email.</p>
                </footer>
            </div>
        `
    }),

    fullPaperReset: (data) => ({
        subject: `ICTACEM 2025 - Full Paper Reset Required: ${data.paperTitle || 'Your Paper'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0;">ICTACEM 2025</h1>
                    <p style="color: #7f8c8d; margin: 5px 0;">International Conference on Theoretical Applied Computational and Experimental Mechanics</p>
                </header>
                
                <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                    <h2 style="color: #856404; margin-top: 0;">Full Paper Resubmission Required</h2>
                    <p>Dear ${data.userName || 'Valued Author'},</p>
                    <p>Your full paper needs to be resubmitted for the following paper:</p>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Paper Title:</strong> ${data.paperTitle || 'N/A'}</p>
                        <p><strong>ICTACEM ID:</strong> ${data.ictacemId || 'N/A'}</p>
                        ${data.resetReason ? `<p><strong>Reason for Reset:</strong> ${data.resetReason}</p>` : ''}
                        <p><strong>Reset By:</strong> ${data.resetBy || 'Administrator'}</p>
                        <p><strong>Reset Date:</strong> ${data.resetAt ? new Date(data.resetAt).toLocaleString() : new Date().toLocaleString()}</p>
                    </div>
                    
                    <p><strong style="color: #d63384;">Action Required:</strong> Please upload a new full paper as soon as possible.</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${data.uploadUrl || '#'}" style="background-color: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Upload New Full Paper</a>
                    </div>
                </div>
                
                <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #7f8c8d; font-size: 12px;">This is an automated email from ICTACEM 2025. Please do not reply to this email.</p>
                </footer>
            </div>
        `
    }),

    reviewComment: (data) => ({
        subject: `ICTACEM 2025 - Review Comments Available: ${data.paperTitle || 'Your Paper'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0;">ICTACEM 2025</h1>
                    <p style="color: #7f8c8d; margin: 5px 0;">International Conference on Theoretical Applied Computational and Experimental Mechanics</p>
                </header>
                
                <div style="background-color: #d1ecf1; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
                    <h2 style="color: #0c5460; margin-top: 0;">Review Comments Available</h2>
                    <p>Dear ${data.userName || 'Valued Author'},</p>
                    <p>Review comments are now available for your paper:</p>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Paper Title:</strong> ${data.paperTitle || 'N/A'}</p>
                        <p><strong>ICTACEM ID:</strong> ${data.ictacemId || 'N/A'}</p>
                        <p><strong>Reviewer:</strong> ${data.reviewerName || 'Anonymous Reviewer'}</p>
                        <p><strong>Review Date:</strong> ${data.reviewDate ? new Date(data.reviewDate).toLocaleString() : new Date().toLocaleString()}</p>
                        ${data.reviewComments ? `
                            <div style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 3px;">
                                <strong>Comments:</strong><br>
                                <p style="margin: 5px 0;">${data.reviewComments}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${data.paperUrl || '#'}" style="background-color: #17a2b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Full Review</a>
                    </div>
                </div>
                
                <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #7f8c8d; font-size: 12px;">This is an automated email from ICTACEM 2025. Please do not reply to this email.</p>
                </footer>
            </div>
        `
    }),

    paperApproved: (data) => ({
        subject: `🎉 ICTACEM 2025 - Paper Approved: ${data.paperTitle || 'Your Paper'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0;">ICTACEM 2025</h1>
                    <p style="color: #7f8c8d; margin: 5px 0;">International Conference on Theoretical Applied Computational and Experimental Mechanics</p>
                </header>
                
                <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #28a745;">
                    <h2 style="color: #155724; margin-top: 0;">🎉 Congratulations! Your Paper Has Been Approved</h2>
                    <p>Dear ${data.userName || 'Valued Author'},</p>
                    <p>We are pleased to inform you that your paper has been approved for presentation at ICTACEM 2025:</p>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Paper Title:</strong> ${data.paperTitle || 'N/A'}</p>
                        <p><strong>ICTACEM ID:</strong> ${data.ictacemId || 'N/A'}</p>
                        <p><strong>Presentation Mode:</strong> ${data.presentationMode || 'TBD'}</p>
                        ${data.reviewComments ? `<p><strong>Final Comments:</strong> ${data.reviewComments}</p>` : ''}
                    </div>
                    
                    <p>Please prepare for your presentation and check the conference schedule for your presentation time.</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${data.scheduleUrl || '#'}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Schedule</a>
                    </div>
                </div>
                
                <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #7f8c8d; font-size: 12px;">This is an automated email from ICTACEM 2025. Please do not reply to this email.</p>
                </footer>
            </div>
        `
    }),

    paperDeclined: (data) => ({
        subject: `ICTACEM 2025 - Paper Decision: ${data.paperTitle || 'Your Paper'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0;">ICTACEM 2025</h1>
                    <p style="color: #7f8c8d; margin: 5px 0;">International Conference on Theoretical Applied Computational and Experimental Mechanics</p>
                </header>
                
                <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #dc3545;">
                    <h2 style="color: #721c24; margin-top: 0;">Paper Review Decision</h2>
                    <p>Dear ${data.userName || 'Valued Author'},</p>
                    <p>Thank you for submitting your paper to ICTACEM 2025. After careful review, we regret to inform you that your paper has not been accepted for presentation:</p>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Paper Title:</strong> ${data.paperTitle || 'N/A'}</p>
                        <p><strong>ICTACEM ID:</strong> ${data.ictacemId || 'N/A'}</p>
                        ${data.reviewComments ? `<p><strong>Reviewer Feedback:</strong><br>${data.reviewComments}</p>` : ''}
                    </div>
                    
                    <p>We appreciate your interest in ICTACEM 2025 and encourage you to consider submitting to future conferences.</p>
                </div>
                
                <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #7f8c8d; font-size: 12px;">This is an automated email from ICTACEM 2025. Please do not reply to this email.</p>
                </footer>
            </div>
        `
    })
};

// Send email function
export const sendEmail = async (to, templateKey, data) => {
    try {
        console.log('=== EMAIL DEBUG START ===');
        console.log('Attempting to send email to:', to);
        console.log('Template key:', templateKey);
        console.log('Data:', JSON.stringify(data, null, 2));
        console.log('Environment variables check:');
        console.log('SMTP_USER:', process.env.SMTP_USER);
        console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
        console.log('SMTP_PASS exists:', !!process.env.SMTP_PASS);

        const template = emailTemplates[templateKey];

        if (!template) {
            console.error('Template not found:', templateKey);
            throw new Error(`Email template '${templateKey}' not found`);
        }

        console.log('Template found, generating email content...');
        const { subject, html } = template(data);
        console.log('Email subject:', subject);
        console.log('HTML content length:', html.length);

        const mailOptions = {
            from: `"ICTACEM 2025" <${process.env.FROM_EMAIL}>`,
            to: to,
            subject: subject,
            html: html
        };

        console.log('Mail options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            htmlLength: mailOptions.html.length
        });

        let emailSent = false;
        let lastError = null;

        try {
            console.log('Attempting to send email with Gmail service...');
            const transporter = createTransporter();

            // Test connection
            await transporter.verify();
            console.log('Gmail SMTP connection verified');

            const result = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully with Gmail service:', result.messageId);
            emailSent = true;

            console.log('=== EMAIL DEBUG END ===');
            return { success: true, messageId: result.messageId };

        } catch (err) {
            console.log('Gmail service failed:', err.message);
            lastError = err;

            try {
                console.log('Trying alternative SMTP configuration...');
                const altTransporter = createAlternativeTransporter();

                await altTransporter.verify();
                console.log('Alternative SMTP connection verified');

                const result = await altTransporter.sendMail(mailOptions);
                console.log('Email sent successfully with alternative SMTP:', result.messageId);
                emailSent = true;

                console.log('=== EMAIL DEBUG END ===');
                return { success: true, messageId: result.messageId };

            } catch (altErr) {
                console.log('Alternative SMTP also failed:', altErr.message);
                lastError = altErr;
            }
        }

        if (!emailSent) {
            console.error('=== EMAIL ERROR ===');
            console.error('All email sending attempts failed');
            console.error('Last error:', lastError);
            console.error('=== EMAIL ERROR END ===');
            return { success: false, error: lastError?.message || 'Failed to send email' };
        }

    } catch (error) {
        console.error('=== EMAIL ERROR ===');
        console.error('Error sending email:', error);
        console.error('Error name:', error.name);
        console.error('Error code:', error.code);
        console.error('Error command:', error.command);
        console.error('Error stack:', error.stack);
        console.error('=== EMAIL ERROR END ===');
        return { success: false, error: error.message };
    }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('SMTP configuration is valid');
        return true;
    } catch (error) {
        console.error('SMTP configuration error:', error);
        return false;
    }
};

export default {
    sendEmail,
    verifyEmailConfig,
    emailTemplates
};
