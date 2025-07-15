import User from '../models/User.js';
import ServiceListing from '../models/ServiceListing.js';
import Offer from '../models/Offer.js';
import JobRequest from '../models/JobRequest.js';
import Category from '../models/Category.js';

class AdminService {
  /**
   * Get dashboard statistics for admin overview
   */
  async getDashboardStats() {
    // Total users
    const totalUsers = await User.countDocuments();
    // Active services
    const activeServices = await ServiceListing.countDocuments({ status: 'active' });
    // Monthly revenue (sum of accepted offers in the last 30 days)
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setDate(now.getDate() - 30);
    const monthlyRevenueAgg = await Offer.aggregate([
      { $match: { status: 'accepted', updatedAt: { $gte: monthAgo } } },
      { $group: { _id: null, total: { $sum: '$price.amount' } } }
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;
    // User growth (users registered in last 30 days)
    const userGrowth = await User.countDocuments({ createdAt: { $gte: monthAgo } });
    // Service growth (services created in last 30 days)
    const serviceGrowth = await ServiceListing.countDocuments({ createdAt: { $gte: monthAgo } });
    // Revenue growth (revenue in last 30 days vs previous 30 days)
    const prevMonthAgo = new Date(monthAgo);
    prevMonthAgo.setDate(monthAgo.getDate() - 30);
    const prevMonthlyRevenueAgg = await Offer.aggregate([
      { $match: { status: 'accepted', updatedAt: { $gte: prevMonthAgo, $lt: monthAgo } } },
      { $group: { _id: null, total: { $sum: '$price.amount' } } }
    ]);
    const prevMonthlyRevenue = prevMonthlyRevenueAgg[0]?.total || 0;
    const revenueGrowth = prevMonthlyRevenue === 0 ? 0 : ((monthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue) * 100;
    return {
      totalUsers,
      activeServices,
      monthlyRevenue,
      userGrowth,
      serviceGrowth,
      revenueGrowth: Math.round(revenueGrowth)
    };
  }
}

export default new AdminService(); 