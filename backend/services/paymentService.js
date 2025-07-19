import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import Conversation from '../models/Conversation.js';
import JobRequest from '../models/JobRequest.js';
import User from '../models/User.js';

export const getPaymentBySessionId = async (sessionId) => {
  try {
    const payment = await Payment.findBySessionId(sessionId)
      .populate('conversationId')
      .populate('jobRequestId')
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
      .populate('providerId', 'name email');

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

export const validatePaymentRequest = async (conversationId, userId, amount) => {
  try {
    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId)
      .populate('jobRequestId');

    if (!conversation) {
      return { success: false, error: 'المحادثة غير موجودة' };
    }

    // Check if user is the seeker
    if (conversation.participants.seeker.toString() !== userId) {
      return { success: false, error: 'فقط طالب الخدمة يمكنه إنشاء الدفع' };
    }

    // Check if job request is in progress
    if (conversation.jobRequestId.status !== 'in_progress') {
      return { success: false, error: 'لا يمكن إنشاء الدفع إلا للخدمات قيد التنفيذ' };
    }

    // Check if payment already exists and is pending
    const existingPayment = await Payment.findOne({
      conversationId,
      status: 'pending'
    });

    if (existingPayment) {
      return { success: false, error: 'يوجد دفع معلق بالفعل لهذه المحادثة' };
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return { success: false, error: 'المبلغ غير صحيح' };
    }

    return { success: true, data: { conversation } };
  } catch (error) {
    console.error('Error validating payment request:', error);
    return { success: false, error: error.message };
  }
}; 