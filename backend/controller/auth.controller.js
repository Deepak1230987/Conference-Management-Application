import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { generateUniqueCustomUserId } from '../utils/idGenerator.js';

dotenv.config();

// Email configuration with multiple fallback options
const createTransporter = () => {
    // First try with Gmail SMTP
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

// Alternative transporter for backup
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

// Cookie options for JWT
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict',
    path: '/', // Explicitly set path
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
};

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
        expiresIn: '5d',
    });
};


// Set JWT token in cookie
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = generateToken(user._id);

    // Set token in HTTP-only cookie
    res.cookie('jwt', token, cookieOptions);

    // Send response - ensuring role is explicitly included
    res.status(statusCode).json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        customUserId: user.customUserId
    });
};

// Register a new user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Generate a unique custom user ID
        const customUserId = await generateUniqueCustomUserId(User);

        // Create new user with custom ID
        const user = await User.create({
            username,
            email,
            password,
            customUserId
        });

        if (user) {
            // Set token in cookie and send response
            sendTokenResponse(user, 201, res);
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if password is correct
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Set token in cookie and send response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            // Explicitly include the role
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                customUserId: user.customUserId,
                createdAt: user.createdAt
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// Logout user
export const logout = (req, res) => {
    // Clear the JWT cookie using the same base options
    const logoutCookieOptions = {
        ...cookieOptions,
        expires: new Date(0), // Override maxAge with expires for logout
        maxAge: undefined // Remove maxAge for logout
    };

    res.cookie('jwt', '', logoutCookieOptions);

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Forgot password
export const forgotPassword = async (req, res) => {
    console.log('Forgot password endpoint called with:', req.body);
    try {
        const { email } = req.body;
        console.log('Processing forgot password for email:', email);

        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'There is no user with that email'
            });
        }

        // Get reset token
        console.log('Generating reset token...');
        const resetToken = user.getResetPasswordToken();
        console.log('Reset token generated:', resetToken ? 'Yes' : 'No');

        await user.save({ validateBeforeSave: false });
        console.log('User saved with reset token');

        // Create reset url - use CLIENT_URL instead of server host
        const clientUrl = process.env.CLIENT_URL || 'http://10.25.1.5/ictacem2025';
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
        console.log('Reset URL:', resetUrl);

        let emailSent = false;
        let lastError = null;

        // Try multiple email sending approaches
        const emailMessage = {
            from: `"ICTACEM 2025" <${process.env.FROM_EMAIL}>`,
            to: user.email,
            subject: 'Password Reset Request - ICTACEM 2025',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #3b82f6;">Password Reset Request</h2>
                    <p>Dear User,</p>
                    <p>You have requested a password reset for your ICTACEM 2025 account.</p>
                    <p>Please click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                    </div>
                    <p>If you did not request this password reset, please ignore this email.</p>
                    <p><strong>This link will expire in 10 minutes.</strong></p>
                    <hr>
                    <p style="font-size: 12px; color: #666;">ICTACEM 2025 Conference System</p>
                </div>
            `
        };

        try {
            console.log('Attempting to send email with Gmail service...');
            const transporter = createTransporter();

            // Test connection
            await transporter.verify();
            console.log('Gmail SMTP connection verified');

            const result = await transporter.sendMail(emailMessage);
            console.log('Email sent successfully with Gmail service:', result.messageId);
            emailSent = true;

        } catch (err) {
            console.log('Gmail service failed:', err.message);
            lastError = err;

            try {
                console.log('Trying alternative SMTP configuration...');
                const altTransporter = createAlternativeTransporter();

                await altTransporter.verify();
                console.log('Alternative SMTP connection verified');

                const result = await altTransporter.sendMail(emailMessage);
                console.log('Email sent successfully with alternative SMTP:', result.messageId);
                emailSent = true;

            } catch (altErr) {
                console.log('Alternative SMTP also failed:', altErr.message);
                lastError = altErr;
            }
        }

        if (emailSent) {
            res.status(200).json({
                success: true,
                message: 'Password reset email sent successfully! Please check your inbox.'
            });
        } else {
            console.log('All email sending methods failed. Last error:', lastError);

            // For development/testing - log the reset URL to console
            if (process.env.NODE_ENV === 'development') {
                console.log('=== DEVELOPMENT MODE ===');
                console.log('Reset token (for testing):', resetToken);
                console.log('Reset URL (for testing):', resetUrl);
                console.log('========================');

                // Return success in development mode with instructions
                return res.status(200).json({
                    success: true,
                    message: 'Password reset token generated. Check server console for reset link (development mode)',
                    devMode: true,
                    resetToken: resetToken // Only include in development
                });
            }

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: `Email could not be sent: ${lastError?.message || 'Unknown error'}`
            });
        }
    } catch (error) {
        console.log('Forgot password function error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Send token response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};