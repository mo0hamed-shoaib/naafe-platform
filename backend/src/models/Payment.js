import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
    required: [true, 'معرف الطلب مطلوب']
  },
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف الباحث مطلوب']
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف المزود مطلوب']
  },
  
  // Payment details
  amount: {
    type: Number,
    required: [true, 'المبلغ مطلوب'],
    min: [0, 'المبلغ يجب أن يكون أكبر من صفر']
  },
  platformFee: {
    type: Number,
    required: [true, 'رسوم المنصة مطلوبة'],
    min: [0, 'رسوم المنصة يجب أن تكون أكبر من أو تساوي صفر']
  },
  providerAmount: {
    type: Number,
    required: [true, 'مبلغ المزود مطلوب'],
    min: [0, 'مبلغ المزود يجب أن يكون أكبر من أو تساوي صفر']
  },
  
  // Payment method
  paymentMethod: {
    type: String,
    enum: ['stripe', 'cod', 'bank_transfer', 'cash', 'vodafone_cash', 'meeza', 'fawry'],
    required: [true, 'طريقة الدفع مطلوبة']
  },
  paymentGateway: {
    type: String,
    required: false,
    default: 'manual'
  }, // 'stripe', 'manual', etc.
  
  // Transaction details
  transactionId: {
    type: String,
    required: false
  }, // Gateway transaction ID
  paymentDate: {
    type: Date,
    required: false
  },
  verificationDate: {
    type: Date,
    required: false
  }, // For manual payments
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }, // Admin who verified manual payment
  
  status: {
    type: String,
    enum: ['pending', 'agreed', 'completed', 'disputed', 'refunded', 'failed'],
    default: 'pending'
  },
  
  // Payment schedule
  paymentType: {
    type: String,
    enum: ['deposit', 'milestone', 'final'],
    required: [true, 'نوع الدفع مطلوب']
  },
  
  // Dispute information
  dispute: {
    reason: {
      type: String,
      required: false,
      maxlength: [500, 'سبب النزاع لا يمكن أن يتجاوز 500 حرف']
    },
    raisedBy: {
      type: String,
      enum: ['seeker', 'provider'],
      required: false
    },
    raisedAt: {
      type: Date,
      required: false
    },
    resolvedAt: {
      type: Date,
      required: false
    },
    resolution: {
      type: String,
      enum: ['refund_to_seeker', 'pay_to_provider', 'partial_refund', 'dispute_closed'],
      required: false
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  
  // Refund information
  refund: {
    amount: {
      type: Number,
      required: false,
      min: [0, 'مبلغ الاسترداد يجب أن يكون أكبر من أو تساوي صفر']
    },
    reason: {
      type: String,
      required: false,
      maxlength: [500, 'سبب الاسترداد لا يمكن أن يتجاوز 500 حرف']
    },
    processedAt: {
      type: Date,
      required: false
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Additional metadata
  notes: {
    type: String,
    required: false,
    maxlength: [1000, 'الملاحظات لا يمكن أن تتجاوز 1000 حرف']
  },
  
  // Receipt information
  receipt: {
    number: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for total amount including fees
paymentSchema.virtual('totalAmount').get(function() {
  return this.amount + this.platformFee
})

// Virtual for days since creation
paymentSchema.virtual('daysSinceCreation').get(function() {
  const now = new Date()
  const created = new Date(this.createdAt)
  const diffTime = Math.abs(now - created)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Indexes for better query performance
paymentSchema.index({ requestId: 1 })
paymentSchema.index({ seekerId: 1 })
paymentSchema.index({ providerId: 1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ paymentMethod: 1 })
paymentSchema.index({ paymentType: 1 })
paymentSchema.index({ createdAt: -1 })
paymentSchema.index({ paymentDate: -1 })
paymentSchema.index({ transactionId: 1 })
paymentSchema.index({ 
  requestId: 1, 
  paymentType: 1 
})
paymentSchema.index({ 
  status: 1, 
  paymentDate: 1 
})

// Compound index for payment tracking
paymentSchema.index({ 
  seekerId: 1, 
  status: 1, 
  createdAt: -1 
})

// Pre-save middleware to validate amounts
paymentSchema.pre('save', function(next) {
  // Validate that amounts add up correctly
  const calculatedProviderAmount = this.amount - this.platformFee
  if (Math.abs(calculatedProviderAmount - this.providerAmount) > 0.01) {
    return next(new Error('مبلغ المزود يجب أن يساوي المبلغ الإجمالي ناقص رسوم المنصة'))
  }
  
  // Validate that provider amount is not negative
  if (this.providerAmount < 0) {
    return next(new Error('مبلغ المزود لا يمكن أن يكون سالب'))
  }
  
  next()
})

// Pre-save middleware to set payment date
paymentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.paymentDate) {
    this.paymentDate = new Date()
  }
  next()
})

// Instance method to mark as completed
paymentSchema.methods.complete = function() {
  this.status = 'completed'
  this.paymentDate = new Date()
  return this.save()
}

// Instance method to raise dispute
paymentSchema.methods.raiseDispute = function(raisedBy, reason) {
  this.status = 'disputed'
  this.dispute = {
    reason,
    raisedBy,
    raisedAt: new Date()
  }
  return this.save()
}

// Instance method to resolve dispute
paymentSchema.methods.resolveDispute = function(resolution, resolvedBy) {
  this.dispute.resolution = resolution
  this.dispute.resolvedAt = new Date()
  this.dispute.resolvedBy = resolvedBy
  
  if (resolution === 'refund_to_seeker') {
    this.status = 'refunded'
  } else if (resolution === 'pay_to_provider') {
    this.status = 'completed'
  } else {
    this.status = 'completed'
  }
  
  return this.save()
}

// Instance method to process refund
paymentSchema.methods.processRefund = function(amount, reason, processedBy) {
  this.status = 'refunded'
  this.refund = {
    amount,
    reason,
    processedAt: new Date(),
    processedBy
  }
  return this.save()
}

// Instance method to verify manual payment
paymentSchema.methods.verifyManualPayment = function(verifiedBy) {
  this.status = 'completed'
  this.verificationDate = new Date()
  this.verifiedBy = verifiedBy
  this.paymentDate = new Date()
  return this.save()
}

// Static method to find pending payments
paymentSchema.statics.findPending = function() {
  return this.find({
    status: 'pending'
  })
}

// Static method to find payments by request
paymentSchema.statics.findByRequest = function(requestId) {
  return this.find({
    requestId
  }).populate('seekerId', 'name.first name.last')
    .populate('providerId', 'name.first name.last')
}

// Static method to find payments by user
paymentSchema.statics.findByUser = function(userId, role) {
  const query = role === 'seeker' ? { seekerId: userId } : { providerId: userId }
  return this.find(query)
}

// Static method to find completed payments
paymentSchema.statics.findCompleted = function() {
  return this.find({
    status: 'completed'
  })
}

// Static method to find disputed payments
paymentSchema.statics.findDisputed = function() {
  return this.find({
    status: 'disputed'
  })
}

// Static method to find payments by method
paymentSchema.statics.findByMethod = function(method) {
  return this.find({
    paymentMethod: method
  })
}

// Static method to get payment statistics
paymentSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalFees: { $sum: '$platformFee' }
      }
    }
  ])
  
  return stats
}

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment
