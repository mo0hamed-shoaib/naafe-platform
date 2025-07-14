import User from '../models/User.js';
import Seeker from '../models/Seeker.js';
import Provider from '../models/Provider.js';
import Admin from '../models/Admin.js';
import Review from '../models/Review.js';

class UserService {
  /**
   * Get current user profile
   * @param {string} userId - User ID
   * @returns {Object} User object without password
   */
  async getCurrentUser(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isBlocked) {
        throw new Error('Account is blocked. Please contact support.');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update current user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user object without password
   */
  async updateCurrentUser(userId, updateData) {
    try {
      // Remove sensitive fields that shouldn't be updated directly
      const { password, email, role, isActive, isBlocked, ...safeUpdateData } = updateData;

      // Validate location if provided
      if (safeUpdateData.profile?.location) {
        const location = safeUpdateData.profile.location;
        if (location.coordinates && (!Array.isArray(location.coordinates) || location.coordinates.length !== 2)) {
          throw new Error('Location coordinates must be an array of [longitude, latitude]');
        }
      }

      // Validate bio length if provided
      if (safeUpdateData.profile?.bio && safeUpdateData.profile.bio.length > 1000) {
        throw new Error('Bio cannot exceed 1000 characters');
      }

      // Validate name fields if provided
      if (safeUpdateData.name) {
        if (safeUpdateData.name.first && safeUpdateData.name.first.length < 2) {
          throw new Error('First name must be at least 2 characters');
        }
        if (safeUpdateData.name.last && safeUpdateData.name.last.length < 2) {
          throw new Error('Last name must be at least 2 characters');
        }
      }

      // Validate phone if provided
      if (safeUpdateData.phone) {
        const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
        if (!phoneRegex.test(safeUpdateData.phone)) {
          throw new Error('Please enter a valid Egyptian phone number');
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: safeUpdateData },
        { 
          new: true, 
          runValidators: true,
          select: '-password'
        }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get public user profile by ID
   * @param {string} userId - User ID to get profile for
   * @param {string} requestingUserId - ID of user making the request (optional)
   * @returns {Object} Public user profile
   */
  async getPublicUserProfile(userId, requestingUserId = null) {
    try {
      const user = await User.findById(userId).select('-password -email -phone');
      
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isActive) {
        throw new Error('User profile not available');
      }

      // If the requesting user is the same as the target user, return full profile
      if (requestingUserId && requestingUserId.toString() === userId.toString()) {
        return await User.findById(userId).select('-password');
      }

      // Return public profile (exclude sensitive information)
      const publicProfile = {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        profile: {
          bio: user.profile?.bio
        },
        // Role-specific public information
        ...(user.role === 'provider' && {
          rating: user.rating,
          reviewCount: user.reviewCount,
          totalJobsCompleted: user.totalJobsCompleted,
          totalEarnings: user.totalEarnings
        }),
        ...(user.role === 'seeker' && {
          rating: user.rating,
          reviewCount: user.reviewCount,
          totalJobsPosted: user.totalJobsPosted,
          totalSpent: user.totalSpent
        }),
        createdAt: user.createdAt
      };

      return publicProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user statistics based on role
   * @param {string} userId - User ID
   * @returns {Object} User statistics
   */
  async getUserStats(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      let stats = {
        userId: user._id,
        role: user.role,
        rating: user.rating || 0,
        reviewCount: user.reviewCount || 0
      };

      // Add role-specific stats
      if (user.role === 'provider') {
        stats = {
          ...stats,
          totalJobsCompleted: user.totalJobsCompleted || 0,
          totalEarnings: user.totalEarnings || 0
        };
      } else if (user.role === 'seeker') {
        stats = {
          ...stats,
          totalJobsPosted: user.totalJobsPosted || 0,
          totalSpent: user.totalSpent || 0
        };
      }

      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user exists and is active
   * @param {string} userId - User ID
   * @returns {boolean} True if user exists and is active
   */
  async userExistsAndActive(userId) {
    try {
      const user = await User.findById(userId);
      return user && user.isActive && !user.isBlocked;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update user rating and review count
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async updateUserRatingAndReviewCount(userId) {
    const user = await User.findById(userId);
    if (!user) return;
    // Get all reviews for this user
    const reviews = await Review.find({ reviewedUser: userId });
    const reviewCount = reviews.length;
    const avgRating = reviewCount > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) : 0;
    user.rating = avgRating;
    user.reviewCount = reviewCount;
    await user.save();
  }

  // Admin: Get all users (paginated, filterable)
  async getAllUsers({ page = 1, limit = 20, search = '', role }) {
    const query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'name.first': { $regex: search, $options: 'i' } },
        { 'name.last': { $regex: search, $options: 'i' } },
      ];
    }
    if (role) {
      query.role = role;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    return {
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  // Admin: Block a user
  async blockUser(id) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    user.isBlocked = true;
    await user.save();
    return user;
  }

  // Admin: Unblock a user
  async unblockUser(id) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    user.isBlocked = false;
    await user.save();
    return user;
  }
}

export default new UserService(); 