import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

async function debugPaymobAuth() {
  try {
    console.log('🔍 Debugging Paymob Authentication...\n');
    
    const apiKey = process.env.PAYMOB_API_KEY;
    console.log('API Key (first 20 chars):', apiKey ? apiKey.substring(0, 20) + '...' : 'NOT FOUND');
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    
    const requestBody = {
      api_key: apiKey
    };
    
    console.log('\n📤 Request Details:');
    console.log('URL:', 'https://accept.paymob.com/api/auth/tokens');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('\n📥 Response Details:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('\n📄 Response Body:');
    console.log(responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('\n✅ Parsed Response:');
        console.log(JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('\n❌ Failed to parse JSON response');
      }
    } else {
      console.log('\n❌ Request failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugPaymobAuth(); 