import ServiceListing from '../models/ServiceListing.js';
import { logger } from '../middlewares/logging.middleware.js';

class ListingController {
  /**
   * List current provider's service listings
   * GET /api/users/me/listings
   */
  async listOwnListings(req, res) {
    try {
      const providerId = req.user._id;
      const { status = 'active', page = 1, limit = 20 } = req.query;
      const query = { provider: providerId };
      if (status) query.status = status;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [listings, totalCount] = await Promise.all([
        ServiceListing.find(query)
          .populate('provider', 'name avatarUrl isPremium isVerified totalJobsCompleted')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        ServiceListing.countDocuments(query)
      ]);
      res.status(200).json({
        success: true,
        data: {
          listings,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasNext: parseInt(page) * parseInt(limit) < totalCount,
            hasPrev: parseInt(page) > 1
          }
        },
        message: 'Listings retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`List own listings error: ${error.message}`);
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }, timestamp: new Date().toISOString() });
    }
  }

  /**
   * Create a new service listing
   * POST /api/listings
   */
  async createListing(req, res) {
    try {
      const providerId = req.user._id;
      const data = { ...req.body, provider: providerId };
      const listing = new ServiceListing(data);
      await listing.save();
      res.status(201).json({
        success: true,
        data: { listing },
        message: 'Listing created successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Create listing error: ${error.message}`);
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.message }, timestamp: new Date().toISOString() });
    }
  }

  /**
   * Get a single listing by ID
   * GET /api/listings/:id
   */
  async getListingById(req, res) {
    try {
      const { id } = req.params;
      const listing = await ServiceListing.findById(id);
      if (!listing) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Listing not found' }, timestamp: new Date().toISOString() });
      }
      res.status(200).json({
        success: true,
        data: { listing },
        message: 'Listing retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Get listing by ID error: ${error.message}`);
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }, timestamp: new Date().toISOString() });
    }
  }

  /**
   * Update own listing
   * PATCH /api/listings/:id
   */
  async updateListing(req, res) {
    try {
      const { id } = req.params;
      const providerId = req.user._id;
      const listing = await ServiceListing.findOneAndUpdate(
        { _id: id, provider: providerId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!listing) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Listing not found or not owned by user' }, timestamp: new Date().toISOString() });
      }
      res.status(200).json({
        success: true,
        data: { listing },
        message: 'Listing updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Update listing error: ${error.message}`);
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.message }, timestamp: new Date().toISOString() });
    }
  }

  /**
   * Delete (archive) own listing
   * DELETE /api/listings/:id
   */
  async deleteListing(req, res) {
    try {
      const { id } = req.params;
      const providerId = req.user._id;
      const listing = await ServiceListing.findOneAndUpdate(
        { _id: id, provider: providerId },
        { $set: { status: 'archived' } },
        { new: true }
      );
      if (!listing) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Listing not found or not owned by user' }, timestamp: new Date().toISOString() });
      }
      res.status(200).json({
        success: true,
        data: { listing },
        message: 'Listing archived successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Delete listing error: ${error.message}`);
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }, timestamp: new Date().toISOString() });
    }
  }

  /**
   * Get all listings (public, with search/filter)
   * GET /api/listings
   */
  async getAllListings(req, res) {
    try {
      const {
        category,
        status,
        minPrice,
        maxPrice,
        deliveryTimeDays,
        provider,
        search,
        page = 1,
        limit = 20
      } = req.query;
      const query = {};
      if (category) query.category = category;
      if (status) query.status = status;
      if (provider) query.provider = provider;
      if (deliveryTimeDays) query.deliveryTimeDays = parseInt(deliveryTimeDays);
      if (minPrice || maxPrice) {
        query['price.amount'] = {};
        if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
        if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [listings, totalCount] = await Promise.all([
        ServiceListing.find(query)
          .populate('provider', 'name avatarUrl isPremium isVerified totalJobsCompleted')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        ServiceListing.countDocuments(query)
      ]);
      res.status(200).json({
        success: true,
        data: {
          listings,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasNext: parseInt(page) * parseInt(limit) < totalCount,
            hasPrev: parseInt(page) > 1
          }
        },
        message: 'Listings retrieved successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Get all listings error: ${error.message}`);
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }, timestamp: new Date().toISOString() });
    }
  }
}

export default new ListingController(); 