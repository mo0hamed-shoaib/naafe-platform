import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  jobRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRequest',
    required: true
  },
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  },
  seeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  commission: {
    type: Number,
    required: true,
    min: [0, 'Commission cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  currency: {
    type: String,
    enum: ['EGP', 'USD', 'EUR'],
    default: 'EGP',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymobOrderId: {
    type: String,
    required: true
  },
  paymobPaymentKey: {
    type: String,
    required: true
  },
  paymobTransactionId: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'wallet', 'cash', 'bank_transfer'],
    default: 'card'
  },
  // Remove any Stripe-related fields that might exist
  stripePaymentIntentId: {
    type: String,
    sparse: true // This allows multiple null values
  },
  transactionData: {
    type: mongoose.Schema.Types.Mixed
  },
  completedAt: {
    type: Date
  },
  failureReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ jobRequestId: 1 });
paymentSchema.index({ seeker: 1, status: 1 });
paymentSchema.index({ provider: 1, status: 1 });
paymentSchema.index({ paymobOrderId: 1 });
paymentSchema.index({ status: 1, createdAt: 1 });

// Validation middleware
paymentSchema.pre('save', function(next) {
  if (this.isNew) {
    // Validate that total amount equals amount + commission (with tolerance for floating point)
    const expectedTotal = Math.round((this.amount + this.commission) * 100) / 100;
    const actualTotal = Math.round(this.totalAmount * 100) / 100;
    if (actualTotal !== expectedTotal) {
      return next(new Error(`Total amount (${actualTotal}) must equal amount (${this.amount}) plus commission (${this.commission}) = ${expectedTotal}`));
    }
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment; 