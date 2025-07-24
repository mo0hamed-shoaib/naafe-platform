import chatService from '../services/chatService.js';
import { logger } from '../middlewares/logging.middleware.js';

/**
 * Get user's conversations
 */
export const getUserConversations = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const result = await chatService.getUserConversations(userId, parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      data: result,
      message: 'Conversations retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in getUserConversations controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve conversations'
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Check if user can access this conversation
    const canAccess = await chatService.canAccessConversation(conversationId, userId);
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied to this conversation'
        },
        timestamp: new Date().toISOString()
      });
    }

    const result = await chatService.getMessages(conversationId, parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      data: result,
      message: 'Messages retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in getMessages controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve messages'
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Check if user can access this conversation
    const canAccess = await chatService.canAccessConversation(conversationId, userId);
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied to this conversation'
        },
        timestamp: new Date().toISOString()
      });
    }

    const readCount = await chatService.markMessagesAsRead(conversationId, userId);

    res.status(200).json({
      success: true,
      data: { readCount },
      message: `${readCount} messages marked as read`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in markMessagesAsRead controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to mark messages as read'
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get conversation by job request ID
 */
export const getConversationByJobRequest = async (req, res) => {
  try {
    const { jobRequestId } = req.params;
    const userId = req.user._id;

    const conversation = await chatService.getConversationByJobRequest(jobRequestId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Conversation not found for this job request'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Check if user can access this conversation
    const canAccess = await chatService.canAccessConversation(conversation._id, userId);
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied to this conversation'
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: conversation,
      message: 'Conversation retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in getConversationByJobRequest controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve conversation'
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get unread message count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const unreadCount = await chatService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount },
      message: 'Unread count retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in getUnreadCount controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve unread count'
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get a single conversation by ID
 */
export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Check if user can access this conversation
    const canAccess = await chatService.canAccessConversation(conversationId, userId);
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied to this conversation'
        },
        timestamp: new Date().toISOString()
      });
    }

    const conversation = await chatService.getConversationById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Conversation not found'
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: { conversation },
      message: 'Conversation retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in getConversationById controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve conversation'
      },
      timestamp: new Date().toISOString()
    });
  }
}; 

/**
 * Create or get conversation by job request ID (for chat-first negotiation)
 */
export const createOrGetConversationByJobRequest = async (req, res) => {
  try {
    const { jobRequestId } = req.params;
    const userId = req.user._id;
    const userRoles = req.user.roles || [];
    let { providerId } = req.body;

    // If providerId is not provided, try to get from query
    if (!providerId && req.query.providerId) {
      providerId = req.query.providerId;
    }

    if (!providerId) {
      return res.status(400).json({
        success: false,
        error: { code: 'PROVIDER_ID_REQUIRED', message: 'providerId is required' }
      });
    }

    let seekerId, actualProviderId;
    if (userRoles.includes('seeker')) {
      seekerId = userId;
      actualProviderId = providerId;
    } else if (userRoles.includes('provider')) {
      seekerId = providerId;
      actualProviderId = userId;
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only seekers or providers can start a conversation' }
      });
    }

    const conversation = await chatService.getOrCreateConversation(jobRequestId, seekerId, actualProviderId);

    res.status(200).json({
      success: true,
      data: conversation,
      message: 'Conversation created or retrieved successfully'
    });
  } catch (error) {
    logger.error('Error in createOrGetConversationByJobRequest controller:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create or get conversation' }
    });
  }
}; 