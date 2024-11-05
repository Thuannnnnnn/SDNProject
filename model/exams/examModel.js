import mongoose from 'mongoose';

const { Schema } = mongoose;

const examSchema = new Schema({
  courseId: {
    type: String,
    required: true,
  },
  questionNumber: {
    type: Number,
    required: true, // Automatically calculated when creating/updating the exam
  },
  questions: [
    {
      questionId: {
        type: String,
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        validate: {
          validator: function (v) {
            return v.length > 1;
          },
          message: "Options array must contain at least two options.",
        },
      },
      answer: {
        type: Number,
        required: true,
      },
    },
  ],
  examDate: {
    type: Date,
    default: Date.now,
  },
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
