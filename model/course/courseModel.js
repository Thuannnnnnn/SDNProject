import mongoose from "mongoose";
import contents from "../content/contentModel.js";

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    require: true,
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
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  contents: [contents],
});

const Course = mongoose.model("Courses", courseSchema);

export default Course;
