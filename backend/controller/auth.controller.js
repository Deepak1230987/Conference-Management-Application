import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateUniqueCustomUserId } from '../utils/idGenerator.js';

dotenv.config();

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