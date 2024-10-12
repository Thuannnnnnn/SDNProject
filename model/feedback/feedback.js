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
  ratingPoint: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
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
