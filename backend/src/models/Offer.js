import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
    required: [true, 'معرف الطلب مطلوب']
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف المزود مطلوب']
  },
  
  // Offer details
  price: {
    type: Number,
    required: [true, 'السعر مطلوب'],
    min: [0, 'السعر يجب أن يكون أكبر من صفر']
  },
  
  timeline: {
    startDate: {
      type: Date,
      required: [true, 'تاريخ البدء مطلوب']
    },
    duration: {
      type: String,
      required: [true, 'مدة العمل مطلوبة'],
      maxlength: [50, 'مدة العمل لا يمكن أن تتجاوز 50 حرف']
    },
    estimatedHours: {
      type: Number,
      required: false,
      min: [0, 'عدد الساعات يجب أن يكون أكبر من صفر']
    }
  },
  
  scopeOfWork: {
    type: String,
    required: [true, 'نطاق العمل مطلوب'],
    trim: true,
    maxlength: [1000, 'نطاق العمل لا يمكن أن يتجاوز 1000 حرف']
  },
  
  materialsIncluded: [{
    type: String,
    trim: true,
    maxlength: [100, 'اسم المادة لا يمكن أن يتجاوز 100 حرف']
  }],
  
  warranty: {
    type: String,
    required: false,
    maxlength: [200, 'الضمان لا يمكن أن يتجاوز 200 حرف']
  },
  
  // Payment terms
  paymentSchedule: {
    deposit: {
      type: Number,
      default: 0,
      min: [0, 'الدفعة المقدمة يجب أن تكون أكبر من أو تساوي صفر']
    },
    milestone: {
      type: Number,
      default: 0,
      min: [0, 'الدفعة المرحلية يجب أن تكون أكبر من أو تساوي صفر']
    },
    final: {
      type: Number,
      required: [true, 'الدفعة النهائية مطلوبة'],
      min: [0, 'الدفعة النهائية يجب أن تكون أكبر من أو تساوي صفر']
    }
  },
  
  // Additional terms
  terms: {
    type: String,
    required: false,
    maxlength: [500, 'الشروط لا يمكن أن تتجاوز 500 حرف']
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired', 'withdrawn'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: [true, 'تاريخ انتهاء الصلاحية مطلوب']
  },
  acceptedAt: {
    type: Date,
    required: false
  },
  rejectedAt: {
    type: Date,
    required: false
  },
  withdrawnAt: {
    type: Date,
    required: false
  },
  
  // Additional metadata
  isRecommended: {
    type: Boolean,
    default: false
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  // Communication
  messages: [{
    sender: {
      type: String,
      enum: ['provider', 'seeker'],
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, 'الرسالة لا يمكن أن تتجاوز 500 حرف']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for total payment
offerSchema.virtual('totalPayment').get(function() {
  return this.paymentSchedule.deposit + this.paymentSchedule.milestone + this.paymentSchedule.final
})

// Virtual for time until expiry
offerSchema.virtual('timeUntilExpiry').get(function() {
  if (!this.expiresAt) return null
  const now = new Date()
  const expiry = new Date(this.expiresAt)
  return Math.max(0, expiry - now)
})

// Virtual for is expired
offerSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false
  return new Date() > new Date(this.expiresAt)
})

// Virtual for days since creation
offerSchema.virtual('daysSinceCreation').get(function() {
  const now = new Date()
  const created = new Date(this.createdAt)
  const diffTime = Math.abs(now - created)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Indexes for better query performance
offerSchema.index({ requestId: 1 })
offerSchema.index({ providerId: 1 })
offerSchema.index({ status: 1 })
offerSchema.index({ price: 1 })
offerSchema.index({ createdAt: -1 })
offerSchema.index({ expiresAt: 1 })
offerSchema.index({ isRecommended: 1 })
offerSchema.index({ 
  requestId: 1, 
  status: 1 
})
offerSchema.index({ 
  providerId: 1, 
  status: 1 
})

// Compound index for offer comparison
offerSchema.index({ 
  requestId: 1, 
  price: 1, 
  status: 1 
})

// Pre-save middleware to set expiry date if not provided
offerSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Default expiry: 7 days from creation
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 7)
    this.expiresAt = expiry
  }
  
  // Validate payment schedule
  const total = this.paymentSchedule.deposit + this.paymentSchedule.milestone + this.paymentSchedule.final
  if (Math.abs(total - this.price) > 0.01) { // Allow for floating point precision
    return next(new Error('مجموع جدول الدفع يجب أن يساوي السعر الإجمالي'))
  }
  
  next()
})

// Pre-save middleware to update status based on expiry
offerSchema.pre('save', function(next) {
  if (this.isExpired && this.status === 'pending') {
    this.status = 'expired'
  }
  next()
})

// Instance method to accept offer
offerSchema.methods.accept = function() {
  this.status = 'accepted'
  this.acceptedAt = new Date()
  return this.save()
}

// Instance method to reject offer
offerSchema.methods.reject = function() {
  this.status = 'rejected'
  this.rejectedAt = new Date()
  return this.save()
}

// Instance method to withdraw offer
offerSchema.methods.withdraw = function() {
  if (this.status === 'pending') {
    this.status = 'withdrawn'
    this.withdrawnAt = new Date()
    return this.save()
  }
  return Promise.reject(new Error('لا يمكن سحب العرض في هذه الحالة'))
}

// Instance method to add message
offerSchema.methods.addMessage = function(sender, message) {
  this.messages.push({
    sender,
    message,
    timestamp: new Date()
  })
  return this.save()
}

// Instance method to add view
offerSchema.methods.addView = function() {
  this.views += 1
  return this.save()
}

// Static method to find pending offers
offerSchema.statics.findPending = function() {
  return this.find({
    status: 'pending',
    expiresAt: { $gt: new Date() }
  })
}

// Static method to find offers by request
offerSchema.statics.findByRequest = function(requestId) {
  return this.find({
    requestId,
    status: { $in: ['pending', 'accepted'] }
  }).populate('providerId', 'name.first name.last avatarUrl providerProfile.rating')
}

// Static method to find offers by provider
offerSchema.statics.findByProvider = function(providerId) {
  return this.find({
    providerId,
    status: { $in: ['pending', 'accepted', 'rejected'] }
  }).populate('requestId', 'title category urgency')
}

// Static method to find accepted offers
offerSchema.statics.findAccepted = function() {
  return this.find({
    status: 'accepted'
  })
}

// Static method to find expired offers
offerSchema.statics.findExpired = function() {
  return this.find({
    status: 'pending',
    expiresAt: { $lte: new Date() }
  })
}

// Static method to find recommended offers
offerSchema.statics.findRecommended = function() {
  return this.find({
    isRecommended: true,
    status: 'pending',
    expiresAt: { $gt: new Date() }
  })
}

const Offer = mongoose.model('Offer', offerSchema)

export default Offer
