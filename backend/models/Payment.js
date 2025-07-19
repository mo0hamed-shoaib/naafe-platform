import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  jobRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRequest',
    required: true
  },
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stripeSessionId: {
    type: String,
    required: true,
    unique: true
  },
  stripePaymentIntentId: {
    type: String,
    sparse: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'usd',
    enum: ['usd', 'egp']
  },
  originalCurrency: {
    type: String,
    default: 'EGP'
  },
  originalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  serviceTitle: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'card'
  },
  metadata: {
    type: Map,
    of: String
  },
  completedAt: {
    type: Date
  },
  failedAt: {
    type: Date
  },
  failureReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ conversationId: 1 });
paymentSchema.index({ seekerId: 1 });
paymentSchema.index({ providerId: 1 });
paymentSchema.index({ stripeSessionId: 1 }, { unique: true });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return (this.amount / 100).toFixed(2);
});

// Method to mark payment as completed
paymentSchema.methods.markCompleted = function(paymentIntentId) {
  this.status = 'completed';
  this.stripePaymentIntentId = paymentIntentId;
  this.completedAt = new Date();
  return this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markFailed = function(reason) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.failureReason = reason;
  return this.save();
};

// Static method to find by session ID
paymentSchema.statics.findBySessionId = function(sessionId) {
  return this.findOne({ stripeSessionId: sessionId });
};

// Static method to get payments by conversation
paymentSchema.statics.findByConversation = function(conversationId) {
  return this.find({ conversationId }).sort({ createdAt: -1 });
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment; 