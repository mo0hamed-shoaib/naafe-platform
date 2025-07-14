import express from 'express';
import userController from '../controllers/userController.js';
import jobRequestController from '../controllers/jobRequestController.js';
import { validateUpdateProfile, validateUserId } from '../validation/userValidation.js';
import { authenticateToken, optionalAuth } from '../middlewares/auth.middleware.js';

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

export default router; 