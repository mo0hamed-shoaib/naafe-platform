import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'offer_accepted',
      'offer_received',
      'offer_rejected',
      'new_message',
      'job_completed',
      'reminder',
      'system',
      'custom'
    ],
    default: 'custom'
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  relatedChatId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    default: null
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for sorting and querying
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification; 