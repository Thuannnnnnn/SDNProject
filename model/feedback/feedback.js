import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  feedbackText: {
    type: String,
    default: '',
  },
  createDate: {
    type: Date,
    default: Date.now,
  }
});

// Prevent model overwrite error
const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;
