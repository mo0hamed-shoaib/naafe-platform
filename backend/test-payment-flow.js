import dotenv from 'dotenv';
import mongoose from 'mongoose';
import paymobService from './services/paymobService.js';
import Payment from './models/Payment.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testPaymentFlow() {
  try {
    console.log('🧪 Testing Payment Flow (Without Webhooks)...\n');

    // Test data
    const paymentData = {
      orderId: `TEST_FLOW_${Date.now()}`,
      jobRequestId: '507f1f77bcf86cd799439011',
      offerId: '507f1f77bcf86cd799439012',
      seekerId: '507f1f77bcf86cd799439013',
      providerId: '507f1f77bcf86cd799439014',
      amount: 500,
      commission: 50,
      totalAmount: 550,
      currency: 'EGP',
      jobTitle: 'Test Service Payment',
      seekerEmail: 'test@example.com',
      seekerFirstName: 'Test',
      seekerLastName: 'User',
      seekerPhone: '+201234567890'
    };

    console.log('📋 Payment Data:');
    console.log('- Order ID:', paymentData.orderId);
    console.log('- Amount:', paymentData.amount, paymentData.currency);
    console.log('- Commission:', paymentData.commission, paymentData.currency);
    console.log('- Total:', paymentData.totalAmount, paymentData.currency);
    console.log('- Job Title:', paymentData.jobTitle);
    console.log('- Seeker Email:', paymentData.seekerEmail);
    console.log('');

    // Step 1: Process payment (create order, get payment key, generate iframe URL)
    console.log('1️⃣ Processing payment...');
    const paymentResult = await paymobService.processPayment(paymentData);
    
    console.log('✅ Payment processed successfully!');
    console.log('- Payment Record ID:', paymentResult.payment._id);
    console.log('- Paymob Order ID:', paymentResult.orderId);
    console.log('- Payment Key:', paymentResult.paymentKey.substring(0, 20) + '...');
    console.log('- Iframe URL:', paymentResult.iframeUrl.substring(0, 50) + '...');
    console.log('');

    // Step 2: Simulate payment completion (manually update status)
    console.log('2️⃣ Simulating payment completion...');
    const updatedPayment = await paymobService.updatePaymentStatus(
      paymentResult.payment.orderId,
      'completed',
      {
        success: true,
        is_captured: true,
        id: 'test_transaction_123',
        amount_cents: paymentData.totalAmount * 100,
        currency: paymentData.currency
      }
    );

    console.log('✅ Payment status updated to completed!');
    console.log('- Status:', updatedPayment.status);
    console.log('- Completed At:', updatedPayment.completedAt);
    console.log('');

    // Step 3: Test payment retrieval
    console.log('3️⃣ Testing payment retrieval...');
    const retrievedPayment = await paymobService.getPaymentByOrderId(paymentResult.payment.orderId);
    
    console.log('✅ Payment retrieved successfully!');
    console.log('- Order ID:', retrievedPayment.orderId);
    console.log('- Status:', retrievedPayment.status);
    console.log('- Amount:', retrievedPayment.amount);
    console.log('- Total Amount:', retrievedPayment.totalAmount);
    console.log('');

    console.log('🎉 Payment Flow Test Completed Successfully!');
    console.log('');
    console.log('📋 What this means:');
    console.log('✅ Payment order creation works');
    console.log('✅ Payment key generation works');
    console.log('✅ Iframe URL generation works');
    console.log('✅ Database storage works');
    console.log('✅ Payment status updates work');
    console.log('✅ Payment retrieval works');
    console.log('');
    console.log('🔗 Next Steps:');
    console.log('1. Test the frontend payment modal with the iframe URL');
    console.log('2. Configure webhooks for automatic payment completion');
    console.log('3. Test real payment flow with Paymob sandbox');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Try to create payment manually to see the exact error
    if (error.message.includes('Failed to create payment record')) {
      console.log('\n🔍 Trying to create payment manually to debug...');
      try {
        const testPayment = new Payment({
          orderId: `DEBUG_${Date.now()}`,
          jobRequestId: '507f1f77bcf86cd799439011',
          offerId: '507f1f77bcf86cd799439012',
          seeker: '507f1f77bcf86cd799439013',
          provider: '507f1f77bcf86cd799439014',
          amount: 500,
          commission: 50,
          totalAmount: 550,
          currency: 'EGP',
          paymobOrderId: 'test_order_123',
          paymobPaymentKey: 'test_key_123'
        });
        
        await testPayment.save();
        console.log('✅ Manual payment creation worked!');
      } catch (manualError) {
        console.error('❌ Manual payment creation failed:', manualError.message);
        if (manualError.errors) {
          console.error('Validation errors:');
          Object.keys(manualError.errors).forEach(key => {
            console.error(`- ${key}: ${manualError.errors[key].message}`);
          });
        }
      }
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

testPaymentFlow(); 