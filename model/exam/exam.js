import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  answerText: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }, // Đáp án đúng
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  answers: [answerSchema],
});

const examSchema = new mongoose.Schema({
  examId: { type: String, required: true, unique: true },
  courseId: { type: String, required: true },
  content: [questionSchema],
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
