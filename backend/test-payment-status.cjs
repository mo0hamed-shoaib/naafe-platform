const axios = require('axios');

async function testPaymentStatus() {
  try {
    console.log('🔍 Checking payment status...');
    
    const response = await axios.get('http://localhost:5000/api/paymob/status', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Payment Status Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error checking payment status:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

// Wait a bit for server to start
setTimeout(testPaymentStatus, 3000); 