import fetch from 'node-fetch';

async function testEndpoint() {
  try {
    console.log('🧪 Testing Payment Endpoint...\n');

    const response = await fetch('http://localhost:3000/api/paymob/test-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobRequestId: 'test_job_123',
        offerId: 'test_offer_456'
      })
    });

    const data = await response.json();
    
    console.log('📋 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('✅ Endpoint test successful!');
      console.log('🔗 Iframe URL:', data.data.iframeUrl.substring(0, 50) + '...');
    } else {
      console.log('❌ Endpoint test failed:', data.error?.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEndpoint(); 