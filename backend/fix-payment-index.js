import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function fixPaymentIndex() {
  try {
    console.log('🔧 Fixing Payment Collection Indexes...\n');

    // Wait for connection to be ready
    await mongoose.connection.asPromise();
    
    // Get the database connection
    const db = mongoose.connection.db;
    
    // List all indexes on the payments collection
    console.log('📋 Current indexes on payments collection:');
    const indexes = await db.collection('payments').indexes();
    indexes.forEach(index => {
      console.log('- Index:', index.name, 'Keys:', index.key);
    });
    console.log('');

    // Drop the problematic stripePaymentIntentId index
    console.log('🗑️ Dropping stripePaymentIntentId index...');
    try {
      await db.collection('payments').dropIndex('stripePaymentIntentId_1');
      console.log('✅ Successfully dropped stripePaymentIntentId_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ Index stripePaymentIntentId_1 does not exist (already dropped)');
      } else {
        console.log('⚠️ Error dropping index:', error.message);
      }
    }

    // Drop any other problematic indexes
    console.log('🗑️ Dropping any other problematic indexes...');
    try {
      await db.collection('payments').dropIndex('stripePaymentIntentId_1');
      console.log('✅ Successfully dropped duplicate stripePaymentIntentId_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ No duplicate stripePaymentIntentId_1 index found');
      } else {
        console.log('⚠️ Error dropping duplicate index:', error.message);
      }
    }

    // List indexes again to confirm
    console.log('\n📋 Updated indexes on payments collection:');
    const updatedIndexes = await db.collection('payments').indexes();
    updatedIndexes.forEach(index => {
      console.log('- Index:', index.name, 'Keys:', index.key);
    });

    console.log('\n✅ Index fix completed!');
    console.log('🔗 You can now run the payment flow test again.');

  } catch (error) {
    console.error('❌ Error fixing indexes:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

fixPaymentIndex(); 