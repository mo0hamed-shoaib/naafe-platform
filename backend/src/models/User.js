import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'يرجى إدخال بريد إلكتروني صحيح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل']
  },
  name: {
    first: {
      type: String,
      required: [true, 'الاسم الأول مطلوب'],
      trim: true,
      maxlength: [50, 'الاسم الأول لا يمكن أن يتجاوز 50 حرف']
    },
    last: {
      type: String,
      required: [true, 'اسم العائلة مطلوب'],
      trim: true,
      maxlength: [50, 'اسم العائلة لا يمكن أن يتجاوز 50 حرف']
    }
  },
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    match: [/^(\+20|0)?1[0125][0-9]{8}$/, 'يرجى إدخال رقم هاتف مصري صحيح']
  },
  avatarUrl: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['seeker', 'provider', 'admin'],
    default: 'seeker'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['none', 'basic', 'skill', 'approved'],
    default: 'none'
  },
  
  // Provider-specific fields
  providerProfile: {
    skills: [{
      category: {
        type: String,
        required: true
      },
      subcategory: {
        type: String,
        required: true
      },
      verified: {
        type: Boolean,
        default: false
      },
      yearsOfExperience: {
        type: Number,
        min: 0,
        max: 50
      }
    }],
    verificationDocuments: [{
      type: String,
      required: false
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    availability: {
      workingDays: [{
        type: String,
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      }],
      startTime: {
        type: String,
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'يرجى إدخال وقت صحيح (HH:MM)']
      },
      endTime: {
        type: String,
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'يرجى إدخال وقت صحيح (HH:MM)']
      }
    },
    portfolio: [{
      title: {
        type: String,
        required: true,
        maxlength: [100, 'عنوان المشروع لا يمكن أن يتجاوز 100 حرف']
      },
      description: {
        type: String,
        required: true,
        maxlength: [500, 'وصف المشروع لا يمكن أن يتجاوز 500 حرف']
      },
      images: [{
        type: String,
        required: true
      }],
      category: {
        type: String,
        required: true
      },
      completedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Seeker-specific fields
  seekerProfile: {
    totalJobsPosted: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    preferredCategories: [{
      type: String
    }],
    location: {
      governorate: {
        type: String,
        required: false
      },
      city: {
        type: String,
        required: false
      }
    }
  },
  
  // Admin-specific fields
  adminProfile: {
    role: {
      type: String,
      enum: ['super_admin', 'support_admin', 'verification_admin', 'content_admin'],
      default: 'support_admin'
    },
    permissions: [{
      type: String
    }],
    assignedRegions: [{
      type: String
    }]
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
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
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.name.first} ${this.name.last}`
})

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.name.first
})

// Indexes for better query performance
userSchema.index({ email: 1 })
userSchema.index({ phone: 1 })
userSchema.index({ role: 1 })
userSchema.index({ isVerified: 1 })
userSchema.index({ 'providerProfile.rating': -1 })
userSchema.index({ 'seekerProfile.rating': -1 })
userSchema.index({ createdAt: -1 })

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Pre-save middleware to update verification status
userSchema.pre('save', function(next) {
  if (this.isModified('isVerified') && this.isVerified) {
    this.verificationStatus = 'basic'
  }
  next()
})

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject()
  
  // Remove sensitive information
  delete userObject.password
  delete userObject.__v
  
  // Remove admin-specific fields for non-admin users
  if (this.role !== 'admin') {
    delete userObject.adminProfile
  }
  
  return userObject
}

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Static method to find verified providers
userSchema.statics.findVerifiedProviders = function() {
  return this.find({
    role: 'provider',
    isVerified: true,
    isActive: true
  })
}

// Static method to find seekers
userSchema.statics.findSeekers = function() {
  return this.find({
    role: 'seeker',
    isActive: true
  })
}

const User = mongoose.model('User', userSchema)

export default User
