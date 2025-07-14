import express from 'express';
import userController from '../controllers/userController.js';
import jobRequestController from '../controllers/jobRequestController.js';
import { validateUpdateProfile, validateUserId } from '../validation/userValidation.js';
import { authenticateToken, optionalAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, userController.getCurrentUser);

/**
 * @route   PATCH /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.patch('/me', authenticateToken, validateUpdateProfile, userController.updateCurrentUser);

/**
 * @route   GET /api/users/me/requests
 * @desc    Get current user's job requests
 * @access  Private
 */
router.get('/me/requests', authenticateToken, jobRequestController.getMyJobRequests);

/**
 * @route   GET /api/users/:id
 * @desc    Get public user profile by ID
 * @access  Public (with optional auth)
 */
router.get('/:id', optionalAuth, validateUserId, userController.getPublicUserProfile);

/**
 * @route   GET /api/users/:id/stats
 * @desc    Get user statistics
 * @access  Public
 */
router.get('/:id/stats', validateUserId, userController.getUserStats);

// Admin: Get all users (paginated, filterable)
router.get('/', authenticateToken, requireRole(['admin']), userController.getAllUsers);
// Admin: Block a user
router.patch('/:id/block', authenticateToken, requireRole(['admin']), userController.blockUser);
// Admin: Unblock a user
router.patch('/:id/unblock', authenticateToken, requireRole(['admin']), userController.unblockUser);

export default router; 