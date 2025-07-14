import mongoose from 'mongoose';
import User from "./User.js";
const { Schema } = mongoose;

const seekerSchema = new Schema({
    totalJobsPosted: {
        type: Number,
        default: 0,
        min: 0
    },
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
    totalSpent: {
        type: Number,
        default: 0,
        min: 0
    }
});

const Seeker = User.discriminator('seeker', seekerSchema);
export default Seeker;
