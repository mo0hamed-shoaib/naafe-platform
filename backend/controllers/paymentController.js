import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../models/Payment.js';
import Conversation from '../models/Conversation.js';
import JobRequest from '../models/JobRequest.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export const createCheckoutSession = async (req, res) => {
  try {
    console.log('Creating checkout session with data:', req.body);
    const { conversationId, amount, serviceTitle, providerId } = req.body;
    const userId = req.user._id;

    if (!conversationId || !amount || !serviceTitle || !providerId) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

    // Validate amount (should be positive and in cents)
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (amountInCents <= 0) {
      return res.status(400).json({
        success: false,
        message: 'المبلغ غير صحيح'
      });
    }

    // Verify conversation exists and user is the seeker
    const conversation = await Conversation.findById(conversationId)
      .populate('jobRequestId')
      .populate('participants.seeker')
      .populate('participants.provider');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'المحادثة غير موجودة'
      });
    }

    console.log('Authorization check:');
    console.log('User ID from request:', userId, 'Type:', typeof userId);
    console.log('Seeker ID from conversation:', conversation.participants.seeker._id, 'Type:', typeof conversation.participants.seeker._id);
    console.log('User ID as string:', userId.toString());
    console.log('Seeker ID as string:', conversation.participants.seeker._id.toString());
    console.log('Comparison result:', userId.toString() === conversation.participants.seeker._id.toString());
    
    if (userId.toString() !== conversation.participants.seeker._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بإنشاء الدفع لهذه المحادثة'
      });
    }

    // Check if payment already exists and is completed
    const existingPayment = await Payment.findOne({
      conversationId,
      status: 'completed'
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'تم الدفع مسبقاً لهذه الخدمة'
      });
    }

    // Create Stripe checkout session
    console.log('Creating Stripe session with amount:', amountInCents, 'cents');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceTitle,
              description: `دفع مقابل الخدمة: ${serviceTitle}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/chat/${conversationId}`,
      metadata: {
        conversationId,
        userId: userId.toString(),
        providerId,
        serviceTitle,
        amount: amountInCents.toString(),
        originalCurrency: 'EGP',
        originalAmount: (amountInCents / 100).toString(),
      },
      customer_email: req.user.email,
    });
    
    console.log('Stripe session created:', session.id);

    // Create payment record in database
    const payment = new Payment({
      conversationId,
      jobRequestId: conversation.jobRequestId._id,
      seekerId: userId,
      providerId,
      stripeSessionId: session.id,
      amount: amountInCents,
      currency: 'usd',
      originalCurrency: 'EGP',
      originalAmount: parseFloat(amount),
      serviceTitle,
      status: 'pending'
    });

    await payment.save();

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء جلسة الدفع'
    });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Handle successful payment
      try {
        // Here you would typically:
        // 1. Update the conversation status
        // 2. Create a payment record
        // 3. Send notifications
        // 4. Update job request status
        
        console.log('Payment completed for session:', session.id);
        console.log('Metadata:', session.metadata);
        
        // Handle payment completion
        await handlePaymentCompletion(session);
        
      } catch (error) {
        console.error('Error handling payment completion:', error);
      }
      break;
      
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object.id);
      break;
      
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// Helper function to handle payment completion
const handlePaymentCompletion = async (session) => {
  try {
    // Find the payment record
    const payment = await Payment.findBySessionId(session.id);
    if (!payment) {
      console.error('Payment record not found for session:', session.id);
      return;
    }

    // Mark payment as completed
    await payment.markCompleted(session.payment_intent);

    // Update job request status to completed
    await JobRequest.findByIdAndUpdate(payment.jobRequestId, {
      status: 'completed',
      completedAt: new Date()
    });

    // Update conversation status
    await Conversation.findByIdAndUpdate(payment.conversationId, {
      isActive: false
    });

    console.log('Payment completion processed successfully for session:', session.id);
  } catch (error) {
    console.error('Error processing payment completion:', error);
  }
};

// Check payment status by conversation ID
export const checkPaymentStatus = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'معرف المحادثة مطلوب'
      });
    }

    // Find payment by conversation ID
    const payment = await Payment.findOne({ conversationId });

    if (!payment) {
      return res.json({
        success: true,
        data: {
          status: 'not_found',
          exists: false
        }
      });
    }

    res.json({
      success: true,
      data: {
        status: payment.status,
        exists: true,
        completedAt: payment.completedAt
      }
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التحقق من حالة الدفع'
    });
  }
};

// Get payment details by session ID
export const getPaymentDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'معرف الجلسة مطلوب'
      });
    }

    // Find payment by session ID
    const payment = await Payment.findOne({ stripeSessionId: sessionId })
      .populate('seekerId', 'name email')
      .populate('providerId', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على تفاصيل الدفع'
      });
    }

    // Check if user is authorized to view this payment
    if (req.user._id.toString() !== payment.seekerId._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بعرض تفاصيل هذا الدفع'
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: payment.stripeSessionId,
        amount: (payment.amount / 100).toFixed(2),
        serviceTitle: payment.serviceTitle,
        providerName: payment.providerId.name.first + ' ' + payment.providerId.name.last,
        providerId: payment.providerId._id.toString(),
        jobRequestId: payment.jobRequestId.toString(),
        completedAt: payment.completedAt || payment.createdAt,
        status: payment.status
      }
    });

  } catch (error) {
    console.error('Error getting payment details:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب تفاصيل الدفع'
    });
  }
}; 