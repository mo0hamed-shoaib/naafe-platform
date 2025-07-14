import mongoose from 'mongoose';
import User from "./User.js";
const { Schema } = mongoose;

const providerSchema = new Schema({
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalJobsCompleted: {
        type: Number,
        default: 0,
        min: 0
    },
    totalEarnings: {
        type: Number,
        default: 0,
        min: 0
    }
});

const Provider = User.discriminator('provider', providerSchema);

// Virtual field to get provider's services from ServiceListing
providerSchema.virtual('services', {
    ref: 'ServiceListing',
    localField: '_id',
    foreignField: 'provider',
    match: { status: 'active' }
});

export default Provider;