import dotenv from 'dotenv';
import mongoose from 'mongoose';
import paymobService from './services/paymobService.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testPaymobUrl() {
  try {
    console.log('🧪 Testing Paymob URL Generation...\n');

    // Test data
    const paymentData = {
      orderId: `URL_TEST_${Date.now()}`,
      jobRequestId: '507f1f77bcf86cd799439011',
      offerId: '507f1f77bcf86cd799439012',
      seekerId: '507f1f77bcf86cd799439013',
      providerId: '507f1f77bcf86cd799439014',
      amount: 500,
      commission: 50,
      totalAmount: 550,
      currency: 'EGP',
      jobTitle: 'URL Test Service',
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
    
    // Test URL format
    const url = new URL(paymentResult.iframeUrl);
    console.log('📋 URL Analysis:');
    console.log('- Protocol:', url.protocol);
    console.log('- Hostname:', url.hostname);
    console.log('- Pathname:', url.pathname);
    console.log('- Has payment_token:', url.searchParams.has('payment_token'));
    console.log('- Token length:', url.searchParams.get('payment_token')?.length);
    console.log('');
    
    console.log('🎯 Next Steps:');
    console.log('1. Copy the URL above');
    console.log('2. Open it in a new browser tab');
    console.log('3. Check if Paymob loads correctly');
    console.log('4. Test with sandbox card: 4111 1111 1111 1111');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

testPaymobUrl(); 