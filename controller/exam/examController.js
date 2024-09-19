import Exam from "../../model/exam/exam.js";

// Lấy tất cả các exam
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams", error: error.message });
  }
};

// Tạo exam mới
export const createExam = async (req, res) => {
  try {
    const { examId, courseId, content } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!examId || !courseId || !content || !Array.isArray(content)) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Tạo exam mới
    const newExam = new Exam({
      examId,
      courseId,
      content,
    });

    const savedExam = await newExam.save();
    res.status(201).json({ message: "Exam created successfully", exam: savedExam });
  } catch (error) {
    res.status(500).json({ message: "Error creating exam", error: error.message });
  }
};

// Cập nhật một exam
export const updateExam = async (req, res) => {
  try {
    const { examId, content } = req.body;

    const exam = await Exam.findOne({ examId });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    exam.content = content || exam.content;
    const updatedExam = await exam.save();

    res.status(200).json({ message: "Exam updated successfully", exam: updatedExam });
  } catch (error) {
    res.status(500).json({ message: "Error updating exam", error: error.message });
  }
};

// Xóa một exam
export const deleteExam = async (req, res) => {
  try {
    const { examId } = req.body;

    const exam = await Exam.findOneAndDelete({ examId });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam", error: error.message });
  }
};
