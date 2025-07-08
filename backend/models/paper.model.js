import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    affiliation: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    }
});

const paperSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    authors: [authorSchema],
    pdfPath: {
        type: String,
        required: false, // Changed to allow null when reset
        default: null
    },
    fullPaperPdfPath: {
        type: String,
        default: null
    },
    // Abstract submission history
    abstractSubmissionHistory: [{
        filePath: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['current', 'previous', 'superseded', 'reset_by_admin'],
            default: 'current'
        },
        version: {
            type: Number,
            default: 1
        },
        // Fields for admin reset actions
        resetBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        resetAt: {
            type: Date,
            default: null
        },
        resetReason: {
            type: String,
            default: ''
        },
        adminAction: {
            type: String,
            enum: ['reset', 'status_change', 'resubmission_allowed']
            // Removed default value - only set for actual admin actions
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        actionAt: {
            type: Date,
            default: null
        },
        reason: {
            type: String,
            default: ''
        }
    }],
    // Full paper submission history
    fullPaperSubmissionHistory: [{
        filePath: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['current', 'previous', 'superseded', 'reset_by_admin'],
            default: 'current'
        },
        version: {
            type: Number,
            default: 1
        },
        // Fields for admin reset actions
        resetBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        resetAt: {
            type: Date,
            default: null
        },
        resetReason: {
            type: String,
            default: ''
        },
        adminAction: {
            type: String,
            enum: ['reset', 'status_change', 'resubmission_allowed']
            // Removed default value - only set for actual admin actions
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        actionAt: {
            type: Date,
            default: null
        },
        reason: {
            type: String,
            default: ''
        }
    }],
    theme: {
        type: String,
        required: true
    },
    modeOfPresentation: {
        type: String,
        enum: ['Oral', 'Poster (Only for Students)', 'Video (Only for Students)'],
        required: true
    },
    ictacemId: {
        type: String,
        required: true,

    },
    status: {
        type: String,
        enum: ['review_awaited', 'review_in_progress', 'author_response_awaited', 'abstract_accepted', 'approved', 'declined'],
        default: 'review_awaited'
    },
    review: {
        type: String,
        default: ''
    },
    // Admin-only scoring and confidential comments
    adminEvaluation: {
        marks: {
            type: Number,
            min: 0,
            max: 100,
            default: null
        },
        confidentialComments: {
            type: String,
            default: ''
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        reviewedAt: {
            type: Date,
            default: null
        }
    },
    paymentId: {
        type: String,
        default: ''
    },
    fullPaperSubmittedAt: {
        type: Date,
        default: null
    },
    // Admin-uploaded files (additional documents, revised versions, etc.)
    adminUploadedFiles: [{
        filePath: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        description: {
            type: String,
            default: ''
        },
        fileType: {
            type: String,
            enum: ['review_comment_file'],
            default: 'review_comment_file'
        },
        visibleToUser: {
            type: Boolean,
            default: true
        }
    }],
    // Chat system for paper discussions
    chatMessages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        senderRole: {
            type: String,
            enum: ['user', 'admin'],
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        attachments: [{
            fileName: {
                type: String,
                required: true
            },
            filePath: {
                type: String,
                required: true
            },
            fileType: {
                type: String,
                enum: ['image', 'pdf', 'document'],
                required: true
            },
            fileSize: {
                type: Number,
                required: true
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }],
        timestamp: {
            type: Date,
            default: Date.now
        },
        isRead: {
            type: Boolean,
            default: false
        },
        editedAt: {
            type: Date,
            default: null
        }
    }],
    // Chat metadata
    chatMetadata: {
        lastMessageAt: {
            type: Date,
            default: null
        },
        unreadUserMessages: {
            type: Number,
            default: 0
        },
        unreadAdminMessages: {
            type: Number,
            default: 0
        }
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Paper = mongoose.model('Paper', paperSchema);

export default Paper;