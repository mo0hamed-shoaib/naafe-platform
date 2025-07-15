import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  jobRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRequest',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    min: {
      type: Number,
      required: true,
      min: [0, 'Minimum budget cannot be negative']
    },
    max: {
      type: Number,
      required: true,
      min: [0, 'Maximum budget cannot be negative']
    },
    currency: {
      type: String,
      enum: ['EGP', 'USD', 'EUR'],
      default: 'EGP',
      required: true
    }
  },
  message: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  estimatedTimeDays: {
    type: Number,
    default: 1,
    min: [1, 'Estimated time must be at least 1 day']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
offerSchema.index({ jobRequest: 1, status: 1 });
offerSchema.index({ provider: 1, status: 1 });
offerSchema.index({ provider: 1, jobRequest: 1 }, { unique: true });

// Validation middleware
offerSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Check if job request exists and is open
    const JobRequest = mongoose.model('JobRequest');
    const jobRequest = await JobRequest.findById(this.jobRequest);
    
    if (!jobRequest) {
      return next(new Error('Job request not found'));
    }
    
    if (jobRequest.status !== 'open') {
      return next(new Error('Can only make offers on open job requests'));
    }
    
    // Check if provider already made an offer
    const existingOffer = await mongoose.model('Offer').findOne({
      jobRequest: this.jobRequest,
      provider: this.provider,
      status: { $in: ['pending', 'accepted'] }
    });
    
    if (existingOffer) {
      return next(new Error('Provider already made an offer on this job'));
    }
  }
  next();
});

const Offer = mongoose.model('Offer', offerSchema);

export default Offer; 