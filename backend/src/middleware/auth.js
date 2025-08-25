import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

// Protect routes - require authentication
export const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        res.status(401)
        throw new Error('المستخدم غير موجود')
      }

      if (!req.user.isActive) {
        res.status(401)
        throw new Error('الحساب معطل')
      }

      next()
    } catch (error) {
      console.error('❌ Token verification failed:', error)
      res.status(401)
      throw new Error('غير مصرح، فشل في التحقق من الرمز')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('غير مصرح، لا يوجد رمز وصول')
  }
})

// Optional authentication - don't require token but set user if provided
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    } catch (error) {
      // Don't throw error, just continue without user
      console.log('⚠️ Optional auth failed:', error.message)
    }
  }

  next()
})

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401)
      throw new Error('غير مصرح، يلزم تسجيل الدخول')
    }

    if (!roles.includes(req.user.role)) {
      res.status(403)
      throw new Error('غير مصرح، لا تملك الصلاحيات المطلوبة')
    }

    next()
  }
}

// Specific role checks
export const requireSeeker = authorize('seeker')
export const requireProvider = authorize('provider')
export const requireAdmin = authorize('admin')

// Check if user owns the resource or is admin
export const checkOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401)
      throw new Error('غير مصرح، يلزم تسجيل الدخول')
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next()
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField]
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      res.status(403)
      throw new Error('غير مصرح، لا يمكنك الوصول لهذا المورد')
    }

    next()
  }
}

// Verify email middleware
export const requireEmailVerification = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401)
    throw new Error('غير مصرح، يلزم تسجيل الدخول')
  }

  if (!req.user.isVerified) {
    res.status(403)
    throw new Error('يرجى تأكيد بريدك الإلكتروني أولاً')
  }

  next()
})

// Check if user is verified provider
export const requireVerifiedProvider = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401)
    throw new Error('غير مصرح، يلزم تسجيل الدخول')
  }

  if (req.user.role !== 'provider') {
    res.status(403)
    throw new Error('هذه الخدمة متاحة للمزودين فقط')
  }

  if (!req.user.isVerified) {
    res.status(403)
    throw new Error('يرجى إكمال عملية التحقق من الحساب')
  }

  next()
})

// Rate limiting for authentication attempts
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول، يرجى المحاولة لاحقاً',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
}

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

// Generate refresh token
export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  })
}
