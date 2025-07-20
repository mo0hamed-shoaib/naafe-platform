import express from 'express';
import { createCheckoutSession, handleWebhook, getPaymentDetails, checkPaymentStatus } from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import adService from '../services/adService.js';

const router = express.Router();

// Create checkout session (protected route)
router.post('/create-checkout-session', authenticateToken, createCheckoutSession);

// Create checkout session for promotions (ads) - won't trigger ad blockers
router.post('/promotion-checkout/:adId', authenticateToken, async (req, res) => {
  try {
    const { adId } = req.params;
    const userId = req.user._id;

    const session = await adService.createCheckoutSession(adId, userId);

    res.status(200).json({
      success: true,
      data: session,
      message: 'تم إنشاء جلسة الدفع بنجاح'
    });
  } catch (error) {
    console.error('Error creating promotion checkout session:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CHECKOUT_ERROR',
        message: error.message || 'حدث خطأ أثناء إنشاء جلسة الدفع'
      }
    });
  }
});

// Webhook endpoint (no auth required, Stripe handles verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Get payment details by session ID (protected route)
router.get('/details/:sessionId', authenticateToken, getPaymentDetails);

// Check payment status by conversation ID (protected route)
router.get('/check-status/:conversationId', authenticateToken, checkPaymentStatus);

export default router; 