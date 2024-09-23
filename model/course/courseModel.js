import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  contentId: {
    type: String,
    required: true,
    unique: true,
  },
  contentName: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
    enum: ['videos', 'Docs', 'Question', 'Exam'], // Xác định loại bảng
  },
  contentRef: {
    type: mongoose.Schema.Types.ObjectId,  // Sử dụng ObjectId để tham chiếu
    refPath: 'contentType',  // Dựa trên contentType để chọn bảng
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });  // _id: false để không tạo id cho mỗi phần tử của contents

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  posterLink: {
    type: String,
    required: true,
  },
  createDate: {
    type: String,
    required: true,
  },
  videoIntro: {
    type: String,
    required: true,
  },
  userGenerated: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  contents: [contentSchema],  // Sử dụng schema riêng cho nội dung của từng khóa học
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
