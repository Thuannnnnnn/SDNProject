import Content from "../../model/content/contentModel.js";
import Course from "../../model/course/courseModel.js";

export const getAllContent = async (req, res) => {
  try {
    // Lấy tất cả khóa học và nội dung liên quan
    const courses = await Course.find().populate('contents'); // Nếu bạn cần populate

    // Kiểm tra xem có khóa học nào không
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    // Trích xuất nội dung từ các khóa học
    const allContents = courses.flatMap(course => course.contents);

    if (!Array.isArray(allContents) || allContents.length === 0) {
      return res.status(404).json({ message: "No contents found" });
    }

    res.status(200).json(allContents);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


function generateId(contentName, courseId) {
  const firstChars = contentName
    .split(" ")
    .map((word) => word[0])
    .join("");
  return firstChars + courseId;
}

export const createContent = async (req, res) => {
  try {
    const { contentName, contentType, contentRef, courseId } = req.body;

    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const createDate = new Date().toISOString().split("T")[0];
    const contentId = generateId(contentName, courseId);

    // Tạo mới nội dung với đầy đủ thông tin
    const newContent = {
      contentId,
      contentName,
      contentType,
      contentRef,
      createDate,
    };

    // Cập nhật khóa học
    course.contents.push(newContent);
    await course.save();

    res.status(201).json({
      message: "Content created successfully!",
      content: newContent,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating content",
      error: error.message,
    });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { contentId, contentName, courseId, contentRef, contentType } =
      req.body;

    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Tìm nội dung trong mảng contents
    const content = course.contents.find(
      (item) => item.contentId === contentId
    );
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Cập nhật nội dung
    content.contentName = contentName;
    content.contentRef = contentRef;
    content.contentType = contentType;
    content.createDate = new Date().toISOString().split("T")[0];

    await course.save();

    res.status(200).json({
      message: "Content updated successfully!",
      content,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating content",
      error: error.message,
    });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { contentId, courseId } = req.body;

    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Tìm và xóa nội dung
    const contentIndex = course.contents.findIndex(
      (item) => item.contentId === contentId
    );
    if (contentIndex === -1) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Loại bỏ nội dung
    course.contents.splice(contentIndex, 1);
    await course.save();

    res.status(200).json({ message: "Content deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting content",
      error: error.message,
    });
  }
};
