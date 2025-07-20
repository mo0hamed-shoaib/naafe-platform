import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

/**
 * @route   POST /api/subscriptions/create-checkout-session
 * @desc    Create Stripe checkout session for subscription
 * @access  Private
 * @body    {string} planId - Stripe price ID
 * @body    {string} planName - Plan name for display
 * @body    {string} successUrl - URL to redirect on success
 * @body    {string} cancelUrl - URL to redirect on cancel
 * @returns {object} Checkout session URL
 */
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { planId, planName, successUrl, cancelUrl } = req.body;
    const userId = req.user._id;

    if (!planId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PLAN_ID',
          message: 'Plan ID is required'
        }
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId, // Stripe Price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.FRONTEND_URL}/pricing?success=true`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        userId: userId.toString(),
        planName,
      },
      customer_email: req.user.email,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      // Remove locale: 'ar' as Stripe doesn't support Arabic
    });

    res.status(200).json({
      success: true,
      data: {
        url: session.url,
        sessionId: session.id
      },
      message: 'Checkout session created successfully'
    });

  } catch (error) {
    console.error('Subscription checkout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CHECKOUT_ERROR',
        message: error.message || 'Failed to create checkout session'
      }
    });
  }
});

/**
 * @route   POST /api/subscriptions/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public (Stripe webhook)
 * @returns {object} Success response
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Check if this is a subscription or ad payment
        if (session.metadata?.adId) {
          // Handle ad payment completion
          const adService = (await import('../services/adService.js')).default;
          await adService.handlePaymentCompletion(session);
        } else {
          // Handle subscription completion
          await handleSubscriptionCreated(session);
        }
        break;
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionDeleted(deletedSubscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper functions for webhook handlers
async function handleSubscriptionCreated(session) {
  const userId = session.metadata?.userId;
  const planName = session.metadata?.planName;

  if (userId) {
    // Update user subscription status in database
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(userId, {
      'subscription.status': 'active',
      'subscription.planName': planName,
      'subscription.stripeCustomerId': session.customer,
      'subscription.stripeSubscriptionId': session.subscription,
      'subscription.currentPeriodEnd': new Date(session.subscription_data?.trial_end * 1000),
      'isPremium': true
    });

    console.log(`Subscription created for user ${userId}: ${planName}`);
  }
}

async function handleSubscriptionUpdated(subscription) {
  const User = (await import('../models/User.js')).default;
  
  // Find user by Stripe customer ID
  const user = await User.findOne({ 'subscription.stripeCustomerId': subscription.customer });
  
  if (user) {
    await User.findByIdAndUpdate(user._id, {
      'subscription.status': subscription.status,
      'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
      'isPremium': subscription.status === 'active'
    });

    console.log(`Subscription updated for user ${user._id}: ${subscription.status}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const User = (await import('../models/User.js')).default;
  
  // Find user by Stripe customer ID
  const user = await User.findOne({ 'subscription.stripeCustomerId': subscription.customer });
  
  if (user) {
    await User.findByIdAndUpdate(user._id, {
      'subscription.status': 'canceled',
      'isPremium': false
    });

    console.log(`Subscription canceled for user ${user._id}`);
  }
}

export default router; 