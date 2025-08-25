// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error for debugging
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'المعرف غير صحيح'
    error = { message, statusCode: 400 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const value = err.keyValue[field]
    const message = `قيمة ${field} "${value}" موجودة مسبقاً`
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = { message, statusCode: 400 }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'رمز الوصول غير صحيح'
    error = { message, statusCode: 401 }
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'رمز الوصول منتهي الصلاحية'
    error = { message, statusCode: 401 }
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'حجم الملف كبير جداً'
    error = { message, statusCode: 400 }
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'عدد الملفات المرفوعة يتجاوز الحد المسموح'
    error = { message, statusCode: 400 }
  }

  // Rate limit errors
  if (err.status === 429) {
    const message = 'تم تجاوز الحد الأقصى للطلبات، يرجى المحاولة لاحقاً'
    error = { message, statusCode: 429 }
  }

  // Default error
  const statusCode = error.statusCode || err.statusCode || 500
  const message = error.message || 'خطأ في الخادم'

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: error.code || 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  })
}
