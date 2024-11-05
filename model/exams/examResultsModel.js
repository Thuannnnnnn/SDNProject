import mongoose from "mongoose";

const { Schema } = mongoose;

const examResultsSchema = new Schema({
  courseId: {
    type: String,
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      selectedAnswer: {
        type: Number,
        required: true,
      },
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  passed: {
    type: Boolean,
    default: false,
  },
  attemptDate: {
    type: Date,
    default: Date.now,
  },
});

const ExamResults = mongoose.model("ExamResults", examResultsSchema);

export default ExamResults;
