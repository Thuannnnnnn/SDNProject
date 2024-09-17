import Content from "../../model/content/contentModel.js";
import Course from "../../model/course/courseModel.js";

export const getAllContent = async (req, res) => {
  try {
    const contents = await Content.find();
    res.status(200).json(contents);
    if (!Array.isArray(contents) || contents.length === 0) {
      return res.status(404).json({ message: "No contents found" });
    }
    res.json(contents);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

function genaretedId(ContentName, CourseId) {
  let firstChars = ContentName.split(" ")
    .map((word) => word[0])
    .join("");

  const courseIdUpdated = firstChars + CourseId;

  return courseIdUpdated;
}

export const createContent = async (req, res) => {
  try {
    const { contentName, courseId } = req.body;
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const createDate = new Date().toISOString().split("T")[0];
    const contentId = genaretedId(contentName, courseId);
    const newContent = new Content({
      contentId,
      contentName,
      courseId,
      createDate,
    });

    await newContent.save();
    course.contents.push(newContent.contentId);
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
    const { contentId, contentName, courseId } = req.body;
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Tìm nội dung
    const content = await Content.findOne({ contentId });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Cập nhật nội dung
    content.contentId = genaretedId(contentName, courseId);
    content.contentName = contentName;
    content.createDate = new Date().toISOString().split("T")[0];
    await content.save();

    // Cập nhật nội dung trong khóa học
    const contentIndex = course.contents.findIndex(
      (c) => c.contentId === contentId
    );
    if (contentIndex !== -1) {
      course.contents[contentIndex] = content;
      await course.save();
    }

    res.status(200).json({
      message: "Content updated successfully!",
      content: content,
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
    const deletedContent = await Content.findOneAndDelete({ contentId });
    if (!deletedContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Cập nhật khóa học để loại bỏ nội dung đã xóa
    const updatedCourse = await Course.findOneAndUpdate(
      { courseId },
      { $pull: { contents: { contentId } } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Content deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting content",
      error: error.message,
    });
  }
};
