import Course from "../../model/course/courseModel.js";

export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find();
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

function isNumber(value) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

export const createCourse = async (req, res) => {
  try {
    const { courseName, description, posterLink, userGenerated, videoIntro, price, category } =
      req.body;
    // Kiểm tra nếu thiếu các trường bắt buộc
    if (!courseName || !description || !posterLink || !category) {

      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const name = await Course.findOne({ courseName });

    // Kiểm tra xem tên khóa học đã tồn tại chưa
    if (name && courseName.toUpperCase() === name.courseName.toUpperCase()) {
      return res.status(400).json({ message: "Course name already exists" });
    }

    const existingCourse = await Course.findOne({ courseName });

    // Kiểm tra xem tên khóa học đã tồn tại chưa
    if (existingCourse) {
      return res.status(400).json({ message: "Course name already exists" });
    }

    if (isNumber(price) == false) {
      return res.status(500).json({ message: "price must number" });
    }

    const courseId = genaretedId(courseName, category);
    // tao today
    const today = new Date();
    const createDate = today.toISOString().split("T")[0];

    const newCourse = new Course({
      courseId,
      courseName,
      description,
      posterLink,
      createDate,
      userGenerated,
      videoIntro,
      price,
      category,
      contents: [],
    });
    // Lưu vào cơ sở dữ liệu
    const savedCourse = await newCourse.save();

    // Trả về kết quả thành công
    res.status(201).json({
      message: "Course created successfully!",
      course: savedCourse,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating course",
      error: error.message,
    });
  }
};

function genaretedId(coursesName, category) {
  let firstChars = category
    .split(" ")
    .map((word) => word[0])
    .join("");

  const courseIdUpdated =
    firstChars.toLowerCase() +
    "_" +
    coursesName.toLowerCase().replace(/\s/g, "_");

  return courseIdUpdated;
}

export const updatedCourse = async (req, res) => {
  try {
    const {
      courseId,
      courseName,
      description,
      posterLink,
      userGenerated,
      videoIntro,
      price,
      category,
    } = req.body;
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!isNumber(price)) {
      return res.status(500).json({ message: "price must number" });
    }

    // Tạo ngày hôm nay
    const today = new Date();
    const date = today.toISOString().split("T")[0];

    course.courseId = genaretedId(courseName, category);
    course.courseName = courseName || course.courseName;
    course.description = description || course.description;
    course.posterLink = posterLink || course.posterLink;
    course.createDate = date;
    course.userGenerated = userGenerated || course.userGenerated;
    course.videoIntro = videoIntro || course.videoIntro;
    course.price = price || course.price;
    course.category = category || course.category;

    const updatedCourse = await course.save();

    res.status(200).json({
      message: "Course updated successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const  courseId  = req.params.courseId;
    const course = await Course.findOneAndDelete({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "deteled course successfull!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deteling course", error: error.message });
  }
};
