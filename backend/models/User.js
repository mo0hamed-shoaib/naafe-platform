import mongoose from 'mongoose';
const { Schema } = mongoose;

const baseUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    name: {
        first: {
            type: String,
            required: true,
            trim: true,
            minlength: [2, 'First name must be at least 2 characters']
        },
        last: {
            type: String,
            required: true,
            trim: true,
            minlength: [2, 'Last name must be at least 2 characters']
        }
    },
    phone: {
        type: String,
        required: true,
        match: [/^(\+20|0)?1[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number']
    },
    avatarUrl: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['admin', 'seeker', 'provider'],
        required: true
    },
    // Profile & Location (GeoJSON)
    profile: {
        bio: {
            type: String,
            maxlength: 1000,
            trim: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0] // [longitude, latitude]
            }
                }
      },
    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    blockedReason: String,
    lastLoginAt: Date
}, {
    discriminatorKey: 'role',
    timestamps: true
});

// Indexes
baseUserSchema.index({ 'profile.location': '2dsphere' });
baseUserSchema.index({ role: 1, isActive: 1 });

// Virtual for full name
baseUserSchema.virtual('fullName').get(function() {
    return `${this.name.first} ${this.name.last}`;
});

const User = mongoose.model('User', baseUserSchema);
export default User;