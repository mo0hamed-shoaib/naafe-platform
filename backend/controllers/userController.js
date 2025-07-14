import userService from '../services/userService.js';
import { logger } from '../middlewares/logging.middleware.js';

class UserController {
  /**
   * Get current user profile
   * GET /api/users/me
   */
  async getCurrentUser(req, res) {
    try {
      const userId = req.user._id;
      const user = await userService.getCurrentUser(userId);

      res.status(200).json({
        success: true,
        data: {
          user
        },
        message: 'User profile retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('User not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Account is blocked') || error.message.includes('Account is deactivated')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      logger.error(`Get current user error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update current user profile
   * PATCH /api/users/me
   */
  async updateCurrentUser(req, res) {
    try {
      const userId = req.user._id;
      const updateData = req.body;

      const updatedUser = await userService.updateCurrentUser(userId, updateData);

      res.status(200).json({
        success: true,
        data: {
          user: updatedUser
        },
        message: 'Profile updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('User not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message.includes('Location coordinates') || 
          error.message.includes('Bio cannot exceed') ||
          error.message.includes('First name must be') ||
          error.message.includes('Last name must be') ||
          error.message.includes('valid Egyptian phone number')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: validationErrors
          },
          timestamp: new Date().toISOString()
        });
      }

      logger.error(`Update current user error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get public user profile by ID
   * GET /api/users/:id
   */
  async getPublicUserProfile(req, res) {
    try {
      const { id } = req.params;
      const requestingUserId = req.user?._id; // Optional, for authenticated requests

      const publicProfile = await userService.getPublicUserProfile(id, requestingUserId);

      res.status(200).json({
        success: true,
        data: {
          user: publicProfile
        },
        message: 'User profile retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('User not found') || error.message.includes('User profile not available')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      logger.error(`Get public user profile error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get user statistics
   * GET /api/users/:id/stats
   */
  async getUserStats(req, res) {
    try {
      const { id } = req.params;
      const stats = await userService.getUserStats(id);

      res.status(200).json({
        success: true,
        data: {
          stats
        },
        message: 'User statistics retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.message.includes('User not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }

      logger.error(`Get user stats error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new UserController(); 