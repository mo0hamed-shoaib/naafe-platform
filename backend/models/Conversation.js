import mongoose from 'mongoose';
const { Schema } = mongoose;

const conversationSchema = new Schema({
  jobRequestId: {
    type: Schema.Types.ObjectId,
    ref: 'JobRequest',
    required: true,
    unique: true
  },
  participants: {
    seeker: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  lastMessage: {
    content: String,
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: Date
  },
  unreadCount: {
    seeker: {
      type: Number,
      default: 0
    },
    provider: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
conversationSchema.index({ jobRequestId: 1 });
conversationSchema.index({ 'participants.seeker': 1 });
conversationSchema.index({ 'participants.provider': 1 });
conversationSchema.index({ 'participants.seeker': 1, 'participants.provider': 1 });

// Compound index for finding conversations by either participant
conversationSchema.index({ 
  $or: [
    { 'participants.seeker': 1 },
    { 'participants.provider': 1 }
  ]
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation; 