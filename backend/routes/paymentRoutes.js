import express from 'express';
import paymentController from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validatePaymentOrder } from '../validation/paymentValidation.js';

const router = express.Router();

// Create payment order (requires authentication)
router.post('/orders', authenticateToken, validatePaymentOrder, paymentController.createPaymentOrder);

// Create test payment order (no authentication required - for testing only)
router.post('/test-orders', paymentController.createTestPaymentOrder);

// Get payment status (requires authentication)
router.get('/status/:orderId', authenticateToken, paymentController.getPaymentStatus);

// Get payment history (requires authentication)
router.get('/history', authenticateToken, paymentController.getPaymentHistory);

// Paymob webhook (no authentication required)
router.post('/webhook', paymentController.handleWebhook);

export default router; 