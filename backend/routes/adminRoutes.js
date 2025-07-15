import express from 'express';
import adminController from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/admin/stats - Admin dashboard stats
router.get('/stats', authenticateToken, requireRole(['admin']), adminController.getDashboardStats);

export default router; 