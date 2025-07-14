import User from '../models/User.js';
import { logger } from '../middlewares/logging.middleware.js';
import mongoose from 'mongoose';

class VerificationService {
  /**
   * Request verification as a provider
   * @param {string} userId - User ID
   * @param {Object} verificationData - Verification request data
   * @returns {Object} Updated user verification status
   */
  async requestVerification(userId, verificationData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Add provider role if not present
      if (!user.roles.includes('provider')) {
        user.roles.push('provider');
      }
      // Initialize providerProfile if not present
      if (!user.providerProfile) {
        user.providerProfile = {};
      }
      // Set verification status to pending
      user.providerProfile.verification = {
        status: 'pending',
        method: verificationData.method || 'manual',
        documents: [],
        verifiedAt: null,
        verifiedBy: null,
        rejectionReason: null
      };
      await user.save();
      logger.info(`Verification requested for user ${userId} (provider role)`);
      return {
        verificationStatus: user.providerProfile.verification.status,
        method: user.providerProfile.verification.method,
        message: 'Verification request submitted successfully. Your role will be upgraded to provider upon approval.'
      };
    } catch (error) {
      logger.error(`Request verification error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload verification documents
   * @param {string} userId - User ID
   * @param {Array} documents - Array of uploaded documents
   * @returns {Object} Updated documents list
   */
  async uploadDocuments(userId, documents) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate file types and sizes
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      for (const doc of documents) {
        if (!allowedTypes.includes(doc.mimetype)) {
          throw new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed');
        }

        if (doc.size > maxSize) {
          throw new Error('File too large. Maximum size is 5MB');
        }
      }

      // Add documents to user's verification documents
      const newDocuments = documents.map(doc => ({
        type: doc.fieldname || 'other',
        url: doc.path || doc.url,
        filename: doc.originalname,
        uploadedAt: new Date(),
        status: 'pending'
      }));

      if (user.providerProfile && user.providerProfile.verification) {
        user.providerProfile.verification.documents.push(...newDocuments);
      } else {
        user.providerProfile = {
          verification: {
            documents: newDocuments
          }
        };
      }
      await user.save();

      logger.info(`Documents uploaded for user ${userId}`);

      return {
        documents: user.providerProfile.verification.documents,
        message: 'Documents uploaded successfully'
      };
    } catch (error) {
      logger.error(`Upload documents error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get verification status for a user
   * @param {string} userId - User ID
   * @returns {Object} Verification status and details
   */
  async getVerificationStatus(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        status: user.providerProfile.verification.status,
        method: user.providerProfile.verification.method,
        documents: user.providerProfile.verification.documents,
        verifiedAt: user.providerProfile.verification.verifiedAt,
        rejectionReason: user.providerProfile.verification.rejectionReason
      };
    } catch (error) {
      logger.error(`Get verification status error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all pending verifications (admin only)
   * @param {Object} options - Pagination options
   * @returns {Object} Paginated list of pending verifications
   */
  async getPendingVerifications(options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const skip = (page - 1) * limit;

      const pendingUsers = await User.find({
        'providerProfile.verification.status': 'pending',
        role: 'provider'
      })
      .select('name email phone providerProfile.verification.createdAt')
      .sort({ 'providerProfile.verification.createdAt': -1 })
      .skip(skip)
      .limit(limit);

      const total = await User.countDocuments({
        'providerProfile.verification.status': 'pending',
        role: 'provider'
      });

      return {
        users: pendingUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error(`Get pending verifications error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Approve verification (admin only)
   * @param {string} userId - User ID to approve
   * @param {string} adminId - Admin ID who approved
   * @param {string} notes - Optional notes
   * @returns {Object} Updated user verification status
   */
  async approveVerification(userId, adminId, notes = '') {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.providerProfile || !user.providerProfile.verification || user.providerProfile.verification.status !== 'pending') {
        throw new Error('No pending verification found for this user');
      }
      // Approve verification
      user.providerProfile.verification.status = 'verified';
      user.providerProfile.verification.verifiedAt = new Date();
      user.providerProfile.verification.verifiedBy = adminId;
      user.providerProfile.verification.rejectionReason = null;
      // Approve all documents if any
      if (user.providerProfile.verification.documents) {
        user.providerProfile.verification.documents.forEach(doc => {
          if (doc.status === 'pending') {
            doc.status = 'approved';
            doc.notes = notes;
          }
        });
      }
      await user.save();
      logger.info(`Verification approved for user ${userId} by admin ${adminId}`);
      return {
        verificationStatus: user.providerProfile.verification.status,
        verifiedAt: user.providerProfile.verification.verifiedAt,
        message: 'Verification approved successfully'
      };
    } catch (error) {
      logger.error(`Approve verification error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reject verification (admin only)
   * @param {string} userId - User ID to reject
   * @param {string} adminId - Admin ID who rejected
   * @param {string} reason - Rejection reason
   * @returns {Object} Updated user verification status
   */
  async rejectVerification(userId, adminId, reason) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.providerProfile || !user.providerProfile.verification || user.providerProfile.verification.status !== 'pending') {
        throw new Error('No pending verification found for this user');
      }

      // Update verification status
      user.providerProfile.verification.status = 'rejected';
      user.providerProfile.verification.rejectionReason = reason;
      user.providerProfile.verification.verifiedBy = adminId;

      // Update all documents to rejected
      if (user.providerProfile.verification.documents) {
        user.providerProfile.verification.documents.forEach(doc => {
          if (doc.status === 'pending') {
            doc.status = 'rejected';
            doc.notes = reason;
          }
        });
      }

      await user.save();

      logger.info(`Verification rejected for user ${userId} by admin ${adminId}`);

      return {
        verificationStatus: user.providerProfile.verification.status,
        rejectionReason: user.providerProfile.verification.rejectionReason,
        message: 'Verification rejected successfully'
      };
    } catch (error) {
      logger.error(`Reject verification error: ${error.message}`);
      throw error;
    }
  }
}

export default new VerificationService(); 