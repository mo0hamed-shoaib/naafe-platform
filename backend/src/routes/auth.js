import express from 'express'
import { body, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'
import { generateToken, generateRefreshToken, authRateLimit } from '../middleware/auth.js'

const router = express.Router()

// Rate limiting for auth routes
const authLimiter = rateLimit(authRateLimit)

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('يرجى إدخال بريد إلكتروني صحيح')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز خاص'),
  body('name.first')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('الاسم الأول يجب أن يكون بين 2 و 50 حرف'),
  body('name.last')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('اسم العائلة يجب أن يكون بين 2 و 50 حرف'),
  body('phone')
    .matches(/^(\+20|0)?1[0125][0-9]{8}$/)
    .withMessage('يرجى إدخال رقم هاتف مصري صحيح'),
  body('role')
    .isIn(['seeker', 'provider'])
    .withMessage('الدور يجب أن يكون إما باحث أو مزود')
]

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('يرجى إدخال بريد إلكتروني صحيح')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
]

const validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('يرجى إدخال بريد إلكتروني صحيح')
    .normalizeEmail()
]

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register', authLimiter, validateRegistration, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'بيانات غير صحيحة',
        details: errors.array()
      }
    })
  }

  const { email, password, name, phone, role } = req.body

  // Check if user already exists
  const userExists = await User.findByEmail(email)
  if (userExists) {
    res.status(400)
    throw new Error('المستخدم موجود مسبقاً')
  }

  // Check if phone already exists
  const phoneExists = await User.findOne({ phone })
  if (phoneExists) {
    res.status(400)
    throw new Error('رقم الهاتف مستخدم مسبقاً')
  }

  // Create user
  const user = await User.create({
    email,
    password,
    name,
    phone,
    role
  })

  if (user) {
    // Generate tokens
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          avatarUrl: user.avatarUrl
        },
        token,
        refreshToken
      },
      message: 'تم إنشاء الحساب بنجاح'
    })
  } else {
    res.status(400)
    throw new Error('بيانات غير صحيحة')
  }
}))

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', authLimiter, validateLogin, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'بيانات غير صحيحة',
        details: errors.array()
      }
    })
  }

  const { email, password } = req.body

  // Find user by email
  const user = await User.findByEmail(email)
  if (!user) {
    res.status(401)
    throw new Error('بيانات تسجيل الدخول غير صحيحة')
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(401)
    throw new Error('الحساب معطل')
  }

  // Check password
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    res.status(401)
    throw new Error('بيانات تسجيل الدخول غير صحيحة')
  }

  // Generate tokens
  const token = generateToken(user._id)
  const refreshToken = generateRefreshToken(user._id)

  // Update last login
  user.lastLogin = new Date()
  await user.save()

  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatarUrl: user.avatarUrl
      },
      token,
      refreshToken
    },
    message: 'تم تسجيل الدخول بنجاح'
  })
}))

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
router.get('/me', asyncHandler(async (req, res) => {
  // This route requires authentication middleware
  // The user will be available in req.user from the middleware
  
  if (!req.user) {
    res.status(401)
    throw new Error('غير مصرح، يلزم تسجيل الدخول')
  }

  res.json({
    success: true,
    data: {
      user: req.user
    }
  })
}))

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    res.status(400)
    throw new Error('رمز التحديث مطلوب')
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    
    // Get user
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      res.status(401)
      throw new Error('المستخدم غير موجود')
    }

    if (!user.isActive) {
      res.status(401)
      throw new Error('الحساب معطل')
    }

    // Generate new tokens
    const newToken = generateToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      },
      message: 'تم تحديث الرمز بنجاح'
    })
  } catch (error) {
    res.status(401)
    throw new Error('رمز التحديث غير صحيح')
  }
}))

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
router.post('/forgot-password', authLimiter, validatePasswordReset, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'بيانات غير صحيحة',
        details: errors.array()
      }
    })
  }

  const { email } = req.body

  // Find user by email
  const user = await User.findByEmail(email)
  if (!user) {
    // Don't reveal if email exists or not for security
    return res.json({
      success: true,
      message: 'إذا كان البريد الإلكتروني مسجل، سيتم إرسال رابط إعادة تعيين كلمة المرور'
    })
  }

  // Generate reset token (valid for 1 hour)
  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  // TODO: Send email with reset link
  // For now, just return success message
  console.log('Password reset token:', resetToken)

  res.json({
    success: true,
    message: 'إذا كان البريد الإلكتروني مسجل، سيتم إرسال رابط إعادة تعيين كلمة المرور'
  })
}))

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { token, password } = req.body

  if (!token || !password) {
    res.status(400)
    throw new Error('الرمز وكلمة المرور الجديدة مطلوبان')
  }

  try {
    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user
    const user = await User.findById(decoded.id)
    if (!user) {
      res.status(400)
      throw new Error('الرمز غير صحيح')
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    })
  } catch (error) {
    res.status(400)
    throw new Error('الرمز غير صحيح أو منتهي الصلاحية')
  }
}))

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
router.post('/logout', asyncHandler(async (req, res) => {
  // In a stateless JWT setup, logout is handled client-side
  // by removing the token from storage
  // However, we can implement token blacklisting here if needed
  
  res.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  })
}))

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
router.put('/change-password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!req.user) {
    res.status(401)
    throw new Error('غير مصرح، يلزم تسجيل الدخول')
  }

  if (!currentPassword || !newPassword) {
    res.status(400)
    throw new Error('كلمة المرور الحالية والجديدة مطلوبتان')
  }

  // Validate new password
  if (newPassword.length < 8) {
    res.status(400)
    throw new Error('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
  }

  // Get user with password
  const user = await User.findById(req.user._id)
  
  // Check current password
  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) {
    res.status(400)
    throw new Error('كلمة المرور الحالية غير صحيحة')
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12)
  user.password = await bcrypt.hash(newPassword, salt)
  await user.save()

  res.json({
    success: true,
    message: 'تم تغيير كلمة المرور بنجاح'
  })
}))

export default router
