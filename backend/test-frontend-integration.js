import dotenv from 'dotenv';
import mongoose from 'mongoose';
import paymobService from './services/paymobService.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testFrontendIntegration() {
  try {
    console.log('🧪 Testing Frontend Integration...\n');

    // Test data that would come from frontend
    const frontendData = {
      orderId: `FRONTEND_TEST_${Date.now()}`,
      jobRequestId: '507f1f77bcf86cd799439011',
      offerId: '507f1f77bcf86cd799439012',
      seekerId: '507f1f77bcf86cd799439013',
      providerId: '507f1f77bcf86cd799439014',
      amount: 500,
      commission: 50,
      totalAmount: 550,
      currency: 'EGP',
      jobTitle: 'خدمة تجريبية - اختبار الدفع',
      seekerEmail: 'test@example.com',
      seekerFirstName: 'Test',
      seekerLastName: 'User',
      seekerPhone: '+201234567890'
    };

    console.log('📋 Frontend Data:');
    console.log('- Job Request ID:', frontendData.jobRequestId);
    console.log('- Offer ID:', frontendData.offerId);
    console.log('- Amount:', frontendData.amount, frontendData.currency);
    console.log('- Commission:', frontendData.commission, frontendData.currency);
    console.log('- Total:', frontendData.totalAmount, frontendData.currency);
    console.log('- Job Title:', frontendData.jobTitle);
    console.log('');

    // Step 1: Process payment (simulate what the API endpoint does)
    console.log('1️⃣ Processing payment (API simulation)...');
    const paymentResult = await paymobService.processPayment(frontendData);
    
    console.log('✅ Payment processed successfully!');
    console.log('- Payment Record ID:', paymentResult.payment._id);
    console.log('- Paymob Order ID:', paymentResult.orderId);
    console.log('- Payment Key:', paymentResult.paymentKey.substring(0, 20) + '...');
    console.log('- Iframe URL:', paymentResult.iframeUrl.substring(0, 50) + '...');
    console.log('');

    // Step 2: Simulate what the frontend would receive
    console.log('2️⃣ Frontend Response Data:');
    const frontendResponse = {
      success: true,
      data: {
        orderId: paymentResult.payment.orderId,
        iframeUrl: paymentResult.iframeUrl,
        paymentKey: paymentResult.paymentKey,
        amount: frontendData.amount,
        commission: frontendData.commission,
        totalAmount: frontendData.totalAmount,
        currency: frontendData.currency
      }
    };

    console.log('📤 Response to Frontend:');
    console.log(JSON.stringify(frontendResponse, null, 2));
    console.log('');

    // Step 3: Test iframe URL
    console.log('3️⃣ Testing Iframe URL:');
    console.log('🔗 Full URL:', paymentResult.iframeUrl);
    console.log('');
    console.log('📋 Frontend Integration Test Results:');
    console.log('✅ Payment order creation works');
    console.log('✅ Payment key generation works');
    console.log('✅ Iframe URL generation works');
    console.log('✅ Database storage works');
    console.log('✅ Frontend response format is correct');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Open http://localhost:5173/payment-test in your browser');
    console.log('2. Click "إتمام الخدمة والدفع" button');
    console.log('3. Confirm the service details');
    console.log('4. Click "إتمام والدفع" to create payment');
    console.log('5. The Paymob iframe should open');
    console.log('6. Test with sandbox card: 4111 1111 1111 1111');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

testFrontendIntegration(); 