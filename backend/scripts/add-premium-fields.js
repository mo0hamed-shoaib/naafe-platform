import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/naafe';

async function addPremiumFields() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all existing users to have the new fields
    const result = await User.updateMany(
      { 
        $or: [
          { isPremium: { $exists: false } },
          { isTopRated: { $exists: false } }
        ]
      },
      {
        $set: {
          isPremium: false,
          isTopRated: false
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users with new premium fields`);

    // Set some sample premium users (you can modify this as needed)
    const samplePremiumUsers = [
      'ahmed@naafe.com',
      'elias@naafe.com'
    ];

    for (const email of samplePremiumUsers) {
      const user = await User.findOne({ email });
      if (user) {
        user.isPremium = true;
        await user.save();
        console.log(`Set ${email} as premium user`);
      }
    }

    // Update top-rated status for all providers
    const providers = await User.find({ roles: 'provider' });
    for (const provider of providers) {
      provider.updateTopRatedStatus();
      await provider.save();
      if (provider.isTopRated) {
        console.log(`Set ${provider.email} as top-rated provider`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addPremiumFields(); 