import express from 'express';
import uploadMiddleware from './middlewares/upload.js';
import { authenticateToken } from './middlewares/auth.middleware.js';
import userController from './controllers/userController.js';

const app = express();

// Test route
app.post('/test-upload', authenticateToken, uploadMiddleware.uploadSingle('image'), userController.uploadImage);

console.log('✅ Upload middleware and controller imported successfully');
console.log('✅ Test server setup complete');

export default app;
