import mongoose from 'mongoose';

// Định nghĩa schema
const ContentSchema = new mongoose.Schema({
  contentId: {
    type: String,
    required: true,
    unique: true,
  },
  contentName: {
    type: String,
    required: true,
    unique: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  createDate: {
    type: String,
    required: true,
  },
});

// Tạo model từ schema
const Content = mongoose.model('Content', ContentSchema);

// Xuất model để sử dụng ở các nơi khác
export default Content;
