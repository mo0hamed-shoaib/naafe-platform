import { body, param, query, validationResult } from 'express-validator';

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
};

export const validatePaymentOrder = [
  body('jobRequestId')
    .isMongoId()
    .withMessage('Job request ID must be a valid MongoDB ID'),
  
  body('offerId')
    .isMongoId()
    .withMessage('Offer ID must be a valid MongoDB ID'),
  
  handleValidationErrors
];

export const validatePaymentStatus = [
  param('orderId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Order ID is required'),
  
  handleValidationErrors
];

export const validatePaymentHistory = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
]; 