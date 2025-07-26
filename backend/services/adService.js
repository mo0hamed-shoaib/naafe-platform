import Ad from '../models/Ad.js';
import User from '../models/User.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

class AdService {
  /**
   * Create a new advertisement
   */
  async createAd(adData, userId) {
    try {
      // Calculate end date based on duration
      const startDate = new Date();
      let endDate = new Date();
      
      switch (adData.duration) {
        case 'daily':
          endDate.setDate(startDate.getDate() + 1);
          break;
        case 'weekly':
          endDate.setDate(startDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setMonth(startDate.getMonth() + 1);
          break;
        default:
          throw new Error('Invalid duration');
      }

      // Get pricing based on type and duration
      const pricing = this.getPricing(adData.type, adData.duration);
      
      const ad = new Ad({
        ...adData,
        advertiserId: userId,
        startDate,
        endDate,
        budget: {
          total: pricing,
          spent: 0,
          currency: 'EGP'
        }
      });

      await ad.save();
      return ad;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get pricing for ad types and durations
   */
  getPricing(type, duration) {
    const pricing = {
      featured: { daily: 25, weekly: 150, monthly: 500 },
      sidebar: { daily: 15, weekly: 90, monthly: 300 },
      banner: { daily: 35, weekly: 200, monthly: 750 }
    };
    
    return pricing[type]?.[duration] || 0;
  }

  /**
   * Create Stripe checkout session for ad purchase
   */
  async createCheckoutSession(adId, userId) {
    try {
      const ad = await Ad.findById(adId).populate('advertiserId', 'email name');
      
      if (!ad) {
        throw new Error('Ad not found');
      }

      if (ad.advertiserId._id.toString() !== userId.toString()) {
        throw new Error('Unauthorized');
      }

      // Convert amount to cents (same pattern as paymentController)
      const amountInCents = Math.round(ad.budget.total * 100);
      
      // Ensure minimum amount for Stripe (50 cents = $0.50)
      const minimumAmountInCents = 50;
      const finalAmountInCents = Math.max(amountInCents, minimumAmountInCents);

      console.log('Ad checkout amount calculation:', {
        originalAmount: ad.budget.total,
        amountInCents,
        minimumAmountInCents,
        finalAmountInCents
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `إعلان ${ad.type === 'featured' ? 'مميز' : ad.type === 'sidebar' ? 'جانبي' : 'بانر'}`,
                description: ad.description,
              },
              unit_amount: finalAmountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/advertise?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/advertise?canceled=true`,
        metadata: {
          adId: adId.toString(),
          userId: userId.toString(),
          type: ad.type,
          duration: ad.duration,
          originalCurrency: 'EGP',
          originalAmount: ad.budget.total.toString(),
          convertedAmount: finalAmountInCents.toString()
        },
        customer_email: ad.advertiserId.email,
      });

      // Update ad with session ID
      ad.stripeSessionId = session.id;
      await ad.save();

      return {
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get active ads for display
   */
  async getActiveAds(filters = {}) {
    try {
      const query = {
        status: 'active',
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      };

      // Add type filter
      if (filters.type) {
        query['placement.type'] = filters.type;
      }

      // Add location targeting
      if (filters.location) {
        query['placement.location'] = filters.location;
      }

      // Add category targeting
      if (filters.category) {
        query['targeting.categories'] = { $in: [filters.category] };
      }

      // Add limit
      const limit = filters.limit ? parseInt(filters.limit) : 10;

      const ads = await Ad.find(query)
        .populate('advertiserId', 'name avatarUrl')
        .sort({ createdAt: -1 })
        .limit(limit);

      return ads;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's ads
   */
  async getUserAds(userId, filters = {}) {
    try {
      const query = { advertiserId: userId };

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.type) {
        query.type = filters.type;
      }

      const ads = await Ad.find(query)
        .sort({ createdAt: -1 })
        .populate('advertiserId', 'name email');

      return ads;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update ad status
   */
  async updateAdStatus(adId, userId, status, adminNotes = null) {
    try {
      const ad = await Ad.findById(adId);
      
      if (!ad) {
        throw new Error('Ad not found');
      }

      // Check if user is admin or ad owner
      const user = await User.findById(userId);
      const isAdmin = user && user.roles.includes('admin');
      const isOwner = ad.advertiserId.toString() === userId.toString();

      if (!isAdmin && !isOwner) {
        throw new Error('Unauthorized');
      }

      ad.status = status;
      
      if (adminNotes) {
        ad.adminNotes = adminNotes;
      }

      if (status === 'rejected' && !isOwner) {
        ad.rejectionReason = adminNotes;
      }

      await ad.save();
      return ad;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Track ad impression
   */
  async trackImpression(adId) {
    try {
      const ad = await Ad.findById(adId);
      if (ad && ad.isActive()) {
        await ad.incrementImpressions();
      }
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  /**
   * Track ad click
   */
  async trackClick(adId) {
    try {
      const ad = await Ad.findById(adId);
      if (ad && ad.isActive()) {
        await ad.incrementClicks();
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  /**
   * Get ad statistics
   */
  async getAdStats(userId) {
    try {
      const stats = await Ad.aggregate([
        { $match: { advertiserId: userId } },
        {
          $group: {
            _id: null,
            totalAds: { $sum: 1 },
            totalSpent: { $sum: '$budget.spent' },
            totalImpressions: { $sum: '$performance.impressions' },
            totalClicks: { $sum: '$performance.clicks' },
            activeAds: {
              $sum: {
                $cond: [
                  { $eq: ['$status', 'active'] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]);

      return stats[0] || {
        totalAds: 0,
        totalSpent: 0,
        totalImpressions: 0,
        totalClicks: 0,
        activeAds: 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle webhook for ad payment completion
   */
  async handlePaymentCompletion(session) {
    try {
      const adId = session.metadata?.adId;
      if (!adId) return;

      const ad = await Ad.findById(adId);
      if (!ad) return;

      ad.status = 'active';
      ad.stripePaymentIntentId = session.payment_intent;
      await ad.save();

      console.log(`Ad ${adId} payment completed and activated`);
    } catch (error) {
      console.error('Error handling ad payment completion:', error);
    }
  }

  /**
   * Calculate refund amount for ad cancellation
   */
  calculateRefundAmount(ad, cancellationDate) {
    const now = new Date(cancellationDate);
    const startDate = new Date(ad.startDate);
    const endDate = new Date(ad.endDate);
    const totalAmount = ad.budget.total;
    
    // Calculate days since ad started
    const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    let refundAmount = 0;
    let refundType = 'none';
    
    switch (ad.duration) {
      case 'daily':
        // Full refund before live, none after
        if (daysSinceStart < 0) {
          refundAmount = totalAmount;
          refundType = 'full';
        }
        break;
        
      case 'weekly':
        // Full refund within 24h, 75% within 3 days, none after
        if (daysSinceStart <= 1) {
          refundAmount = totalAmount;
          refundType = 'full';
        } else if (daysSinceStart <= 3) {
          refundAmount = Math.round(totalAmount * 0.75);
          refundType = 'partial';
        }
        break;
        
      case 'monthly':
        // Full refund within 3 days, 75% within 7 days, prorated after
        if (daysSinceStart <= 3) {
          refundAmount = totalAmount;
          refundType = 'full';
        } else if (daysSinceStart <= 7) {
          refundAmount = Math.round(totalAmount * 0.75);
          refundType = 'partial';
        } else if (daysSinceStart <= 15) {
          // Prorated refund for remaining days
          const remainingDays = totalDays - daysSinceStart;
          const dailyRate = totalAmount / totalDays;
          refundAmount = Math.round(remainingDays * dailyRate);
          refundType = 'prorated';
        }
        break;
    }
    
    return { refundAmount, refundType, daysSinceStart };
  }

  /**
   * Cancel ad and process refund
   */
  async cancelAd(adId, userId) {
    try {
      const ad = await Ad.findById(adId);
      if (!ad) {
        throw new Error('Ad not found');
      }

      // Check authorization
      if (ad.advertiserId.toString() !== userId.toString()) {
        throw new Error('Unauthorized');
      }

      // Calculate refund
      const { refundAmount, refundType, daysSinceStart } = this.calculateRefundAmount(ad, new Date());

      // Update ad status
      ad.status = 'cancelled';
      await ad.save();

      // Process refund if eligible
      let refundResult = null;
      if (refundAmount > 0 && ad.stripePaymentIntentId) {
        try {
          const refund = await stripe.refunds.create({
            payment_intent: ad.stripePaymentIntentId,
            amount: Math.round(refundAmount * 100), // Convert to cents
            metadata: {
              adId: adId.toString(),
              userId: userId.toString(),
              refundType,
              daysSinceStart: daysSinceStart.toString()
            }
          });
          
          refundResult = {
            refundId: refund.id,
            amount: refundAmount,
            type: refundType,
            status: refund.status
          };
        } catch (refundError) {
          console.error('Error processing refund:', refundError);
          throw new Error('Failed to process refund');
        }
      }

      return {
        success: true,
        ad: ad,
        refund: refundResult,
        message: refundType === 'none' 
          ? 'تم إلغاء الإعلان. لا يوجد استرداد لأن فترة السماح انتهت.'
          : refundType === 'full'
            ? `تم إلغاء الإعلان واسترداد كامل (${refundAmount} جنيه).`
            : `تم إلغاء الإعلان واسترداد جزئي (${refundAmount} جنيه).`
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AdService(); 