import mongoose from "mongoose";

const ProcessSchema = new mongoose.Schema({
  processId: {
    type: String,
    required: true,
    unique: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  content: [
    {
      contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses.contents",
      },
      isComplete: {
        type: Boolean,
        default: false,
      },
    },
  ],
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Process = mongoose.model("Process", ProcessSchema);
export default Process;
