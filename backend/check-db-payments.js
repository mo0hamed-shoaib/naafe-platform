import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Import Payment model
const Payment = await import('./models/Payment.js');

async function checkPayments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/naafe');
    console.log('✅ Connected to MongoDB');
    
    const payments = await Payment.default.find().sort({createdAt: -1}).limit(5);
    console.log('\n📋 Recent Payments:');
    console.log('==================');
    
    if (payments.length === 0) {
      console.log('No payments found in database');
    } else {
      payments.forEach((payment, index) => {
        console.log(`\n${index + 1}. Payment ID: ${payment._id}`);
        console.log(`   Status: ${payment.status}`);
        console.log(`   Amount: ${payment.amount} EGP`);
        console.log(`   Order ID: ${payment.orderId}`);
        console.log(`   Created: ${payment.createdAt}`);
        console.log(`   Updated: ${payment.updatedAt}`);
        if (payment.paymobTransactionId) {
          console.log(`   Paymob Transaction ID: ${payment.paymobTransactionId}`);
        }
        if (payment.jobRequestId) {
          console.log(`   Job Request ID: ${payment.jobRequestId}`);
        }
        if (payment.offerId) {
          console.log(`   Offer ID: ${payment.offerId}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking payments:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

checkPayments(); 