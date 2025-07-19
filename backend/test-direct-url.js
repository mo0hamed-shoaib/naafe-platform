import dotenv from 'dotenv';
import mongoose from 'mongoose';
import paymobService from './services/paymobService.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testDirectUrl() {
  try {
    console.log('🧪 Testing Direct Paymob URL Access...\n');

    // Test data
    const paymentData = {
      orderId: `DIRECT_TEST_${Date.now()}`,
      jobRequestId: '507f1f77bcf86cd799439011',
      offerId: '507f1f77bcf86cd799439012',
      seekerId: '507f1f77bcf86cd799439013',
      providerId: '507f1f77bcf86cd799439014',
      amount: 500,
      commission: 50,
      totalAmount: 550,
      currency: 'EGP',
      jobTitle: 'Direct URL Test Service',
      seekerEmail: 'test@example.com',
      seekerFirstName: 'Test',
      seekerLastName: 'User',
      seekerPhone: '+201234567890'
    };

    console.log('📋 Processing payment...');
    const paymentResult = await paymobService.processPayment(paymentData);
    
    console.log('✅ Payment processed successfully!');
    console.log('🔗 Paymob URL:', paymentResult.iframeUrl);
    console.log('');
    
    // Test URL accessibility
    console.log('🌐 Testing URL accessibility...');
    const response = await fetch(paymentResult.iframeUrl, {
      method: 'HEAD',
      redirect: 'follow'
    });
    
    console.log('📋 Response Status:', response.status);
    console.log('📋 Response Headers:');
    console.log('- Content-Type:', response.headers.get('content-type'));
    console.log('- X-Frame-Options:', response.headers.get('x-frame-options'));
    console.log('- Content-Security-Policy:', response.headers.get('content-security-policy'));
    console.log('');
    
    if (response.ok) {
      console.log('✅ URL is accessible!');
      console.log('🎯 Try opening this URL in a new browser tab:');
      console.log(paymentResult.iframeUrl);
    } else {
      console.log('❌ URL is not accessible');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

testDirectUrl(); 