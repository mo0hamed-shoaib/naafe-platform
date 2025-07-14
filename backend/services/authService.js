import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { Seeker, Provider, Admin } from '../models/index.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} Created user object (without password)
   */
  async register(userData) {
    try {
      console.log(`[AuthService] Registering new user with email: ${userData.email}, role: ${userData.role}`);
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.error(`[AuthService] User already exists with email: ${userData.email}`);
        throw new Error('User with this email already exists');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      console.log(`[AuthService] Password hashed successfully for user: ${userData.email}`);

      // Determine which model to use based on role
      let UserModel;
      switch (userData.role) {
        case 'seeker':
          UserModel = Seeker;
          break;
        case 'provider':
          UserModel = Provider;
          break;
        case 'admin':
          UserModel = Admin;
          break;
        default:
          console.error(`[AuthService] Invalid role specified: ${userData.role}`);
          throw new Error('Invalid role specified');
      }

      console.log(`[AuthService] Using ${userData.role} model for user creation`);

      // Create new user with the appropriate discriminator model
      const newUser = new UserModel({
        ...userData,
        password: hashedPassword
      });

      await newUser.save();
      console.log(`[AuthService] User created successfully: ${newUser._id}`);

      // Return user without password
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      console.error(`[AuthService] Error registering user: ${error.message}`);
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
      console.log(`[AuthService] Login attempt for email: ${email}`);
      
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        console.error(`[AuthService] Login failed - user not found: ${email}`);
        throw new Error('Invalid email or password');
      }

      // Check if user is blocked
      if (user.isBlocked) {
        console.error(`[AuthService] Login failed - account blocked: ${email}`);
        throw new Error('Account is blocked. Please contact support.');
      }

      // Check if user is active
      if (!user.isActive) {
        console.error(`[AuthService] Login failed - account inactive: ${email}`);
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.error(`[AuthService] Login failed - invalid password: ${email}`);
        throw new Error('Invalid email or password');
      }

      console.log(`[AuthService] Password verified successfully for user: ${email}`);

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      console.log(`[AuthService] Login successful for user: ${email}, tokens generated`);

      // Return user data and tokens
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        user: userResponse,
        accessToken,
        refreshToken
      };
    } catch (error) {
      console.error(`[AuthService] Error during login: ${error.message}`);
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
      role: user.role
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