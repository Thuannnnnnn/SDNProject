import mongoose from "mongoose";

// Định nghĩa schema
const Content = new mongoose.Schema(
  {
    contentId: {
      type: String,
      required: true,
      unique: false,
    },
    contentName: {
      type: String,
      required: true,
      unique: false,
    },
    contentType: {
      type: String,
      required: true,
      enum: ["videos", "docs", "questions"],
    },
    contentRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "contentType",
      unique: false,
    },
    createDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
);
export default Content;
