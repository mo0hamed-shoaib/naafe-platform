import dotenv from 'dotenv';
import paymobService from './services/paymobService.js';

// Load environment variables
dotenv.config();

async function testSimple() {
  try {
    console.log('🔍 Testing Paymob Service...\n');
    
    console.log('Environment variables:');
    console.log('PAYMOB_API_KEY exists:', !!process.env.PAYMOB_API_KEY);
    console.log('PAYMOB_API_KEY length:', process.env.PAYMOB_API_KEY?.length);
    console.log('PAYMOB_API_KEY (first 20 chars):', process.env.PAYMOB_API_KEY?.substring(0, 20) + '...');
    
    console.log('\nService configuration:');
    console.log('Service API Key length:', paymobService.apiKey?.length);
    console.log('Service API Key (first 20 chars):', paymobService.apiKey?.substring(0, 20) + '...');
    
    console.log('\nTesting authentication...');
    const token = await paymobService.authenticate();
    console.log('✅ Authentication successful!');
    console.log('Token (first 20 chars):', token.substring(0, 20) + '...');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSimple(); 