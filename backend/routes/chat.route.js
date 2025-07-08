import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { chatUpload } from '../middleware/multer.js';
import {
    sendChatMessage,
    getChatMessages,
    downloadChatAttachment,
    viewChatAttachment,
    getUnreadCounts
} from '../controller/chat.controller.js';

const router = express.Router();

// Protect all chat routes with authentication
router.use(protect);

// Chat routes
router.post('/papers/:paperId/messages', chatUpload.array('attachments', 5), sendChatMessage);
router.get('/papers/:paperId/messages', getChatMessages);
router.get('/papers/:paperId/messages/:messageId/attachments/:attachmentIndex/download', downloadChatAttachment);
router.get('/papers/:paperId/messages/:messageId/attachments/:attachmentIndex/view', viewChatAttachment);
router.get('/unread-counts', getUnreadCounts);

export default router;