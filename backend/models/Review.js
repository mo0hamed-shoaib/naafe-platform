import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRequest: {
    type: Schema.Types.ObjectId,
    ref: 'JobRequest'
  },
  serviceListing: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceListing'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  reported: {
    type: Boolean,
    default: false
  },
  reportReason: String
}, {
  timestamps: true
});

reviewSchema.index({ reviewedUser: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1, reviewedUser: 1 }, { unique: true });
reviewSchema.index({ jobRequest: 1 });
reviewSchema.index({ serviceListing: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isPublic: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review; 