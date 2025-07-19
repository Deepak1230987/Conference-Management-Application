import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Can be null for system notifications
    },
    type: {
        type: String,
        enum: [
            'paper_status_change',
            'abstract_reset',
            'fullpaper_reset',
            'review_comment',
            'paper_approved',
            'paper_declined',
            'resubmission_required',
            'admin_file_uploaded',
            'chat_message',
            'system_notification'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    paperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paper',
        default: null
    },
    actionUrl: {
        type: String,
        default: null // URL to redirect user for action
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isEmailSent: {
        type: Boolean,
        default: false
    },
    emailSentAt: {
        type: Date,
        default: null
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {} // Additional data like previous status, new status, etc.
    }
}, {
    timestamps: true
});

// Index for efficient querying
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ paperId: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
