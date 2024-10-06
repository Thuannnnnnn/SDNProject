import mongoose from "mongoose";

// Định nghĩa schema
const Content = new mongoose.Schema(
  {
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
      enum: ["videos", "docs", "questions"],
    },
    contentRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "contentType",
      unique: true,
    },
    createDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false }
);
export default Content;
