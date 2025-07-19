import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

class PaymobSandboxTester {
  constructor() {
    this.baseUrl = 'https://accept.paymob.com/api';
    this.apiKey = process.env.PAYMOB_API_KEY;
  }

  async authenticate() {
    try {
      console.log('🔐 Authenticating with Paymob...');
      const response = await fetch(`${this.baseUrl}/auth/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey
        })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Authentication successful');
      return data.token;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      throw error;
    }
  }

  async testDifferentIntegrations(token) {
    const integrationIds = ['1', '941127', '2', '3', '4', '5'];
    
    console.log('🧪 Testing different integration IDs...\n');
    
    for (const integrationId of integrationIds) {
      try {
        console.log(`Testing integration ID: ${integrationId}`);
        
        // Create test order
        const orderResponse = await fetch(`${this.baseUrl}/ecommerce/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_token: token,
            delivery_needed: false,
            amount_cents: 55000,
            currency: 'EGP',
            merchant_order_id: `TEST_${Date.now()}_${integrationId}`,
            items: [
              {
                name: 'Test Service',
                amount_cents: 50000,
                description: 'Test payment',
                quantity: 1
              }
            ]
          })
        });

        if (!orderResponse.ok) {
          console.log(`❌ Order creation failed for integration ${integrationId}: ${orderResponse.status}`);
          continue;
        }

        const orderData = await orderResponse.json();
        console.log(`✅ Order created: ${orderData.id}`);

        // Try to generate payment key
        const paymentKeyResponse = await fetch(`${this.baseUrl}/acceptance/payment_keys`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_token: token,
            amount_cents: 55000,
            expiration: 3600,
            order_id: orderData.id,
            billing_data: {
              apartment: 'NA',
              email: 'test@example.com',
              floor: 'NA',
              first_name: 'Test',
              street: 'NA',
              building: 'NA',
              phone_number: '+201234567890',
              shipping_method: 'NA',
              postal_code: 'NA',
              city: 'Cairo',
              country: 'EG',
              last_name: 'User',
              state: 'Cairo'
            },
            currency: 'EGP',
            integration_id: parseInt(integrationId),
            lock_order_when_paid: false
          })
        });

        if (!paymentKeyResponse.ok) {
          const errorText = await paymentKeyResponse.text();
          console.log(`❌ Payment key generation failed for integration ${integrationId}: ${paymentKeyResponse.status}`);
          console.log(`Error details: ${errorText}`);
          continue;
        }

        const paymentKeyData = await paymentKeyResponse.json();
        console.log(`✅ Payment key generated successfully for integration ${integrationId}: ${paymentKeyData.token}`);
        
        // Test URL accessibility
        const testUrl = `https://accept.paymob.com/api/acceptance/iframes/941127?payment_token=${paymentKeyData.token}`;
        console.log(`🔗 Test URL: ${testUrl}`);
        
        // Test if URL is accessible
        const urlResponse = await fetch(testUrl, {
          method: 'HEAD',
          redirect: 'follow'
        });
        
        console.log(`📋 URL Status: ${urlResponse.status}`);
        console.log(`📋 Content-Type: ${urlResponse.headers.get('content-type')}`);
        
        if (urlResponse.ok) {
          console.log(`🎯 SUCCESS: Integration ID ${integrationId} works!`);
          console.log(`🎯 RECOMMENDATION: Use integration ID ${integrationId}`);
          return integrationId;
        } else {
          console.log(`⚠️  URL not accessible for integration ${integrationId}`);
        }
        
        console.log('---');
        
      } catch (error) {
        console.log(`❌ Error testing integration ${integrationId}: ${error.message}`);
        console.log('---');
      }
    }
    
    return null;
  }
}

async function main() {
  const tester = new PaymobSandboxTester();
  
  try {
    console.log('🧪 Paymob Sandbox Integration Test\n');
    
    // Authenticate
    const token = await tester.authenticate();
    
    // Test different integrations
    const workingIntegration = await tester.testDifferentIntegrations(token);
    
    if (workingIntegration) {
      console.log(`\n🎉 Found working integration ID: ${workingIntegration}`);
      console.log('Update your .env file with:');
      console.log(`PAYMOB_INTEGRATION_ID=${workingIntegration}`);
    } else {
      console.log('\n❌ No working integration found');
      console.log('This might indicate an issue with:');
      console.log('1. Paymob sandbox environment');
      console.log('2. Account configuration');
      console.log('3. Integration setup');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

main(); 