import express from 'express'
import asyncHandler from 'express-async-handler'

const router = express.Router()

// @desc    Get all service requests
// @route   GET /api/v1/service-requests
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get service requests route - to be implemented in Phase 3'
  })
}))

// @desc    Create service request
// @route   POST /api/v1/service-requests
// @access  Private
router.post('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Create service request route - to be implemented in Phase 3'
  })
}))

// @desc    Get service request by ID
// @route   GET /api/v1/service-requests/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get service request by ID route - to be implemented in Phase 3'
  })
}))

export default router
