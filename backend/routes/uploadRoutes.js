import express from 'express';
import uploadController from '../controllers/uploadController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.js';

const router = express.Router();

// Upload single image
router.post('/image', authenticateToken, uploadSingle('image'), uploadController.uploadImage);

export default router;
