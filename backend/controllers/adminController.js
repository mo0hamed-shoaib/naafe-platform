import adminService from '../services/adminService.js';
import UpgradeRequest from '../models/UpgradeRequest.js';
import User from '../models/User.js';

class AdminController {
  /**
   * Get dashboard statistics for admin overview
   * GET /api/admin/stats
   */
  async getDashboardStats(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json({
        success: true,
        data: stats,
        message: 'Dashboard statistics retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
 * List all upgrade requests with filters (status, search)
 * GET /admin/upgrade-requests
 */
  static async getUpgradeRequests(req, res) {
    try {
      const { status, search, page = 1, limit = 20 } = req.query;
      const query = {};
      if (status && status !== 'all') query.status = status;
      // Join with user for search
      let userMatch = {};
      if (search) {
        userMatch = {
          $or: [
            { 'user.name.first': { $regex: search, $options: 'i' } },
            { 'user.name.last': { $regex: search, $options: 'i' } },
            { 'user.email': { $regex: search, $options: 'i' } },
            { 'user.phone': { $regex: search, $options: 'i' } },
          ],
        };
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      // Aggregate to join user info
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        ...(search ? [{ $match: userMatch }] : []),
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ];
      const requests = await UpgradeRequest.aggregate(pipeline);
      const total = await UpgradeRequest.countDocuments(query);
      res.json({
        success: true,
        data: {
          requests,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  /**
   * Accept an upgrade request
   * POST /admin/upgrade-requests/:id/accept
   */
  static async acceptUpgradeRequest(req, res) {
    try {
      const { id } = req.params;
      const request = await UpgradeRequest.findById(id);
      if (!request) return res.status(404).json({ success: false, error: { message: 'الطلب غير موجود' } });
      if (request.status === 'accepted') {
        return res.status(400).json({ success: false, error: { message: 'تم قبول الطلب بالفعل' } });
      }
      // Update user role
      const user = await User.findById(request.userId);
      if (!user) return res.status(404).json({ success: false, error: { message: 'المستخدم غير موجود' } });
      if (!user.roles.includes('provider')) {
        user.roles.push('provider');
        await user.save();
      }
      request.status = 'accepted';
      await request.save();
      res.json({ success: true, data: { request } });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  /**
   * Reject an upgrade request
   * POST /admin/upgrade-requests/:id/reject
   * Body: { rejectionComment }
   */
  static async rejectUpgradeRequest(req, res) {
    try {
      const { id } = req.params;
      const { rejectionComment } = req.body;
      const request = await UpgradeRequest.findById(id);
      if (!request) return res.status(404).json({ success: false, error: { message: 'الطلب غير موجود' } });
      if (request.status === 'accepted') {
        return res.status(400).json({ success: false, error: { message: 'لا يمكن رفض طلب تم قبوله بالفعل' } });
      }
      request.status = 'rejected';
      request.rejectionComment = rejectionComment || '';
      await request.save();
      res.json({ success: true, data: { request } });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export default AdminController; 