import mongoose from 'mongoose';

const UpgradeRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  attachments: [{
    type: String, // file URLs
    required: true,
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    index: true,
  },
  rejectionComment: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.model('UpgradeRequest', UpgradeRequestSchema); 