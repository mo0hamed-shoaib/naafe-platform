import logger from '../utils/logger.js';

class UploadController {
  /**
   * Upload single image
   * POST /api/upload/image
   */
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No image file provided'
          },
          timestamp: new Date().toISOString()
        });
      }

      logger.info(`Image uploaded: ${req.file.originalname}`);

      // For production (Railway), we need to handle the file differently
      // Since we're using memory storage, we need to either:
      // 1. Save to a cloud storage service (AWS S3, Cloudinary, etc.)
      // 2. Return a temporary URL or base64 data
      
      // For now, let's return the file info with a mock URL
      // In a real implementation, you'd upload to cloud storage
      const imageData = {
        url: `https://example.com/uploads/${req.file.originalname}`,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        data: imageData,
        message: 'Image uploaded successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Image upload error: ${error.message}`);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to upload image'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new UploadController();
