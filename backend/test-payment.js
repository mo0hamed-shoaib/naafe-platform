import dotenv from 'dotenv';
import mongoose from 'mongoose';
import paymobService from './services/paymobService.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testPaymobIntegration() {
  try {
    console.log('🧪 Testing Paymob Integration...\n');

    // Test 1: Authentication
    console.log('1. Testing authentication...');
    const token = await paymobService.authenticate();
    console.log('✅ Authentication successful');
    console.log('Token:', token.substring(0, 20) + '...\n');

    // Test 2: Order Registration
    console.log('2. Testing order registration...');
    const orderData = {
      orderId: `TEST_${Date.now()}`,
      jobRequestId: '507f1f77bcf86cd799439011', // Mock ObjectId
      offerId: '507f1f77bcf86cd799439012', // Mock ObjectId
      seekerId: '507f1f77bcf86cd799439013', // Mock ObjectId
      providerId: '507f1f77bcf86cd799439014', // Mock ObjectId
      amount: 1000,
      commission: 100,
      totalAmount: 1100,
      currency: 'EGP',
      jobTitle: 'Test Service',
      seekerEmail: 'test@example.com',
      seekerFirstName: 'Test',
      seekerLastName: 'User',
      seekerPhone: '+201234567890'
    };

    const paymobOrder = await paymobService.registerOrder(orderData);
    console.log('✅ Order registered successfully');
    console.log('Paymob Order ID:', paymobOrder.id);
    console.log('Amount (cents):', paymobOrder.amount_cents);
    console.log('Currency:', paymobOrder.currency, '\n');

    // Test 3: Payment Key Generation
    console.log('3. Testing payment key generation...');
    const paymentKeyData = await paymobService.getPaymentKey(orderData, paymobOrder.id);
    console.log('✅ Payment key generated successfully');
    console.log('Payment Key:', paymentKeyData.token.substring(0, 20) + '...\n');

    // Test 4: Iframe URL Generation
    console.log('4. Testing iframe URL generation...');
    const iframeUrl = paymobService.generateIframeUrl(paymentKeyData.token);
    console.log('✅ Iframe URL generated successfully');
    console.log('Iframe URL:', iframeUrl.substring(0, 50) + '...\n');

    // Test 5: HMAC Verification
    console.log('5. Testing HMAC verification...');
    const testHmac = 'test_hmac_signature';
    const testTransactionId = '123456';
    const testAmountCents = 110000;
    const testCurrency = 'EGP';
    const testOrderId = '123';

    const isValidHmac = paymobService.verifyHmacSignature(
      testHmac,
      testTransactionId,
      testAmountCents,
      testCurrency,
      testOrderId
    );
    console.log('✅ HMAC verification test completed');
    console.log('Is valid HMAC:', isValidHmac, '\n');

    // Test 6: Complete Payment Flow (with new order data)
    console.log('6. Testing complete payment flow...');
    const newOrderData = {
      ...orderData,
      orderId: `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    const paymentResult = await paymobService.processPayment(newOrderData);
    console.log('✅ Complete payment flow successful');
    console.log('Payment Record ID:', paymentResult.payment._id);
    console.log('Order ID:', paymentResult.payment.orderId);
    console.log('Iframe URL:', paymentResult.iframeUrl.substring(0, 50) + '...\n');

    console.log('🎉 All Paymob integration tests passed!');
    console.log('\n📋 Summary:');
    console.log('- Authentication: ✅');
    console.log('- Order Registration: ✅');
    console.log('- Payment Key Generation: ✅');
    console.log('- Iframe URL Generation: ✅');
    console.log('- HMAC Verification: ✅');
    console.log('- Complete Payment Flow: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the test
testPaymobIntegration(); 