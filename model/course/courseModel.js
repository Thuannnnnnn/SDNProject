import mongoose from "mongoose";

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
  docLink: {
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
  contents: [{ type: String, ref: "Content" }],
});

const Course = mongoose.model("Courses", courseSchema);

export default Course;
