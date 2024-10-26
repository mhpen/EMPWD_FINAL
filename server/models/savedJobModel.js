import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate saves
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });
const SavedJob = mongoose.models.SavedJob || mongoose.model('SavedJob', savedJobSchema);

export default mongoose.model('SavedJob', savedJobSchema);
