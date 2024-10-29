import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // Import UUID to generate unique IDs

const QandASchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  QandAText: {
    type: String,
    default: '',
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      replyId: {
        type: String,
        default: uuidv4,  // Automatically generate a unique ID for each reply
      },
      replyText: {
        type: String,
        required: true,
      },
      repliedBy: {
        type: String,
        required: true,
      },
      createDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Prevent model overwrite error
const QandA = mongoose.models.QandA || mongoose.model('QandA', QandASchema);

export default QandA;
