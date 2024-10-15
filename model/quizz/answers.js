import mongoose, { Schema } from "mongoose";

const resultModel = new Schema({
  result: { type: Array, default: [] },
  attempts: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  achieved: { // Sửa lỗi chính tả
    type: String,
    default: "",
  },
  createdAt: { // Thêm createdAt để lưu thời gian tạo
    type: Date,
    default: Date.now,
  },
  selectedItemId: { // Thêm trường selectedItemId
    type: String,
    default: null,
  },
});

export default mongoose.model("Result", resultModel);