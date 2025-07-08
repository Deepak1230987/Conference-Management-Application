import Paper from '../models/paper.model.js';
import User from '../models/user.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Send a chat message (both user and admin)
export const sendChatMessage = async (req, res) => {
    try {
        const { paperId } = req.params;
        const { message } = req.body;
        const userId = req.user._id;
        const userRole = req.user.role;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            });
        }

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({
                success: false,
                message: 'Paper not found'
            });
        }

        // Check authorization
        const isOwner = paper.user.toString() === userId.toString();
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send messages for this paper'
            });
        }

        // Process file attachments if any
        const attachments = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileType = file.mimetype.startsWith('image/') ? 'image' :
                    file.mimetype === 'application/pdf' ? 'pdf' : 'document';

                attachments.push({
                    fileName: file.originalname,
                    filePath: file.path,
                    fileType: fileType,
                    fileSize: file.size
                });
            }
        }

        // Create new message
        const newMessage = {
            sender: userId,
            senderRole: userRole,
            message: message.trim(),
            attachments: attachments,
            timestamp: new Date(),
            isRead: false
        };

        // Initialize chatMessages array if it doesn't exist
        if (!paper.chatMessages) {
            paper.chatMessages = [];
        }

        // Initialize chatMetadata if it doesn't exist
        if (!paper.chatMetadata) {
            paper.chatMetadata = {
                unreadUserMessages: 0,
                unreadAdminMessages: 0
            };
        }

        // Add message to paper
        paper.chatMessages.push(newMessage);

        // Update chat metadata
        paper.chatMetadata.lastMessageAt = new Date();

        // Update unread count - increment count for messages FROM the sender
        if (userRole === 'admin') {
            // Admin sent a message, so increment unread admin messages (for users to see)
            paper.chatMetadata.unreadAdminMessages += 1;
        } else {
            // User sent a message, so increment unread user messages (for admin to see)
            paper.chatMetadata.unreadUserMessages += 1;
        }

        await paper.save();

        // Populate sender info for response
        await paper.populate('chatMessages.sender', 'username email role');

        const savedMessage = paper.chatMessages[paper.chatMessages.length - 1];

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            chatMessage: savedMessage,
            unreadCounts: {
                userMessages: paper.chatMetadata.unreadUserMessages,
                adminMessages: paper.chatMetadata.unreadAdminMessages
            }
        });

    } catch (error) {
        console.error('Error sending chat message:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
};

// Get chat messages for a paper
export const getChatMessages = async (req, res) => {
    try {
        const { paperId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const paper = await Paper.findById(paperId)
            .populate('chatMessages.sender', 'username email role')
            .select('chatMessages chatMetadata user');

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: 'Paper not found'
            });
        }

        // Check authorization
        const isOwner = paper.user.toString() === userId.toString();
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view messages for this paper'
            });
        }

        // Mark messages as read for current user role
        let hasUnreadMessages = false;
        if (paper.chatMessages && paper.chatMessages.length > 0) {
            paper.chatMessages.forEach(msg => {
                // Mark messages from the opposite role as read
                if ((userRole === 'admin' && msg.senderRole === 'user' && !msg.isRead) ||
                    (userRole === 'user' && msg.senderRole === 'admin' && !msg.isRead)) {
                    msg.isRead = true;
                    hasUnreadMessages = true;
                }
            });
        }

        // Update unread counts
        if (hasUnreadMessages) {
            if (!paper.chatMetadata) {
                paper.chatMetadata = {
                    unreadUserMessages: 0,
                    unreadAdminMessages: 0
                };
            }

            if (userRole === 'admin') {
                paper.chatMetadata.unreadUserMessages = 0;
            } else {
                paper.chatMetadata.unreadAdminMessages = 0;
            }

            await paper.save();
        }

        res.status(200).json({
            success: true,
            messages: paper.chatMessages || [],
            unreadCounts: {
                userMessages: paper.chatMetadata?.unreadUserMessages || 0,
                adminMessages: paper.chatMetadata?.unreadAdminMessages || 0
            }
        });

    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: error.message
        });
    }
};

// Download chat attachment
export const downloadChatAttachment = async (req, res) => {
    try {
        const { paperId, messageId, attachmentIndex } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({
                success: false,
                message: 'Paper not found'
            });
        }

        // Check authorization
        const isOwner = paper.user.toString() === userId.toString();
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to download attachments for this paper'
            });
        }

        // Find the message and attachment
        const message = paper.chatMessages.id(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        const attachmentIdx = parseInt(attachmentIndex);
        if (attachmentIdx < 0 || attachmentIdx >= message.attachments.length) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found'
            });
        }

        const attachment = message.attachments[attachmentIdx];
        const filePath = path.resolve(attachment.filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        // Set appropriate headers
        res.setHeader('Content-Disposition', `attachment; filename="${attachment.fileName}"`);

        if (attachment.fileType === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
        } else if (attachment.fileType === 'image') {
            res.setHeader('Content-Type', 'image/*');
        } else {
            res.setHeader('Content-Type', 'application/octet-stream');
        }

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Error downloading chat attachment:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading attachment',
            error: error.message
        });
    }
};

// View chat attachment in browser
export const viewChatAttachment = async (req, res) => {
    try {
        const { paperId, messageId, attachmentIndex } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({
                success: false,
                message: 'Paper not found'
            });
        }

        // Check authorization
        const isOwner = paper.user.toString() === userId.toString();
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view attachments for this paper'
            });
        }

        // Find the message and attachment
        const message = paper.chatMessages.id(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        const attachmentIdx = parseInt(attachmentIndex);
        if (attachmentIdx < 0 || attachmentIdx >= message.attachments.length) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found'
            });
        }

        const attachment = message.attachments[attachmentIdx];
        const filePath = path.resolve(attachment.filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        // Set appropriate headers for inline viewing
        if (attachment.fileType === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${attachment.fileName}"`);
        } else if (attachment.fileType === 'image') {
            const ext = path.extname(attachment.fileName).toLowerCase();
            const mimeTypes = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp'
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
            res.setHeader('Content-Disposition', `inline; filename="${attachment.fileName}"`);
        } else {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${attachment.fileName}"`);
        }

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Error viewing chat attachment:', error);
        res.status(500).json({
            success: false,
            message: 'Error viewing attachment',
            error: error.message
        });
    }
};

// Get unread message counts for all papers (for dashboard)
export const getUnreadCounts = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        let query = {};
        if (userRole === 'admin') {
            // Admin can see all papers
            query = {};
        } else {
            // Users can only see their own papers
            query = { user: userId };
        }

        const papers = await Paper.find(query)
            .select('_id title ictacemId chatMetadata')
            .lean();

        const unreadSummary = papers.map(paper => ({
            paperId: paper._id,
            title: paper.title,
            ictacemId: paper.ictacemId,
            unreadCount: userRole === 'admin'
                ? (paper.chatMetadata?.unreadUserMessages || 0)
                : (paper.chatMetadata?.unreadAdminMessages || 0)
        })).filter(item => item.unreadCount > 0);

        const totalUnread = unreadSummary.reduce((sum, item) => sum + item.unreadCount, 0);

        res.status(200).json({
            success: true,
            totalUnread,
            unreadSummary
        });

    } catch (error) {
        console.error('Error getting unread counts:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting unread counts',
            error: error.message
        });
    }
};