import User from '../models/User.js';
import { logger } from '../middlewares/logging.middleware.js';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

// Helper to get verification object and profile by role
function getProfileAndVerification(user, role) {
  if (role === 'provider') {
    return { profile: user.providerProfile, setProfile: p => user.providerProfile = p };
  } else {
    return { profile: user.seekerProfile, setProfile: p => user.seekerProfile = p };
  }
}

class VerificationService {
  /**
   * Request verification as a provider
   * @param {string} userId - User ID
   * @param {Object} verificationData - Verification request data
   * @returns {Object} Updated user verification status
   */
  async requestVerification(userId, verificationData, role = 'provider') {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const { profile, setProfile } = getProfileAndVerification(user, role);
    if (!profile) setProfile({});
    if (profile.verification && profile.verification.status === 'pending') throw new Error('Already pending');
    if (profile.verification && profile.verification.status === 'approved') throw new Error('Already verified');
    if (profile.verification && profile.verification.attempts >= 3) throw new Error('Maximum attempts reached');
    profile.verification = {
      status: 'pending',
      explanation: '',
      attempts: (profile.verification?.attempts || 0) + 1,
      idFrontUrl: verificationData.idFrontUrl,
      idBackUrl: verificationData.idBackUrl,
      selfieUrl: verificationData.selfieUrl,
      criminalRecordUrl: verificationData.criminalRecordUrl,
      criminalRecordIssuedAt: verificationData.criminalRecordIssuedAt,
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      auditTrail: [{ action: 'submitted', by: userId, at: new Date() }],
    };
    setProfile(profile);
    await user.save();
    // Notify admin(s) (pseudo, implement as needed)
    // await Notification.create({ userId: adminId, type: 'system', message: 'New verification request' });
    return { verificationStatus: profile.verification.status, message: 'Verification request submitted' };
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
  async getVerificationStatus(userId, role = 'provider') {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const { profile } = getProfileAndVerification(user, role);
    if (!profile || !profile.verification) throw new Error('No verification found');
    return profile.verification;
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
  async approveVerification(userId, adminId, notes = '', role = 'provider') {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const { profile, setProfile } = getProfileAndVerification(user, role);
    if (!profile || !profile.verification || profile.verification.status !== 'pending') throw new Error('No pending verification');
    profile.verification.status = 'approved';
    profile.verification.reviewedAt = new Date();
    profile.verification.reviewedBy = adminId;
    profile.verification.explanation = notes;
    profile.verification.auditTrail.push({ action: 'approved', by: adminId, at: new Date(), explanation: notes });
    setProfile(profile);
    await user.save();
    // Notify user
    await Notification.create({ userId, type: 'system', message: 'تمت الموافقة على التحقق من الهوية.' });
    return { verificationStatus: profile.verification.status, reviewedAt: profile.verification.reviewedAt };
  }

  /**
   * Reject verification (admin only)
   * @param {string} userId - User ID to reject
   * @param {string} adminId - Admin ID who rejected
   * @param {string} reason - Rejection reason
   * @returns {Object} Updated user verification status
   */
  async rejectVerification(userId, adminId, reason, role = 'provider') {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const { profile, setProfile } = getProfileAndVerification(user, role);
    if (!profile || !profile.verification || profile.verification.status !== 'pending') throw new Error('No pending verification');
    profile.verification.status = 'rejected';
    profile.verification.reviewedAt = new Date();
    profile.verification.reviewedBy = adminId;
    profile.verification.explanation = reason;
    profile.verification.auditTrail.push({ action: 'rejected', by: adminId, at: new Date(), explanation: reason });
    setProfile(profile);
    await user.save();
    // Notify user
    await Notification.create({ userId, type: 'system', message: 'تم رفض التحقق من الهوية. السبب: ' + reason });
    return { verificationStatus: profile.verification.status, reviewedAt: profile.verification.reviewedAt };
  }

  // Block user
  async blockUser(userId, adminId, reason) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.isBlocked = true;
    user.blockedReason = reason;
    // Add to audit trail for both profiles if exists
    if (user.providerProfile?.verification) user.providerProfile.verification.auditTrail.push({ action: 'blocked', by: adminId, at: new Date(), explanation: reason });
    if (user.seekerProfile?.verification) user.seekerProfile.verification.auditTrail.push({ action: 'blocked', by: adminId, at: new Date(), explanation: reason });
    await user.save();
    await Notification.create({ userId, type: 'system', message: 'تم حظرك من المنصة. السبب: ' + reason });
    return { isBlocked: true };
  }

  // Unblock user
  async unblockUser(userId, adminId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.isBlocked = false;
    user.blockedReason = '';
    if (user.providerProfile?.verification) user.providerProfile.verification.auditTrail.push({ action: 'unblocked', by: adminId, at: new Date() });
    if (user.seekerProfile?.verification) user.seekerProfile.verification.auditTrail.push({ action: 'unblocked', by: adminId, at: new Date() });
    await user.save();
    await Notification.create({ userId, type: 'system', message: 'تم رفع الحظر عنك.' });
    return { isBlocked: false };
  }
}

export default new VerificationService(); 