import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import Paper from '../models/paper.model.js';
import { sendEmail } from './emailService.js';

class NotificationService {
    // Create a new notification
    static async createNotification({
        recipientId,
        senderId = null,
        type,
        title,
        message,
        paperId = null,
        actionUrl = null,
        priority = 'medium',
        metadata = {},
        sendEmail: shouldSendEmail = true
    }) {
        try {
            // Create notification in database
            const notification = new Notification({
                recipient: recipientId,
                sender: senderId,
                type,
                title,
                message,
                paperId,
                actionUrl,
                priority,
                metadata
            });

            await notification.save();
            await notification.populate('recipient', 'username email');
            await notification.populate('sender', 'username email');

            if (paperId) {
                await notification.populate('paperId', 'title ictacemId');
            }

            // Send email notification if requested
            if (shouldSendEmail && notification.recipient && notification.recipient.email) {
                await this.sendEmailNotification(notification);
            }

            console.log(`Notification created: ${type} for user ${recipientId}`);
            return notification;

        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Send email notification based on type
    static async sendEmailNotification(notification) {
        try {
            console.log('=== NOTIFICATION EMAIL DEBUG START ===');
            console.log('Notification object:', JSON.stringify(notification, null, 2));

            const recipient = notification.recipient;
            const paper = notification.paperId;
            const metadata = notification.metadata;

            console.log('Recipient:', recipient);
            console.log('Paper:', paper);
            console.log('Metadata:', metadata);

            if (!recipient || !recipient.email) {
                console.error('No recipient email found');
                return { success: false, error: 'No recipient email found' };
            }

            let emailTemplate = null;
            let emailData = {
                userName: recipient.username || recipient.name || 'Valued Author',
                dashboardUrl: `${process.env.CLIENT_URL}/profile`,
                uploadUrl: `${process.env.CLIENT_URL}/profile`,
                scheduleUrl: `${process.env.CLIENT_URL}/profile`,
                paperUrl: paper ? `${process.env.CLIENT_URL}/profile` : null,
                paperTitle: paper ? paper.title : metadata.paperTitle || 'Unknown Paper',
                ictacemId: paper ? paper.ictacemId : metadata.ictacemId || 'Unknown ID'
            };

            console.log('Base email data:', emailData);

            switch (notification.type) {
                case 'paper_status_change':
                    emailTemplate = 'paperStatusChange';
                    emailData = {
                        ...emailData,
                        previousStatus: metadata.previousStatus || 'Unknown',
                        newStatus: metadata.newStatus || 'Unknown',
                        reviewComments: metadata.reviewComments || null
                    };
                    break;

                case 'abstract_reset':
                    emailTemplate = 'abstractReset';
                    emailData = {
                        ...emailData,
                        resetReason: metadata.resetReason || 'No reason provided',
                        resetBy: metadata.resetBy || 'Admin',
                        resetAt: metadata.resetAt || new Date()
                    };
                    break;

                case 'fullpaper_reset':
                    emailTemplate = 'fullPaperReset';
                    emailData = {
                        ...emailData,
                        resetReason: metadata.resetReason || 'No reason provided',
                        resetBy: metadata.resetBy || 'Admin',
                        resetAt: metadata.resetAt || new Date(),
                        uploadUrl: `${process.env.CLIENT_URL}/submit-full-paper`
                    };
                    break;

                case 'review_comment':
                    emailTemplate = 'reviewComment';
                    emailData = {
                        ...emailData,
                        reviewerName: metadata.reviewerName || 'Anonymous Reviewer',
                        reviewDate: metadata.reviewDate || new Date(),
                        reviewComments: metadata.reviewComments || 'No comments available'
                    };
                    break;

                case 'paper_approved':
                    emailTemplate = 'paperApproved';
                    emailData = {
                        ...emailData,
                        presentationMode: metadata.presentationMode || 'TBD',
                        reviewComments: metadata.reviewComments || null
                    };
                    break;

                case 'paper_declined':
                    emailTemplate = 'paperDeclined';
                    emailData = {
                        ...emailData,
                        reviewComments: metadata.reviewComments || 'No feedback provided'
                    };
                    break;

                default:
                    console.log(`No email template for notification type: ${notification.type}`);
                    console.log('=== NOTIFICATION EMAIL DEBUG END (No template) ===');
                    return null;
            }

            console.log('Selected email template:', emailTemplate);
            console.log('Final email data:', emailData);

            if (emailTemplate) {
                console.log('Calling sendEmail function...');
                const emailResult = await sendEmail(recipient.email, emailTemplate, emailData);
                console.log('Email result:', emailResult);

                if (emailResult.success) {
                    // Update notification to mark email as sent
                    notification.isEmailSent = true;
                    notification.emailSentAt = new Date();
                    await notification.save();
                    console.log(`Email sent for notification ${notification._id}`);
                } else {
                    console.error(`Failed to send email for notification ${notification._id}:`, emailResult.error);
                }

                console.log('=== NOTIFICATION EMAIL DEBUG END ===');
                return emailResult;
            }

        } catch (error) {
            console.error('=== NOTIFICATION EMAIL ERROR ===');
            console.error('Error sending email notification:', error);
            console.error('=== NOTIFICATION EMAIL ERROR END ===');
            return { success: false, error: error.message };
        }
    }

    // Notify about paper status change
    static async notifyPaperStatusChange(paperId, previousStatus, newStatus, adminId, reviewComments = null) {
        try {
            const paper = await Paper.findById(paperId).populate('user', 'username email');
            if (!paper) throw new Error('Paper not found');

            const admin = await User.findById(adminId);
            const adminName = admin ? (admin.username || admin.name || 'Admin') : 'Admin';

            await this.createNotification({
                recipientId: paper.user._id,
                senderId: adminId,
                type: 'paper_status_change',
                title: 'Paper Status Updated',
                message: `Your paper "${paper.title}" status has been changed from "${previousStatus}" to "${newStatus}"`,
                paperId: paperId,
                actionUrl: `/paper/${paperId}`,
                priority: 'high',
                metadata: {
                    previousStatus,
                    newStatus,
                    reviewComments,
                    adminName,
                    paperTitle: paper.title,
                    ictacemId: paper.ictacemId
                }
            });

        } catch (error) {
            console.error('Error notifying paper status change:', error);
            throw error;
        }
    }

    // Notify about abstract reset
    static async notifyAbstractReset(paperId, adminId, resetReason = '') {
        try {
            const paper = await Paper.findById(paperId).populate('user', 'username email');
            if (!paper) throw new Error('Paper not found');

            const admin = await User.findById(adminId);
            const adminName = admin ? (admin.username || admin.name || 'Admin') : 'Admin';

            await this.createNotification({
                recipientId: paper.user._id,
                senderId: adminId,
                type: 'abstract_reset',
                title: 'Abstract Resubmission Required',
                message: `Your abstract for "${paper.title}" has been reset and needs to be resubmitted.`,
                paperId: paperId,
                actionUrl: `/submit-paper`,
                priority: 'urgent',
                metadata: {
                    resetReason,
                    resetBy: adminName,
                    resetAt: new Date(),
                    paperTitle: paper.title,
                    ictacemId: paper.ictacemId
                }
            });

        } catch (error) {
            console.error('Error notifying abstract reset:', error);
            throw error;
        }
    }

    // Notify about full paper reset
    static async notifyFullPaperReset(paperId, adminId, resetReason = '') {
        try {
            const paper = await Paper.findById(paperId).populate('user', 'username email');
            if (!paper) throw new Error('Paper not found');

            const admin = await User.findById(adminId);
            const adminName = admin ? (admin.username || admin.name || 'Admin') : 'Admin';

            await this.createNotification({
                recipientId: paper.user._id,
                senderId: adminId,
                type: 'fullpaper_reset',
                title: 'Full Paper Resubmission Required',
                message: `Your full paper for "${paper.title}" has been reset and needs to be resubmitted.`,
                paperId: paperId,
                actionUrl: `/submit-full-paper`,
                priority: 'urgent',
                metadata: {
                    resetReason,
                    resetBy: adminName,
                    resetAt: new Date(),
                    paperTitle: paper.title,
                    ictacemId: paper.ictacemId
                }
            });

        } catch (error) {
            console.error('Error notifying full paper reset:', error);
            throw error;
        }
    }

    // Notify about review comments
    static async notifyReviewComment(paperId, adminId, reviewComments) {
        try {
            const paper = await Paper.findById(paperId).populate('user', 'username email');
            if (!paper) throw new Error('Paper not found');

            const admin = await User.findById(adminId);
            const reviewerName = admin ? (admin.username || admin.name || 'Anonymous Reviewer') : 'Anonymous Reviewer';

            await this.createNotification({
                recipientId: paper.user._id,
                senderId: adminId,
                type: 'review_comment',
                title: 'Review Comments Available',
                message: `Review comments are available for your paper "${paper.title}"`,
                paperId: paperId,
                actionUrl: `/paper/${paperId}`,
                priority: 'high',
                metadata: {
                    reviewComments,
                    reviewerName,
                    reviewDate: new Date(),
                    paperTitle: paper.title,
                    ictacemId: paper.ictacemId
                }
            });

        } catch (error) {
            console.error('Error notifying review comment:', error);
            throw error;
        }
    }

    // Notify about paper approval
    static async notifyPaperApproved(paperId, adminId, reviewComments = null) {
        try {
            const paper = await Paper.findById(paperId).populate('user', 'username email');
            if (!paper) throw new Error('Paper not found');

            await this.createNotification({
                recipientId: paper.user._id,
                senderId: adminId,
                type: 'paper_approved',
                title: '🎉 Paper Approved!',
                message: `Congratulations! Your paper "${paper.title}" has been approved for presentation.`,
                paperId: paperId,
                actionUrl: `/paper/${paperId}`,
                priority: 'high',
                metadata: {
                    reviewComments,
                    presentationMode: paper.modeOfPresentation,
                    paperTitle: paper.title,
                    ictacemId: paper.ictacemId
                }
            });

        } catch (error) {
            console.error('Error notifying paper approval:', error);
            throw error;
        }
    }

    // Notify about paper decline
    static async notifyPaperDeclined(paperId, adminId, reviewComments = null) {
        try {
            const paper = await Paper.findById(paperId).populate('user', 'username email');
            if (!paper) throw new Error('Paper not found');

            await this.createNotification({
                recipientId: paper.user._id,
                senderId: adminId,
                type: 'paper_declined',
                title: 'Paper Review Decision',
                message: `Your paper "${paper.title}" has not been accepted for presentation.`,
                paperId: paperId,
                actionUrl: `/paper/${paperId}`,
                priority: 'high',
                metadata: {
                    reviewComments,
                    paperTitle: paper.title,
                    ictacemId: paper.ictacemId
                }
            });

        } catch (error) {
            console.error('Error notifying paper decline:', error);
            throw error;
        }
    }

    // Get user notifications
    static async getUserNotifications(userId, page = 1, limit = 20, onlyUnread = false) {
        try {
            console.log('=== NotificationService.getUserNotifications ===');
            console.log('UserId:', userId, 'Type:', typeof userId);
            console.log('Page:', page, 'Limit:', limit, 'OnlyUnread:', onlyUnread);

            const query = { recipient: userId };
            if (onlyUnread) {
                query.isRead = false;
            }

            console.log('Query:', JSON.stringify(query));

            const skip = (page - 1) * limit;

            const notifications = await Notification.find(query)
                .populate('sender', 'username email')
                .populate('paperId', 'title ictacemId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            console.log('Found notifications count:', notifications.length);
            if (notifications.length > 0) {
                console.log('First notification sample:', {
                    id: notifications[0]._id,
                    recipient: notifications[0].recipient,
                    title: notifications[0].title,
                    isRead: notifications[0].isRead
                });
            }

            const total = await Notification.countDocuments(query);
            const unreadCount = await Notification.countDocuments({
                recipient: userId,
                isRead: false
            });

            console.log('Total:', total, 'Unread:', unreadCount);

            return {
                notifications,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalNotifications: total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                },
                unreadCount
            };

        } catch (error) {
            console.error('Error getting user notifications:', error);
            throw error;
        }
    }

    // Mark notification as read
    static async markAsRead(notificationId, userId) {
        try {
            const notification = await Notification.findOneAndUpdate(
                { _id: notificationId, recipient: userId },
                { isRead: true },
                { new: true }
            );

            if (!notification) {
                throw new Error('Notification not found');
            }

            return notification;

        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    // Mark all notifications as read for a user
    static async markAllAsRead(userId) {
        try {
            const result = await Notification.updateMany(
                { recipient: userId, isRead: false },
                { isRead: true }
            );

            return result.modifiedCount;

        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    // Delete old notifications (cleanup job)
    static async cleanupOldNotifications(daysToKeep = 90) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

            const result = await Notification.deleteMany({
                createdAt: { $lt: cutoffDate },
                isRead: true
            });

            console.log(`Cleaned up ${result.deletedCount} old notifications`);
            return result.deletedCount;

        } catch (error) {
            console.error('Error cleaning up old notifications:', error);
            throw error;
        }
    }
}

export default NotificationService;
