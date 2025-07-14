import mongoose from 'mongoose';
const { Schema } = mongoose;

const serviceListingSchema = new Schema({
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: true,
    maxlength: 3000,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'EGP',
      enum: ['EGP', 'USD', 'EUR']
    }
  },
  deliveryTimeDays: {
    type: Number,
    default: 1,
    min: [1, 'Delivery time must be at least 1 day']
  },
  attachments: [{
    url: { type: String, required: true },
    filename: { type: String, required: true },
    fileType: String,
    fileSize: Number
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number],
    address: String
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'archived'],
    default: 'active'
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
  totalSales: {
    type: Number,
    default: 0,
    min: 0
  },
  features: [String],
  requirements: [String]
}, {
  timestamps: true
});

serviceListingSchema.index({ location: '2dsphere' });
serviceListingSchema.index({ provider: 1, status: 1 });
serviceListingSchema.index({ category: 1, status: 1 });
serviceListingSchema.index({ provider: 1 });

const ServiceListing = mongoose.model('ServiceListing', serviceListingSchema);
export default ServiceListing; 