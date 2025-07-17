import express from 'express';
import AdminController from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

const adminController = new AdminController();

// GET /api/admin/stats - Admin dashboard stats
router.get('/stats', authenticateToken, requireRole(['admin']), adminController.getDashboardStats.bind(adminController));

// Upgrade Requests
router.get('/upgrade-requests', authenticateToken, requireRole(['admin']), AdminController.getUpgradeRequests);
router.post('/upgrade-requests/:id/accept', authenticateToken, requireRole(['admin']), AdminController.acceptUpgradeRequest);
router.post('/upgrade-requests/:id/reject', authenticateToken, requireRole(['admin']), AdminController.rejectUpgradeRequest);

// User submits an upgrade request (with attachments)
router.post('/upgrade-requests', authenticateToken, requireRole(['admin', 'seeker']), upload.uploadUpgradeAttachments, async (req, res) => {
  try {
    const { user } = req;
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ success: false, error: { message: 'يجب رفع ملف واحد على الأقل' } });
    }
    const attachments = files.map(f => `/uploads/${f.filename}`);
    const UpgradeRequest = (await import('../models/UpgradeRequest.js')).default;
    // Check for existing pending request
    const existing = await UpgradeRequest.findOne({ userId: user._id, status: 'pending' });
    // Enforce max 3 requests per user
    const totalRequests = await UpgradeRequest.countDocuments({ userId: user._id });
    if (totalRequests >= 3) {
      return res.status(400).json({ success: false, error: { message: 'لقد وصلت إلى الحد الأقصى لعدد محاولات الترقية (3 مرات)' } });
    }
    if (existing) {
      return res.status(400).json({ success: false, error: { message: 'لديك طلب ترقية قيد الانتظار بالفعل' }, data: { request: existing } });
    }
    const newRequest = await UpgradeRequest.create({
      userId: user._id,
      attachments,
      status: 'pending',
    });
    res.json({ success: true, data: { request: newRequest } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router; 