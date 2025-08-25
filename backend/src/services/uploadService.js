import axios from 'axios'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

class UploadService {
  constructor() {
    this.imgbbApiKey = process.env.IMGBB_API_KEY
    this.maxFileSize = 5 * 1024 * 1024 // 5MB
    this.allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    this.allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }

  // Validate file
  validateFile(file, allowedTypes = this.allowedImageTypes) {
    if (!file) {
      throw new Error('الملف مطلوب')
    }

    if (file.size > this.maxFileSize) {
      throw new Error('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت')
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('نوع الملف غير مدعوم')
    }

    return true
  }

  // Optimize image
  async optimizeImage(buffer, options = {}) {
    const {
      quality = 80,
      width = 1200,
      height = 1200,
      format = 'jpeg'
    } = options

    try {
      let image = sharp(buffer)

      // Resize if dimensions provided
      if (width || height) {
        image = image.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        })
      }

      // Convert to specified format
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          image = image.jpeg({ quality })
          break
        case 'png':
          image = image.png({ quality })
          break
        case 'webp':
          image = image.webp({ quality })
          break
        default:
          image = image.jpeg({ quality })
      }

      return await image.toBuffer()
    } catch (error) {
      throw new Error('فشل في تحسين الصورة')
    }
  }

  // Upload to ImgBB
  async uploadToImgBB(buffer, filename) {
    if (!this.imgbbApiKey) {
      throw new Error('مفتاح API لـ ImgBB غير متوفر')
    }

    try {
      // Convert buffer to base64
      const base64Image = buffer.toString('base64')

      const formData = new FormData()
      formData.append('image', base64Image)
      formData.append('name', filename)

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${this.imgbbApiKey}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 seconds timeout
        }
      )

      if (response.data.success) {
        return {
          url: response.data.data.url,
          deleteUrl: response.data.data.delete_url,
          thumbnail: response.data.data.thumb?.url || response.data.data.url,
          size: response.data.data.size,
          width: response.data.data.width,
          height: response.data.data.height
        }
      } else {
        throw new Error('فشل في رفع الصورة إلى ImgBB')
      }
    } catch (error) {
      if (error.response?.data?.error?.message) {
        throw new Error(`خطأ في ImgBB: ${error.response.data.error.message}`)
      }
      throw new Error('فشل في رفع الصورة')
    }
  }

  // Upload image
  async uploadImage(file, options = {}) {
    try {
      // Validate file
      this.validateFile(file, this.allowedImageTypes)

      // Generate unique filename
      const fileExtension = file.originalname.split('.').pop()
      const filename = `${uuidv4()}.${fileExtension}`

      // Optimize image
      const optimizedBuffer = await this.optimizeImage(file.buffer, options)

      // Upload to ImgBB
      const uploadResult = await this.uploadToImgBB(optimizedBuffer, filename)

      return {
        success: true,
        data: {
          originalName: file.originalname,
          filename: filename,
          url: uploadResult.url,
          thumbnail: uploadResult.thumbnail,
          deleteUrl: uploadResult.deleteUrl,
          size: uploadResult.size,
          width: uploadResult.width,
          height: uploadResult.height,
          mimetype: file.mimetype,
          uploadedAt: new Date()
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Upload multiple images
  async uploadMultipleImages(files, options = {}) {
    const results = []
    const errors = []

    for (const file of files) {
      const result = await this.uploadImage(file, options)
      if (result.success) {
        results.push(result.data)
      } else {
        errors.push({
          filename: file.originalname,
          error: result.error
        })
      }
    }

    return {
      success: errors.length === 0,
      data: results,
      errors: errors
    }
  }

  // Upload document (for now, we'll use ImgBB for PDFs too)
  async uploadDocument(file) {
    try {
      // Validate file
      this.validateFile(file, this.allowedDocumentTypes)

      // Generate unique filename
      const fileExtension = file.originalname.split('.').pop()
      const filename = `${uuidv4()}.${fileExtension}`

      // For documents, we'll upload directly without optimization
      const uploadResult = await this.uploadToImgBB(file.buffer, filename)

      return {
        success: true,
        data: {
          originalName: file.originalname,
          filename: filename,
          url: uploadResult.url,
          size: uploadResult.size,
          mimetype: file.mimetype,
          uploadedAt: new Date()
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Delete file from ImgBB
  async deleteFile(deleteUrl) {
    try {
      if (!deleteUrl) {
        throw new Error('رابط الحذف مطلوب')
      }

      const response = await axios.delete(deleteUrl, {
        timeout: 10000
      })

      return {
        success: true,
        message: 'تم حذف الملف بنجاح'
      }
    } catch (error) {
      return {
        success: false,
        error: 'فشل في حذف الملف'
      }
    }
  }

  // Get file info
  getFileInfo(file) {
    return {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      isImage: this.allowedImageTypes.includes(file.mimetype),
      isDocument: this.allowedDocumentTypes.includes(file.mimetype)
    }
  }
}

export default new UploadService()
