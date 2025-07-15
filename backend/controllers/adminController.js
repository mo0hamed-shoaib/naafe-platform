import adminService from '../services/adminService.js';

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
}

export default new AdminController(); 