import express from 'express'
import multer from 'multer'
import asyncHandler from 'express-async-handler'
import { protect, requireSeeker, requireProvider } from '../middleware/auth.js'
import uploadService from '../services/uploadService.js'

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('نوع الملف غير مدعوم'), false)
    }
  }
})

// @desc    Upload single image
// @route   POST /api/v1/upload/image
// @access  Private
router.post('/image', protect, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('الملف مطلوب')
  }

  const result = await uploadService.uploadImage(req.file, {
    quality: 80,
    width: 1200,
    height: 1200
  })

  if (!result.success) {
    res.status(400)
    throw new Error(result.error)
  }

  res.status(201).json({
    success: true,
    data: result.data,
    message: 'تم رفع الصورة بنجاح'
  })
}))

// @desc    Upload multiple images
// @route   POST /api/v1/upload/images
// @access  Private
router.post('/images', protect, upload.array('images', 10), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400)
    throw new Error('الملفات مطلوبة')
  }

  const result = await uploadService.uploadMultipleImages(req.files, {
    quality: 80,
    width: 1200,
    height: 1200
  })

  if (!result.success) {
    res.status(400)
    throw new Error(`فشل في رفع بعض الملفات: ${result.errors.map(e => e.error).join(', ')}`)
  }

  res.status(201).json({
    success: true,
    data: result.data,
    message: `تم رفع ${result.data.length} صورة بنجاح`
  })
}))

// @desc    Upload document
// @route   POST /api/v1/upload/document
// @access  Private
router.post('/document', protect, upload.single('document'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('الملف مطلوب')
  }

  const result = await uploadService.uploadDocument(req.file)

  if (!result.success) {
    res.status(400)
    throw new Error(result.error)
  }

  res.status(201).json({
    success: true,
    data: result.data,
    message: 'تم رفع المستند بنجاح'
  })
}))

// @desc    Upload avatar (for users)
// @route   POST /api/v1/upload/avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('الصورة مطلوبة')
  }

  const result = await uploadService.uploadImage(req.file, {
    quality: 90,
    width: 400,
    height: 400,
    format: 'jpeg'
  })

  if (!result.success) {
    res.status(400)
    throw new Error(result.error)
  }

  res.status(201).json({
    success: true,
    data: result.data,
    message: 'تم رفع الصورة الشخصية بنجاح'
  })
}))

// @desc    Upload portfolio images (for providers)
// @route   POST /api/v1/upload/portfolio
// @access  Private (Providers only)
router.post('/portfolio', protect, requireProvider, upload.array('images', 10), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400)
    throw new Error('الصور مطلوبة')
  }

  const result = await uploadService.uploadMultipleImages(req.files, {
    quality: 85,
    width: 1600,
    height: 1600
  })

  if (!result.success) {
    res.status(400)
    throw new Error(`فشل في رفع بعض الصور: ${result.errors.map(e => e.error).join(', ')}`)
  }

  res.status(201).json({
    success: true,
    data: result.data,
    message: `تم رفع ${result.data.length} صورة للمحفظة بنجاح`
  })
}))

// @desc    Upload verification documents (for providers)
// @route   POST /api/v1/upload/verification
// @access  Private (Providers only)
router.post('/verification', protect, requireProvider, upload.array('documents', 5), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400)
    throw new Error('المستندات مطلوبة')
  }

  const results = []
  const errors = []

  for (const file of req.files) {
    const result = await uploadService.uploadDocument(file)
    if (result.success) {
      results.push(result.data)
    } else {
      errors.push({
        filename: file.originalname,
        error: result.error
      })
    }
  }

  if (errors.length > 0) {
    res.status(400)
    throw new Error(`فشل في رفع بعض المستندات: ${errors.map(e => e.error).join(', ')}`)
  }

  res.status(201).json({
    success: true,
    data: results,
    message: `تم رفع ${results.length} مستند للتحقق بنجاح`
  })
}))

// @desc    Delete uploaded file
// @route   DELETE /api/v1/upload/:filename
// @access  Private
router.delete('/:filename', protect, asyncHandler(async (req, res) => {
  const { deleteUrl } = req.body

  if (!deleteUrl) {
    res.status(400)
    throw new Error('رابط الحذف مطلوب')
  }

  const result = await uploadService.deleteFile(deleteUrl)

  if (!result.success) {
    res.status(400)
    throw new Error(result.error)
  }

  res.json({
    success: true,
    message: result.message
  })
}))

// @desc    Get upload limits and allowed types
// @route   GET /api/v1/upload/info
// @access  Public
router.get('/info', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      maxFileSize: uploadService.maxFileSize,
      maxFiles: 10,
      allowedImageTypes: uploadService.allowedImageTypes,
      allowedDocumentTypes: uploadService.allowedDocumentTypes,
      maxFileSizeMB: uploadService.maxFileSize / (1024 * 1024)
    }
  })
}))

export default router
