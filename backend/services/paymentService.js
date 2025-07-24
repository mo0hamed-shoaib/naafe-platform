import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import Conversation from '../models/Conversation.js';
import JobRequest from '../models/JobRequest.js';
import User from '../models/User.js';
import Offer from '../models/Offer.js';
import offerService from './offerService.js';

export const getPaymentBySessionId = async (sessionId) => {
  try {
    const payment = await Payment.findBySessionId(sessionId)
      .populate('conversationId')
      .populate('jobRequestId')
      .populate('offerId')
      .populate('seekerId', 'name email')
      .populate('providerId', 'name email');
    
    return { success: true, data: payment };
  } catch (error) {
    console.error('Error getting payment by session ID:', error);
    return { success: false, error: error.message };
  }
};

export const getPaymentsByConversation = async (conversationId, userId) => {
  try {
    // Verify user has access to this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return { success: false, error: 'المحادثة غير موجودة' };
    }

    const isSeeker = conversation.participants.seeker.toString() === userId;
    const isProvider = conversation.participants.provider.toString() === userId;

    if (!isSeeker && !isProvider) {
      return { success: false, error: 'غير مصرح لك بالوصول لهذه المحادثة' };
    }

    const payments = await Payment.findByConversation(conversationId)
      .populate('seekerId', 'name email')
      .populate('providerId', 'name email')
      .populate('offerId');

    return { success: true, data: payments };
  } catch (error) {
    console.error('Error getting payments by conversation:', error);
    return { success: false, error: error.message };
  }
};

export const getUserPayments = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const payments = await Payment.find({
      $or: [
        { seekerId: userId },
        { providerId: userId }
      ]
    })
    .populate('conversationId')
    .populate('jobRequestId')
    .populate('offerId')
    .populate('seekerId', 'name email')
    .populate('providerId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Payment.countDocuments({
      $or: [
        { seekerId: userId },
        { providerId: userId }
      ]
    });

    return {
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };
  } catch (error) {
    console.error('Error getting user payments:', error);
    return { success: false, error: error.message };
  }
};

export const getPaymentStats = async (userId) => {
  try {
    const stats = await Payment.aggregate([
      {
        $match: {
          $or: [
            { seekerId: new mongoose.Types.ObjectId(userId) },
            { providerId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalPayments = stats.reduce((acc, stat) => acc + stat.count, 0);
    const totalAmount = stats.reduce((acc, stat) => acc + stat.totalAmount, 0);

    return {
      success: true,
      data: {
        stats,
        totalPayments,
        totalAmount: totalAmount / 100 // Convert from cents
      }
    };
  } catch (error) {
    console.error('Error getting payment stats:', error);
    return { success: false, error: error.message };
  }
};

export const validateEscrowPaymentRequest = async (offerId, userId, amount) => {
  try {
    // Find the offer and check all validation rules
    const offer = await Offer.findById(offerId)
      .populate('jobRequest')
      .populate('conversation');

    if (!offer) {
      return { success: false, error: 'العرض غير موجود' };
    }

    // Check if user is the seeker
    if (offer.jobRequest.seeker.toString() !== userId) {
      return { success: false, error: 'فقط طالب الخدمة يمكنه إنشاء الدفع' };
    }

    // Check if offer is accepted (proper status for escrow)
    if (offer.status !== 'accepted') {
      return { success: false, error: 'يمكن إجراء الدفع فقط للعروض المقبولة' };
    }

    // Check if offer already has a payment
    if (offer.payment && offer.payment.paymentId) {
      const existingPayment = await Payment.findById(offer.payment.paymentId);
      if (existingPayment && ['pending', 'escrowed'].includes(existingPayment.status)) {
        return { success: false, error: 'يوجد دفع بالفعل لهذا العرض' };
      }
    }

    // Check if negotiation is complete with agreed price
    if (!offer.negotiation || !offer.negotiation.price) {
      return { success: false, error: 'يجب الاتفاق على السعر قبل الدفع' };
    }

    // Validate amount matches negotiated price
    if (!amount || amount <= 0) {
      return { success: false, error: 'المبلغ غير صحيح' };
    }

    // Make sure the payment amount matches the negotiated price
    if (Math.abs(amount - offer.negotiation.price) > 1) { // Allow small rounding differences
      return { success: false, error: 'المبلغ لا يتطابق مع السعر المتفق عليه' };
    }

    return { 
      success: true, 
      data: { 
        offer,
        conversation: offer.conversation,
        jobRequest: offer.jobRequest
      }
    };
  } catch (error) {
    console.error('Error validating escrow payment request:', error);
    return { success: false, error: error.message };
  }
};

export const handleEscrowPaymentCompletion = async (session) => {
  try {
    const payment = await Payment.findOne({ stripeSessionId: session.id });
    if (!payment) {
      console.error('Payment record not found for session:', session.id);
      return { success: false, error: 'Payment record not found' };
    }

    // Mark payment as escrowed
    payment.status = 'escrowed';
    payment.stripePaymentIntentId = session.payment_intent;
    payment.escrow.status = 'held';
    payment.escrow.heldAt = new Date();
    await payment.save();

    // Update offer payment status and move to in_progress
    const result = await offerService.processEscrowPayment(payment.offerId, payment._id);

    return { success: true, payment, offer: result };
  } catch (error) {
    console.error('Error handling escrow payment completion:', error);
    return { success: false, error: error.message };
  }
};

export const releaseFundsFromEscrow = async (paymentId, userId) => {
  try {
    const payment = await Payment.findById(paymentId)
      .populate({
        path: 'offerId',
        populate: {
          path: 'jobRequest'
        }
      });

    if (!payment) {
      return { success: false, error: 'الدفع غير موجود' };
    }

    // Check if payment is in escrow
    if (payment.status !== 'escrowed' || payment.escrow.status !== 'held') {
      return { success: false, error: 'المبلغ غير موجود في الضمان' };
    }

    // Check authorization - only the seeker who made the payment can release funds
    if (payment.seekerId.toString() !== userId) {
      return { success: false, error: 'غير مصرح لك بتحرير الأموال من الضمان' };
    }

    // Update offer and release funds
    await offerService.markServiceCompleted(payment.offerId._id, userId);

    return { success: true, message: 'تم تحرير الأموال من الضمان بنجاح' };
  } catch (error) {
    console.error('Error releasing funds from escrow:', error);
    return { success: false, error: error.message };
  }
};

export const requestCancellation = async (offerId, userId, reason) => {
  try {
    const result = await offerService.requestCancellation(offerId, userId, reason);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error requesting cancellation:', error);
    return { success: false, error: error.message };
  }
};

export const processCancellation = async (offerId, adminId = null) => {
  try {
    const result = await offerService.processCancellation(offerId, adminId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error processing cancellation:', error);
    return { success: false, error: error.message };
  }
}; 