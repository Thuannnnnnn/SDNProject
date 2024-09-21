import mongoose from "mongoose";

// Định nghĩa schema
const Content = new mongoose.Schema({
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
  contentType: {
    type: String,
    required: true,
    unique: true,
  },
  contentRef: {
    type: String,
    required: true,
    unique: true,
  },
  createDate: {
    type: String,
    required: true,
  },
}, { _id: false });

// Xuất model để sử dụng ở các nơi khác
export default Content;
