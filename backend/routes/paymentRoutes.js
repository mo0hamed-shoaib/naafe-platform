import express from 'express';
import { createCheckoutSession, handleWebhook, getPaymentDetails, checkPaymentStatus } from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create checkout session (protected route)
router.post('/create-checkout-session', authenticateToken, createCheckoutSession);

// Webhook endpoint (no auth required, Stripe handles verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Get payment details by session ID (protected route)
router.get('/details/:sessionId', authenticateToken, getPaymentDetails);

// Check payment status by conversation ID (protected route)
router.get('/check-status/:conversationId', authenticateToken, checkPaymentStatus);

export default router; 