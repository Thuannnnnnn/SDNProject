import mongoose from "mongoose";

const courses = new mongoose.Schema({
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
});

const Course = mongoose.model("Courses", courses);

export default Course;
