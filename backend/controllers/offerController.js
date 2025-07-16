import offerService from '../services/offerService.js';
import { logger } from '../middlewares/logging.middleware.js';

class OfferController {
  // Create an offer for a job request
  async createOffer(req, res) {
    try {
      const { id: jobRequestId } = req.params;
      const providerId = req.user._id;
      const offerData = req.body;
      
      logger.info(`Creating offer for job request ${jobRequestId} by provider ${providerId}`);
      
      const offer = await offerService.createOffer(jobRequestId, providerId, offerData);
      
      logger.info(`Offer created successfully: ${offer._id}`);
      
      res.status(201).json({
        success: true,
        data: offer,
        message: 'Offer created successfully'
      });
    } catch (error) {
      logger.error(`Error creating offer: ${error.message}`);
      res.status(400).json({
        success: false,
        error: {
          code: 'OFFER_CREATION_ERROR',
          message: error.message
        }
      });
    }
  }
  
  // Get all offers with filtering
  async getAllOffers(req, res) {
    try {
      const userId = req.user._id;
      const userRoles = req.user.roles;
      const filters = req.query;
      
      logger.info(`Getting offers for user ${userId} with roles ${userRoles}`);
      
      const offers = await offerService.getAllOffers(userId, userRoles, filters);
      
      logger.info(`Found ${offers.length} offers for user ${userId}`);
      
      res.status(200).json({
        success: true,
        data: {
          offers,
          totalCount: offers.length
        },
        message: 'Offers retrieved successfully'
      });
    } catch (error) {
      logger.error(`Error getting offers: ${error.message}`);
      res.status(400).json({
        success: false,
        error: {
          code: 'OFFER_RETRIEVAL_ERROR',
          message: error.message
        }
      });
    }
  }
  
  // Get a specific offer by ID
  async getOfferById(req, res) {
    try {
      const { offerId } = req.params;
      const userId = req.user._id;
      
      logger.info(`Getting offer ${offerId} for user ${userId}`);
      
      const offer = await offerService.getOfferById(offerId, userId);
      
      logger.info(`Offer ${offerId} retrieved successfully`);
      
      res.status(200).json({
        success: true,
        data: offer,
        message: 'Offer retrieved successfully'
      });
    } catch (error) {
      logger.error(`Error getting offer by ID: ${error.message}`);
      
      if (error.message === 'Offer not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'OFFER_NOT_FOUND',
            message: 'Offer not found'
          }
        });
      }
      
      if (error.message === 'Access denied') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'Access denied'
          }
        });
      }
      
      res.status(400).json({
        success: false,
        error: {
          code: 'OFFER_RETRIEVAL_ERROR',
          message: error.message
        }
      });
    }
  }
  
  // Update an offer
  async updateOffer(req, res) {
    try {
      const { offerId } = req.params;
      const providerId = req.user._id;
      const updateData = req.body;
      
      logger.info(`Updating offer ${offerId} by provider ${providerId}`);
      
      const offer = await offerService.updateOffer(offerId, providerId, updateData);
      
      logger.info(`Offer ${offerId} updated successfully`);
      
      res.status(200).json({
        success: true,
        data: offer,
        message: 'Offer updated successfully'
      });
    } catch (error) {
      logger.error(`Error updating offer: ${error.message}`);
      
      if (error.message === 'Offer not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'OFFER_NOT_FOUND',
            message: 'Offer not found'
          }
        });
      }
      
      if (error.message === 'Access denied') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'Access denied'
          }
        });
      }
      
      res.status(400).json({
        success: false,
        error: {
          code: 'OFFER_UPDATE_ERROR',
          message: error.message
        }
      });
    }
  }
  
  // Delete/withdraw an offer
  async deleteOffer(req, res) {
    try {
      const { offerId } = req.params;
      const providerId = req.user._id;
      
      logger.info(`Deleting offer ${offerId} by provider ${providerId}`);
      
      const result = await offerService.deleteOffer(offerId, providerId);
      
      logger.info(`Offer ${offerId} deleted successfully`);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Offer deleted successfully'
      });
    } catch (error) {
      logger.error(`Error deleting offer: ${error.message}`);
      
      if (error.message === 'Offer not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'OFFER_NOT_FOUND',
            message: 'Offer not found'
          }
        });
      }
      
      if (error.message === 'Access denied') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'Access denied'
          }
        });
      }
      
      res.status(400).json({
        success: false,
        error: {
          code: 'OFFER_DELETION_ERROR',
          message: error.message
        }
      });
    }
  }
  

}

export default new OfferController(); 