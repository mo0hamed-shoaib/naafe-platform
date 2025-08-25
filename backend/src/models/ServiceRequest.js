import mongoose from 'mongoose'

const serviceRequestSchema = new mongoose.Schema({
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'معرف الباحث مطلوب']
  },
  category: {
    type: String,
    required: [true, 'فئة الخدمة مطلوبة'],
    enum: ['cleaning', 'plumbing', 'electrical', 'moving', 'painting', 'carpentry', 'gardening', 'maintenance']
  },
  subcategory: {
    type: String,
    required: [true, 'نوع الخدمة الفرعي مطلوب']
  },
  title: {
    type: String,
    required: [true, 'عنوان الطلب مطلوب'],
    trim: true,
    maxlength: [100, 'العنوان لا يمكن أن يتجاوز 100 حرف']
  },
  description: {
    type: String,
    required: [true, 'وصف الطلب مطلوب'],
    trim: true,
    maxlength: [1000, 'الوصف لا يمكن أن يتجاوز 1000 حرف']
  },
  urgency: {
    type: String,
    enum: ['ASAP', 'This week', 'Flexible'],
    required: [true, 'مستوى الأولوية مطلوب'],
    default: 'Flexible'
  },
  
  // Private location (not shared publicly)
  location: {
    governorate: {
      type: String,
      required: [true, 'المحافظة مطلوبة']
    },
    city: {
      type: String,
      required: [true, 'المدينة مطلوبة']
    }
  },
  
  images: [{
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return v.length <= 10 // Maximum 10 images
      },
      message: 'لا يمكن رفع أكثر من 10 صور'
    }
  }],
  
  answers: [{
    type: String,
    required: false
  }], // Dynamic questions based on category
  
  status: {
    type: String,
    enum: ['active', 'in_progress', 'completed', 'cancelled'],
    default: 'active'
  },
  
  // Matching and offers
  recommendedProviders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }], // Provider IDs
  
  offers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  }], // Offer IDs
  
  selectedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  
  selectedOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: false
  },
  
  // Budget information
  budget: {
    min: {
      type: Number,
      required: false,
      min: 0
    },
    max: {
      type: Number,
      required: false,
      min: 0
    },
    currency: {
      type: String,
      default: 'EGP',
      enum: ['EGP', 'USD']
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
  expiresAt: {
    type: Date,
    required: [true, 'تاريخ انتهاء الصلاحية مطلوب']
  },
  completedAt: {
    type: Date,
    required: false
  },
  
  // Additional metadata
  views: {
    type: Number,
    default: 0
  },
  
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for time until expiry
serviceRequestSchema.virtual('timeUntilExpiry').get(function() {
  if (!this.expiresAt) return null
  const now = new Date()
  const expiry = new Date(this.expiresAt)
  return Math.max(0, expiry - now)
})

// Virtual for is expired
serviceRequestSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false
  return new Date() > new Date(this.expiresAt)
})

// Virtual for offer count
serviceRequestSchema.virtual('offerCount').get(function() {
  return this.offers ? this.offers.length : 0
})

// Virtual for days since creation
serviceRequestSchema.virtual('daysSinceCreation').get(function() {
  const now = new Date()
  const created = new Date(this.createdAt)
  const diffTime = Math.abs(now - created)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Indexes for better query performance
serviceRequestSchema.index({ seekerId: 1 })
serviceRequestSchema.index({ category: 1 })
serviceRequestSchema.index({ status: 1 })
serviceRequestSchema.index({ 'location.governorate': 1 })
serviceRequestSchema.index({ 'location.city': 1 })
serviceRequestSchema.index({ urgency: 1 })
serviceRequestSchema.index({ createdAt: -1 })
serviceRequestSchema.index({ expiresAt: 1 })
serviceRequestSchema.index({ isUrgent: 1 })
serviceRequestSchema.index({ isFeatured: 1 })
serviceRequestSchema.index({ 
  category: 1, 
  status: 1, 
  'location.governorate': 1 
})

// Compound index for provider matching
serviceRequestSchema.index({ 
  category: 1, 
  status: 1, 
  expiresAt: 1 
})

// Pre-save middleware to set expiry date if not provided
serviceRequestSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Default expiry: 30 days from creation
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 30)
    this.expiresAt = expiry
  }
  
  // Set urgent flag based on urgency level
  if (this.urgency === 'ASAP') {
    this.isUrgent = true
  }
  
  next()
})

// Pre-save middleware to update status based on expiry
serviceRequestSchema.pre('save', function(next) {
  if (this.isExpired && this.status === 'active') {
    this.status = 'cancelled'
  }
  next()
})

// Instance method to add view
serviceRequestSchema.methods.addView = function() {
  this.views += 1
  return this.save()
}

// Instance method to add offer
serviceRequestSchema.methods.addOffer = function(offerId) {
  if (!this.offers.includes(offerId)) {
    this.offers.push(offerId)
    return this.save()
  }
  return Promise.resolve(this)
}

// Instance method to select offer
serviceRequestSchema.methods.selectOffer = function(offerId, providerId) {
  this.selectedOffer = offerId
  this.selectedProvider = providerId
  this.status = 'in_progress'
  return this.save()
}

// Instance method to complete request
serviceRequestSchema.methods.complete = function() {
  this.status = 'completed'
  this.completedAt = new Date()
  return this.save()
}

// Instance method to cancel request
serviceRequestSchema.methods.cancel = function() {
  this.status = 'cancelled'
  return this.save()
}

// Static method to find active requests
serviceRequestSchema.statics.findActive = function() {
  return this.find({
    status: 'active',
    expiresAt: { $gt: new Date() }
  })
}

// Static method to find requests by category
serviceRequestSchema.statics.findByCategory = function(category) {
  return this.find({
    category,
    status: 'active',
    expiresAt: { $gt: new Date() }
  })
}

// Static method to find requests by location
serviceRequestSchema.statics.findByLocation = function(governorate, city = null) {
  const query = {
    'location.governorate': governorate,
    status: 'active',
    expiresAt: { $gt: new Date() }
  }
  
  if (city) {
    query['location.city'] = city
  }
  
  return this.find(query)
}

// Static method to find urgent requests
serviceRequestSchema.statics.findUrgent = function() {
  return this.find({
    isUrgent: true,
    status: 'active',
    expiresAt: { $gt: new Date() }
  })
}

// Static method to find expired requests
serviceRequestSchema.statics.findExpired = function() {
  return this.find({
    status: 'active',
    expiresAt: { $lte: new Date() }
  })
}

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema)

export default ServiceRequest
