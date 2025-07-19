import fetch from 'node-fetch';

async function testPaymentStatus() {
  try {
    console.log('🔍 Checking payment status...');
    
    const response = await fetch('http://localhost:5000/api/paymob/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Payment Status Response:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Server responded with status:', response.status);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error checking payment status:');
    console.error('Message:', error.message);
  }
}

// Wait a bit for server to start
setTimeout(testPaymentStatus, 3000); 