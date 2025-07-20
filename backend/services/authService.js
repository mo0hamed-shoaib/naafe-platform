import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} Created user object (without password)
   */
  async register(userData) {
    try {
      // Default role is seeker
      let roles = ['seeker'];
      let seekerProfile = {};
      let providerProfile = {};

      // If admin is creating a provider, allow provider role
      if (userData.roles && Array.isArray(userData.roles) && userData.roles.includes('provider')) {
        roles = ['provider'];
        providerProfile = {};
      }

      // Check if user already exists by email
      const existingUserByEmail = await User.findOne({ email: userData.email });
      if (existingUserByEmail) {
        throw new Error('البريد الإلكتروني مسجل مسبقاً');
      }

      // Check if user already exists by phone
      const existingUserByPhone = await User.findOne({ phone: userData.phone });
      if (existingUserByPhone) {
        throw new Error('رقم الهاتف مسجل مسبقاً');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create new user
      const newUser = new User({
        ...userData,
        password: hashedPassword,
        roles,
        seekerProfile,
        providerProfile
      });

      await newUser.save();

      // Return user without password
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check email and phone availability
   * @param {string} email - Email to check
   * @param {string} phone - Phone to check
   * @returns {Object} Availability status
   */
  async checkAvailability(email, phone) {
    try {
      const result = {
        email: { available: true, message: '' },
        phone: { available: true, message: '' }
      };

      // Check email availability
      if (email) {
        const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingUserByEmail) {
          result.email.available = false;
          result.email.message = 'البريد الإلكتروني مسجل مسبقاً';
        }
      }

      // Check phone availability
      if (phone) {
        const existingUserByPhone = await User.findOne({ phone });
        if (existingUserByPhone) {
          result.phone.available = false;
          result.phone.message = 'رقم الهاتف مسجل مسبقاً';
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Authenticate user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} User object and tokens
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is blocked
      if (user.isBlocked) {
        throw new Error('Account is blocked. Please contact support.');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Return user data and tokens
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate access token
   * @param {Object} user - User object
   * @returns {string} JWT access token
   */
  generateAccessToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      roles: user.roles // include the array of roles
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
  }

  /**
   * Generate refresh token
   * @param {Object} user - User object
   * @returns {string} JWT refresh token
   */
  generateRefreshToken(user) {
    const payload = {
      userId: user._id,
      type: 'refresh'
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });
  }

  /**
   * Verify access token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Verify refresh token
   * @param {string} token - JWT refresh token
   * @returns {Object} Decoded token payload
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - JWT refresh token
   * @returns {Object} New access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || user.isBlocked || !user.isActive) {
        throw new Error('User not found or account is blocked');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      return {
        accessToken: newAccessToken
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user from token
   * @param {string} token - JWT access token
   * @returns {Object} User object
   */
  async getCurrentUser(token) {
    try {
      const decoded = this.verifyAccessToken(token);
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isBlocked) {
        throw new Error('Account is blocked');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Return user data without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(); 