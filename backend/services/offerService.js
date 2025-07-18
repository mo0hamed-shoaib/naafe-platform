import Offer from '../models/Offer.js';
import JobRequest from '../models/JobRequest.js';
import User from '../models/User.js';
import chatService from './chatService.js';
import Notification from '../models/Notification.js';
import socketService from './socketService.js';
import { logger } from '../middlewares/logging.middleware.js';

class OfferService {
  // Create a new offer
  async createOffer(jobRequestId, providerId, offerData) {
    try {
      // Validate job request exists and is open
      const jobRequest = await JobRequest.findById(jobRequestId);
      if (!jobRequest) {
        throw new Error('Job request not found');
      }
      
      if (jobRequest.status !== 'open') {
        throw new Error('Can only make offers on open job requests');
      }
      
      // Validate provider exists and is a provider
      const provider = await User.findById(providerId);
      if (!provider || !provider.roles.includes('provider')) {
        throw new Error('Invalid provider');
      }
      
      // Check if provider already made an offer
      const existingOffer = await Offer.findOne({
        jobRequest: jobRequestId,
        provider: providerId,
        status: { $in: ['pending', 'accepted'] }
      });
      
      if (existingOffer) {
        throw new Error('Provider already made an offer on this job');
      }
      
      // Validate price is within budget
      if (offerData.budget.min < jobRequest.budget.min || 
          offerData.budget.max > jobRequest.budget.max) {
        throw new Error('Price must be within the job request budget range');
      }
      
      const offer = new Offer({
        jobRequest: jobRequestId,
        provider: providerId,
        budget: offerData.budget,
        message: offerData.message,
        estimatedTimeDays: offerData.estimatedTimeDays,
        availableDates: offerData.availableDates || [],
        timePreferences: offerData.timePreferences || [],
        status: 'pending'
      });
      
      await offer.save();
      
      // Populate provider and job request details
      await offer.populate([
        { path: 'provider', select: 'name email phone' },
        { path: 'jobRequest', select: 'title description budget deadline seeker' }
      ]);
      
      // --- Notification logic for new offer ---
      try {
        const provider = await User.findById(providerId).select('name.first name.last');
        const providerName = provider ? `${provider.name.first} ${provider.name.last}` : 'مقدم خدمة';
        
        const notification = new Notification({
          userId: offer.jobRequest.seeker,
          type: 'offer_received',
          message: `${providerName} أرسل لك عرض جديد على طلبك "${offer.jobRequest.title}"`,
          relatedChatId: null, // No chat yet, will be created when offer is accepted
          isRead: false
        });
        await notification.save();

        // Emit Socket.IO event to seeker's room
        socketService.io.to(`user:${offer.jobRequest.seeker}`).emit('notify:offerReceived', {
          notification: {
            _id: notification._id,
            type: notification.type,
            message: notification.message,
            relatedChatId: notification.relatedChatId,
            isRead: notification.isRead,
            createdAt: notification.createdAt
          }
        });

        logger.info(`Notification created for new offer: ${notification._id}`);
      } catch (error) {
        logger.error('Error creating notification for new offer:', error);
        // Don't throw error here as the offer was already created successfully
      }
      // --- End notification logic ---
      
      return offer;
    } catch (error) {
      throw error;
    }
  }
  
  // Get offers for a specific job request
  async getOffersByJobRequest(jobRequestId, filters = {}) {
    try {
      const query = { jobRequest: jobRequestId };
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      const offers = await Offer.find(query)
        .populate('provider', 'name email phone rating reviewCount')
        .sort({ createdAt: -1 });
      
      return offers;
    } catch (error) {
      throw error;
    }
  }
  
  // Get all offers with role-based filtering
  async getAllOffers(userId, userRoles, filters = {}) {
    try {
      let query = {};
      
      // Role-based filtering
      if (userRoles.includes('provider')) {
        // Providers can see their own offers
        query.provider = userId;
      } else if (userRoles.includes('seeker')) {
        // Seekers can see offers on their job requests
        const userJobRequests = await JobRequest.find({ seeker: userId }).select('_id');
        const jobRequestIds = userJobRequests.map(jr => jr._id);
        query.jobRequest = { $in: jobRequestIds };
      } else if (!userRoles.includes('admin')) {
        // Non-admin users can only see their own offers
        query.provider = userId;
      }
      
      // Additional filters
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.jobRequest) {
        query.jobRequest = filters.jobRequest;
      }
      
      if (filters.provider) {
        query.provider = filters.provider;
      }
      
      const offers = await Offer.find(query)
        .populate('provider', 'name email phone rating reviewCount')
        .populate('jobRequest', 'title description budget deadline status')
        .sort({ createdAt: -1 });
      
      return offers;
    } catch (error) {
      throw error;
    }
  }
  
  // Get a specific offer by ID
  async getOfferById(offerId, userId = null) {
    try {
      const offer = await Offer.findById(offerId)
        .populate('provider', 'name email phone rating reviewCount')
        .populate('jobRequest', 'title description budget deadline status seeker');
      
      if (!offer) {
        throw new Error('Offer not found');
      }
      
      // Check if user has permission to view this offer
      if (userId) {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        
        // Only offer owner, job request owner, or admin can view
        if (!user.roles.includes('admin') && 
            offer.provider._id.toString() !== userId && 
            offer.jobRequest.seeker.toString() !== userId) {
          throw new Error('Access denied');
        }
      }
      
      return offer;
    } catch (error) {
      throw error;
    }
  }
  
  // Update an offer
  async updateOffer(offerId, providerId, updateData) {
    try {
      const offer = await Offer.findById(offerId);
      
      if (!offer) {
        throw new Error('Offer not found');
      }
      
      // Only offer owner can update
      if (offer.provider.toString() !== providerId) {
        throw new Error('Access denied');
      }
      
      // Can only update pending offers
      if (offer.status !== 'pending') {
        throw new Error('Can only update pending offers');
      }
      
      // Validate budget if being updated
      if (updateData.budget) {
        const jobRequest = await JobRequest.findById(offer.jobRequest);
        if (updateData.budget.min < jobRequest.budget.min || 
            updateData.budget.max > jobRequest.budget.max) {
          throw new Error('Price must be within the job request budget range');
        }
      }
      
      // Update allowed fields
      const allowedUpdates = ['budget', 'message', 'estimatedTimeDays', 'availableDates', 'timePreferences'];
      allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
          offer[field] = updateData[field];
        }
      });
      
      await offer.save();
      
      // Populate provider and job request details
      await offer.populate([
        { path: 'provider', select: 'name email phone' },
        { path: 'jobRequest', select: 'title description budget deadline' }
      ]);
      
      return offer;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete/withdraw an offer
  async deleteOffer(offerId, providerId) {
    try {
      const offer = await Offer.findById(offerId);
      
      if (!offer) {
        throw new Error('Offer not found');
      }
      
      // Only offer owner can delete
      if (offer.provider.toString() !== providerId) {
        throw new Error('Access denied');
      }
      
      // Can only delete pending offers
      if (offer.status !== 'pending') {
        throw new Error('Can only delete pending offers');
      }
      
      await Offer.findByIdAndDelete(offerId);
      
      return { success: true, message: 'Offer deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
  
  // Accept an offer (called by job request owner)
  async acceptOffer(offerId, seekerId) {
    try {
      const offer = await Offer.findById(offerId)
        .populate('jobRequest');
      
      if (!offer) {
        throw new Error('Offer not found');
      }
      
      // Only job request owner can accept offers
      if (offer.jobRequest.seeker.toString() !== seekerId.toString()) {
        throw new Error('Access denied');
      }
      
      // Can only accept pending offers
      if (offer.status !== 'pending') {
        throw new Error('Can only accept pending offers');
      }
      
      // Update offer status
      offer.status = 'accepted';
      await offer.save();
      
      // Update job request status and assign provider
      await JobRequest.findByIdAndUpdate(offer.jobRequest._id, {
        status: 'assigned',
        assignedTo: offer.provider
      });
      
      // Create conversation for chat between seeker and provider
      const conversation = await chatService.getOrCreateConversation(
        offer.jobRequest._id,
        offer.jobRequest.seeker,
        offer.provider
      );
      
      // Reject all other pending offers for this job
      await Offer.updateMany(
        { 
          jobRequest: offer.jobRequest._id, 
          status: 'pending',
          _id: { $ne: offerId }
        },
        { status: 'rejected' }
      );

      // --- Notification logic ---
      // Get seeker name for message
      const seeker = await User.findById(seekerId);
      const providerId = offer.provider;
      const message = seeker ? `${seeker.name.first} قبل عرضك` : 'تم قبول عرضك';
      // Create notification in DB
      const notification = new Notification({
        userId: providerId,
        type: 'offer_accepted',
        message,
        relatedChatId: conversation._id,
        isRead: false
      });
      await notification.save();
      // Emit Socket.IO event to provider's room
      socketService.io.to(`user:${providerId}`).emit('notify:offerAccepted', {
        notification: {
          _id: notification._id,
          type: notification.type,
          message: notification.message,
          relatedChatId: notification.relatedChatId,
          isRead: notification.isRead,
          createdAt: notification.createdAt
        }
      });
      // --- End notification logic ---
      
      return offer;
    } catch (error) {
      throw error;
    }
  }
  
  // Reject an offer (called by job request owner)
  async rejectOffer(offerId, seekerId) {
    try {
      const offer = await Offer.findById(offerId)
        .populate('jobRequest');
      
      if (!offer) {
        throw new Error('Offer not found');
      }
      
      // Only job request owner can reject offers
      if (offer.jobRequest.seeker.toString() !== seekerId.toString()) {
        throw new Error('Access denied');
      }
      
      // Can only reject pending offers
      if (offer.status !== 'pending') {
        throw new Error('Can only reject pending offers');
      }
      
      offer.status = 'rejected';
      await offer.save();
      
      return offer;
    } catch (error) {
      throw error;
    }
  }
}

export default new OfferService(); 