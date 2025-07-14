import verificationService from '../services/verificationService.js';
import { logger } from '../middlewares/logging.middleware.js';

class VerificationController {
  /**
   * Request verification as a provider
   * POST /api/verification/request
   */
  async requestVerification(req, res) {
    try {
      const userId = req.user._id;
      const verificationData = req.body;
      
      logger.info(`Verification request from user: ${userId}`);
      
      const result = await verificationService.requestVerification(userId, verificationData);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Verification request submitted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Verification request error: ${error.message}`);
      
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
      
      if (error.message.includes('Already verified') || 
          error.message.includes('Already pending')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }
      
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
   * Upload verification documents
   * POST /api/verification/upload
   */
  async uploadDocuments(req, res) {
    try {
      const userId = req.user._id;
      const documents = req.files; // Assuming multer middleware
      
      logger.info(`Document upload for user: ${userId}`);
      
      const result = await verificationService.uploadDocuments(userId, documents);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Documents uploaded successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Document upload error: ${error.message}`);
      
      if (error.message.includes('Invalid file type') || 
          error.message.includes('File too large')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }
      
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
   * Get verification status
   * GET /api/verification/status
   */
  async getVerificationStatus(req, res) {
    try {
      const userId = req.user._id;
      
      const status = await verificationService.getVerificationStatus(userId);
      
      res.status(200).json({
        success: true,
        data: status,
        message: 'Verification status retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Get verification status error: ${error.message}`);
      
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
   * Admin: Get all pending verifications
   * GET /api/verification/pending
   */
  async getPendingVerifications(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const result = await verificationService.getPendingVerifications({ page, limit });
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Pending verifications retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Get pending verifications error: ${error.message}`);
      
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
   * Admin: Approve verification
   * POST /api/verification/:userId/approve
   */
  async approveVerification(req, res) {
    try {
      const { userId } = req.params;
      const adminId = req.user._id;
      const { notes } = req.body;
      
      logger.info(`Admin ${adminId} approving verification for user ${userId}`);
      
      const result = await verificationService.approveVerification(userId, adminId, notes);
      
      // If migration occurred, include the new user ID in response
      const responseData = {
        verificationStatus: result.verificationStatus,
        verifiedAt: result.verifiedAt,
        message: result.message
      };

      if (result.newUserId) {
        responseData.newUserId = result.newUserId;
        responseData.migrationOccurred = true;
      }
      
      res.status(200).json({
        success: true,
        data: responseData,
        message: 'Verification approved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Approve verification error: ${error.message}`);
      
      if (error.message.includes('User not found') || 
          error.message.includes('No pending verification')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }
      
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
   * Admin: Reject verification
   * POST /api/verification/:userId/reject
   */
  async rejectVerification(req, res) {
    try {
      const { userId } = req.params;
      const adminId = req.user._id;
      const { reason } = req.body;
      
      logger.info(`Admin ${adminId} rejecting verification for user ${userId}`);
      
      const result = await verificationService.rejectVerification(userId, adminId, reason);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Verification rejected successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Reject verification error: ${error.message}`);
      
      if (error.message.includes('User not found') || 
          error.message.includes('No pending verification')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          },
          timestamp: new Date().toISOString()
        });
      }
      
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

export default new VerificationController(); 