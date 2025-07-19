import paymobService from '../services/paymobService.js';
import socketService from '../services/socketService.js';
import JobRequest from '../models/JobRequest.js';
import Offer from '../models/Offer.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { logger } from '../middlewares/logging.middleware.js';

class PaymentController {
  /**
   * Create payment order
   */
  async createPaymentOrder(req, res) {
    try {
      const { jobRequestId, offerId } = req.body;
      const seekerId = req.user.id;

      // Validate input
      if (!jobRequestId || !offerId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Job request ID and offer ID are required'
          }
        });
      }

      // Get job request and offer details
      const jobRequest = await JobRequest.findById(jobRequestId)
        .populate('seeker', 'name email phone');
      
      if (!jobRequest) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'JOB_REQUEST_NOT_FOUND',
            message: 'Job request not found'
          }
        });
      }

      // Verify seeker owns the job request
      if (jobRequest.seeker._id.toString() !== seekerId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You can only pay for your own job requests'
          }
        });
      }

      const offer = await Offer.findById(offerId)
        .populate('provider', 'name email phone');
      
      if (!offer) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'OFFER_NOT_FOUND',
            message: 'Offer not found'
          }
        });
      }

      // Verify offer belongs to the job request
      if (offer.jobRequest.toString() !== jobRequestId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_OFFER',
            message: 'Offer does not belong to this job request'
          }
        });
      }

      // Verify offer is accepted
      if (offer.status !== 'accepted') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'OFFER_NOT_ACCEPTED',
            message: 'Can only pay for accepted offers'
          }
        });
      }

      // Calculate amounts
      const amount = offer.budget.max; // Use max budget as final amount
      const commission = Math.round(amount * 0.10); // 10% commission
      const totalAmount = amount + commission;

      // Generate unique order ID
      const orderId = `NAAFE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Prepare payment data
      const paymentData = {
        orderId,
        jobRequestId,
        offerId,
        seekerId,
        providerId: offer.provider._id,
        amount,
        commission,
        totalAmount,
        currency: offer.budget.currency,
        jobTitle: jobRequest.title,
        seekerEmail: jobRequest.seeker.email,
        seekerFirstName: jobRequest.seeker.name.first,
        seekerLastName: jobRequest.seeker.name.last,
        seekerPhone: jobRequest.seeker.phone
      };

      // Process payment with Paymob
      const paymentResult = await paymobService.processPayment(paymentData);

      // Update job request status to in_progress
      await JobRequest.findByIdAndUpdate(jobRequestId, {
        status: 'in_progress',
        assignedTo: offer.provider._id
      });

      // Create notifications
      const seekerNotification = new Notification({
        userId: seekerId,
        type: 'payment_initiated',
        message: `تم بدء عملية الدفع للخدمة: ${jobRequest.title}`,
        relatedJobId: jobRequestId,
        isRead: false
      });
      await seekerNotification.save();

      const providerNotification = new Notification({
        userId: offer.provider._id,
        type: 'payment_initiated',
        message: `تم بدء عملية الدفع للخدمة: ${jobRequest.title}`,
        relatedJobId: jobRequestId,
        isRead: false
      });
      await providerNotification.save();

      // Emit socket events
      socketService.emitToUser(seekerId, 'payment:initiated', {
        jobRequestId,
        orderId: paymentResult.payment.orderId,
        amount: paymentResult.payment.totalAmount
      });

      socketService.emitToUser(offer.provider._id, 'payment:initiated', {
        jobRequestId,
        orderId: paymentResult.payment.orderId,
        amount: paymentResult.payment.amount
      });

      res.status(200).json({
        success: true,
        data: {
          orderId: paymentResult.payment.orderId,
          iframeUrl: paymentResult.iframeUrl,
          paymentKey: paymentResult.paymentKey,
          amount: paymentResult.payment.amount,
          commission: paymentResult.payment.commission,
          totalAmount: paymentResult.payment.totalAmount,
          currency: paymentResult.payment.currency
        },
        message: 'Payment order created successfully'
      });

    } catch (error) {
      logger.error('Payment order creation error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: 'Failed to create payment order'
        }
      });
    }
  }

  /**
   * Create test payment order (for testing only)
   */
  async createTestPaymentOrder(req, res) {
    try {
      const { jobRequestId, offerId } = req.body;

      // Validate input
      if (!jobRequestId || !offerId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Job request ID and offer ID are required'
          }
        });
      }

      // Use test data for development
      const amount = 500;
      const commission = 50;
      const totalAmount = 550;

      // Generate unique order ID
      const orderId = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Prepare payment data
      const paymentData = {
        orderId,
        jobRequestId: '507f1f77bcf86cd799439011',
        offerId: '507f1f77bcf86cd799439012',
        seekerId: '507f1f77bcf86cd799439013',
        providerId: '507f1f77bcf86cd799439014',
        amount,
        commission,
        totalAmount,
        currency: 'EGP',
        jobTitle: 'خدمة تجريبية - اختبار الدفع',
        seekerEmail: 'test@example.com',
        seekerFirstName: 'Test',
        seekerLastName: 'User',
        seekerPhone: '+201234567890'
      };

      // Process payment with Paymob
      const paymentResult = await paymobService.processPayment(paymentData);

      res.status(200).json({
        success: true,
        data: {
          orderId: paymentResult.payment.orderId,
          iframeUrl: paymentResult.iframeUrl,
          paymentKey: paymentResult.paymentKey,
          amount: paymentResult.payment.amount,
          commission: paymentResult.payment.commission,
          totalAmount: paymentResult.payment.totalAmount,
          currency: paymentResult.payment.currency
        },
        message: 'Test payment order created successfully'
      });

    } catch (error) {
      logger.error('Test payment order creation error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: 'Failed to create test payment order'
        }
      });
    }
  }

  /**
   * Handle Paymob webhook
   */
  async handleWebhook(req, res) {
    try {
      const {
        type,
        obj: {
          id: transactionId,
          amount_cents,
          currency,
          order: { id: paymobOrderId },
          hmac
        }
      } = req.body;

      logger.info(`Paymob webhook received: ${type} for transaction ${transactionId}`);

      // Verify HMAC signature
      const isValidHmac = paymobService.verifyHmacSignature(
        hmac,
        transactionId,
        amount_cents,
        currency,
        paymobOrderId
      );

      if (!isValidHmac) {
        logger.error('Invalid HMAC signature in webhook');
        return res.status(400).json({ error: 'Invalid signature' });
      }

      // Find payment by Paymob order ID
      const payment = await paymobService.getPaymentByOrderId(paymobOrderId);
      
      if (!payment) {
        logger.error(`Payment not found for Paymob order: ${paymobOrderId}`);
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Handle different webhook types
      switch (type) {
        case 'TRANSACTION':
          await this.handleTransactionWebhook(payment, req.body);
          break;
        case 'TOKEN':
          // Handle token webhook if needed
          break;
        default:
          logger.info(`Unhandled webhook type: ${type}`);
      }

      res.status(200).json({ success: true });

    } catch (error) {
      logger.error('Webhook handling error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  /**
   * Handle transaction webhook
   */
  async handleTransactionWebhook(payment, webhookData) {
    try {
      const { success, pending, is_void, is_refunded, is_3d_secure, is_captured } = webhookData.obj;

      let status = 'pending';
      let failureReason = null;

      if (success && is_captured) {
        status = 'completed';
      } else if (is_void || is_refunded) {
        status = 'cancelled';
        failureReason = is_void ? 'Payment voided' : 'Payment refunded';
      } else if (!success) {
        status = 'failed';
        failureReason = webhookData.obj.error_occured || 'Payment failed';
      }

      // Update payment status
      const updatedPayment = await paymobService.updatePaymentStatus(
        payment.orderId,
        status,
        webhookData.obj
      );

      // Update job request status if payment completed
      if (status === 'completed') {
        await JobRequest.findByIdAndUpdate(payment.jobRequestId, {
          status: 'completed',
          'completionProof.completedAt': new Date()
        });
      }

      // Create notifications
      const seekerNotification = new Notification({
        userId: payment.seeker._id,
        type: status === 'completed' ? 'payment_completed' : 'payment_failed',
        message: status === 'completed' 
          ? `تم إتمام الدفع بنجاح للخدمة: ${payment.jobRequestId.title}`
          : `فشل في إتمام الدفع للخدمة: ${payment.jobRequestId.title}`,
        relatedJobId: payment.jobRequestId._id,
        isRead: false
      });
      await seekerNotification.save();

      const providerNotification = new Notification({
        userId: payment.provider._id,
        type: status === 'completed' ? 'payment_completed' : 'payment_failed',
        message: status === 'completed'
          ? `تم إتمام الدفع بنجاح للخدمة: ${payment.jobRequestId.title}`
          : `فشل في إتمام الدفع للخدمة: ${payment.jobRequestId.title}`,
        relatedJobId: payment.jobRequestId._id,
        isRead: false
      });
      await providerNotification.save();

      // Emit socket events
      const eventType = status === 'completed' ? 'payment:completed' : 'payment:failed';
      
      socketService.emitToUser(payment.seeker._id, eventType, {
        jobRequestId: payment.jobRequestId._id,
        orderId: payment.orderId,
        amount: payment.totalAmount,
        status
      });

      socketService.emitToUser(payment.provider._id, eventType, {
        jobRequestId: payment.jobRequestId._id,
        orderId: payment.orderId,
        amount: payment.amount,
        status
      });

      logger.info(`Payment ${status}: ${payment.orderId}`);

    } catch (error) {
      logger.error('Transaction webhook handling error:', error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.id;

      const payment = await paymobService.getPaymentByOrderId(orderId);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'PAYMENT_NOT_FOUND',
            message: 'Payment not found'
          }
        });
      }

      // Verify user has access to this payment
      if (payment.seeker._id.toString() !== userId && payment.provider._id.toString() !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You do not have access to this payment'
          }
        });
      }

      res.status(200).json({
        success: true,
        data: {
          orderId: payment.orderId,
          status: payment.status,
          amount: payment.amount,
          commission: payment.commission,
          totalAmount: payment.totalAmount,
          currency: payment.currency,
          completedAt: payment.completedAt,
          failureReason: payment.failureReason
        },
        message: 'Payment status retrieved successfully'
      });

    } catch (error) {
      logger.error('Get payment status error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: 'Failed to get payment status'
        }
      });
    }
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;

      const payments = await Payment.find({
        $or: [{ seeker: userId }, { provider: userId }]
      })
        .populate('jobRequestId', 'title')
        .populate('offerId', 'budget')
        .populate('seeker', 'name')
        .populate('provider', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Payment.countDocuments({
        $or: [{ seeker: userId }, { provider: userId }]
      });

      res.status(200).json({
        success: true,
        data: {
          payments,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        },
        message: 'Payment history retrieved successfully'
      });

    } catch (error) {
      logger.error('Get payment history error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: 'Failed to get payment history'
        }
      });
    }
  }
}

export default new PaymentController(); 