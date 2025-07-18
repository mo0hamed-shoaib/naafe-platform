import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  getUserConversations,
  getMessages,
  markMessagesAsRead,
  getConversationByJobRequest,
  getUnreadCount
} from '../controllers/chatController.js';

const router = express.Router();

// All chat routes require authentication
router.use(authenticateToken);

// Get user's conversations
router.get('/conversations', getUserConversations);

// Get messages for a conversation
router.get('/conversations/:conversationId/messages', getMessages);

// Mark messages as read
router.patch('/conversations/:conversationId/read', markMessagesAsRead);

// Get conversation by job request ID
router.get('/job-requests/:jobRequestId/conversation', getConversationByJobRequest);

// Get unread message count
router.get('/unread-count', getUnreadCount);

export default router; 