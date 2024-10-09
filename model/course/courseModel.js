import mongoose from "mongoose";
import Content from "../content/contentModel.js";

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
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    unique: true,
  },
  contents: [Content],
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
