import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

class PaymobIntegrationTester {
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

  async getIntegrations(token) {
    try {
      console.log('🔍 Fetching available integrations...');
      const response = await fetch(`${this.baseUrl}/acceptance/integrations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch integrations: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Integrations fetched successfully');
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch integrations:', error.message);
      throw error;
    }
  }

  async testPaymentKeyGeneration(token, integrationId) {
    try {
      console.log(`🧪 Testing payment key generation with integration ID: ${integrationId}`);
      
      // First, create a test order
      const orderResponse = await fetch(`${this.baseUrl}/ecommerce/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: token,
          delivery_needed: false,
          amount_cents: 55000, // 550 EGP
          currency: 'EGP',
          merchant_order_id: `TEST_${Date.now()}`,
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
        throw new Error(`Order creation failed: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();
      console.log(`✅ Order created: ${orderData.id}`);

      // Now try to generate payment key
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
        console.error(`❌ Payment key generation failed: ${paymentKeyResponse.status}`);
        console.error(`Error details: ${errorText}`);
        return false;
      }

      const paymentKeyData = await paymentKeyResponse.json();
      console.log(`✅ Payment key generated successfully: ${paymentKeyData.token}`);
      return true;
    } catch (error) {
      console.error(`❌ Payment key test failed: ${error.message}`);
      return false;
    }
  }
}

async function main() {
  const tester = new PaymobIntegrationTester();
  
  try {
    console.log('🧪 Paymob Integration ID Test\n');
    
    // Authenticate
    const token = await tester.authenticate();
    
    // Get available integrations
    const integrations = await tester.getIntegrations(token);
    
    console.log('\n📋 Available Integrations:');
    console.log('========================');
    
    if (integrations && integrations.length > 0) {
      integrations.forEach((integration, index) => {
        console.log(`${index + 1}. ID: ${integration.id}`);
        console.log(`   Type: ${integration.type}`);
        console.log(`   Name: ${integration.name || 'N/A'}`);
        console.log(`   Active: ${integration.active ? 'Yes' : 'No'}`);
        console.log('');
      });
      
      // Test each integration
      console.log('🧪 Testing each integration...\n');
      
      for (const integration of integrations) {
        if (integration.active) {
          console.log(`Testing integration ID: ${integration.id} (${integration.type})`);
          const success = await tester.testPaymentKeyGeneration(token, integration.id);
          console.log(`Result: ${success ? '✅ SUCCESS' : '❌ FAILED'}\n`);
          
          if (success) {
            console.log(`🎯 RECOMMENDATION: Use integration ID ${integration.id} for payments`);
            break;
          }
        }
      }
    } else {
      console.log('❌ No integrations found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

main(); 