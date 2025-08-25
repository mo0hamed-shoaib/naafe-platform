import express from 'express'
import asyncHandler from 'express-async-handler'

const router = express.Router()

// @desc    Get offers for a service request
// @route   GET /api/v1/offers/request/:requestId
// @access  Public
router.get('/request/:requestId', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get offers for request route - to be implemented in Phase 4'
  })
}))

// @desc    Create offer
// @route   POST /api/v1/offers
// @access  Private
router.post('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Create offer route - to be implemented in Phase 4'
  })
}))

// @desc    Accept offer
// @route   PUT /api/v1/offers/:id/accept
// @access  Private
router.put('/:id/accept', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Accept offer route - to be implemented in Phase 4'
  })
}))

export default router
