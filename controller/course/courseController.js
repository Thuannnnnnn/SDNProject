import Course from "../../model/course/courseModel.js";
import Docs from "../../model/docs/docsModel.js";
import Exam from "../../model/exam/exam.js";
import Question from "../../model/quizz/question.js";
import Video from "../../model/video/videoModel.js";
function isNumber(value) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}
export const getAllCourses = async (req, res) => {
  try {
    // Lấy tất cả khóa học
    const courses = await Course.find();

    // Kiểm tra xem có khóa học nào không
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    // Tạo danh sách khóa học với nội dung đã được populate
    const populatedCourses = await Promise.all(
      courses.map(async (course) => {
        // Tạo một danh sách để lưu trữ nội dung đã được populate
        const populatedContents = await Promise.all(
          course.contents.map(async (content) => {
            let populatedContent;

            // Dựa vào contentType để lấy dữ liệu từ contentRef
            if (content.contentType === "videos") {
              populatedContent = await Video.findById(content.contentRef);
            } else if (content.contentType === "docs") {
              populatedContent = await Docs.findById(content.contentRef);
            } else if (content.contentType === "questions") {
              populatedContent = await Question.findById(content.contentRef);
            }

            // Nếu không tìm thấy nội dung tham chiếu
            if (!populatedContent) {
              return null; // Hoặc xử lý lỗi theo cách khác
            }

            // Trả về nội dung với thông tin từ contentRef
            return {
              ...content.toObject(),
              contentRef: populatedContent,
            };
          })
        );

        // Lọc các nội dung không hợp lệ (nếu có)
        const validContents = populatedContents.filter(
          (content) => content !== null
        );
        const populatedExam = await Exam.findById(course.exam);
        // if (!populatedExam) {
        //   return null;
        // }
        return {
          ...course.toObject(),
          contents: validContents,
          populatedExam,
        };
      })
    );

    res.status(200).json(populatedCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Tìm khóa học theo courseId
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Tạo một danh sách để lưu trữ nội dung đã được populate
    const populatedContents = await Promise.all(
      course.contents.map(async (content) => {
        let populatedContent;

        // Dựa vào contentType để lấy dữ liệu từ contentRef
        if (content.contentType === "videos") {
          populatedContent = await Video.findById(content.contentRef);
        } else if (content.contentType === "exams") {
          populatedContent = await Exam.findById(content.contentRef);
        } else if (content.contentType === "docs") {
          populatedContent = await Docs.findById(content.contentRef);
        } else if (content.contentType === "questions") {
          populatedContent = await Question.findById(content.contentRef);
        }

        // Nếu không tìm thấy nội dung tham chiếu
        if (!populatedContent) {
          return null; // Hoặc có thể xử lý lỗi theo cách khác
        }

        // Trả về nội dung với thông tin từ contentRef
        return {
          ...content.toObject(),
          contentRef: populatedContent,
        };
      })
    );

    // Lọc các nội dung không hợp lệ (nếu có)
    const validContents = populatedContents.filter(
      (content) => content !== null
    );

    res.status(200).json({
      course: {
        ...course.toObject(),
        contents: validContents,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      description,
      posterLink,
      userGenerated,
      videoIntro,
      price,
      category,
    } = req.body;
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
      exam: null,
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

export const updateExam = async (req, res) => {};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
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

export const getContentByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const populatedContents = await Promise.all(
      course.contents.map(async (content) => {
        let populatedContent;

        switch (content.contentType) {
          case "videos":
            populatedContent = await Video.findById(content.contentRef);
            break;
          case "docs":
            populatedContent = await Docs.findById(content.contentRef);
            break;
          case "questions":
            populatedContent = await Question.findById(content.contentRef);
            break;
          default:
            populatedContent = null;
        }

        if (!populatedContent) {
          return null;
        }

        return {
          ...content.toObject(),
          contentRef: populatedContent,
        };
      })
    );

    const validContents = populatedContents.filter(
      (content) => content !== null
    );

    res.status(200).json({
      courseId: course.courseId,
      courseName: course.courseName,
      contents: validContents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
