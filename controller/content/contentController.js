import Course from "../../model/course/courseModel.js";
import Docs from "../../model/docs/docsModel.js";
import Exam from "../../model/exam/exam.js";
import Question from "../../model/quizz/question.js";
import Video from "../../model/video/videoModel.js";

function generateId(contentName, courseId) {
  const firstChars = contentName
    .split(" ")
    .map((word) => word[0])
    .join("");
  return firstChars + courseId;
}

async function getVideoRef(contentRef) {
  const video = await Video.findById({ _id: contentRef });
  if (video) {
    return video._id;
  }
  return { status: "not found" };
}

async function getExamRef(contentRef) {
  const exam = await Exam.findById({ _id: contentRef });
  if (exam) {
    return exam._id;
  }
  return { status: "not found" };
}

async function getDocsRef(contentRef) {
  const docs = await Docs.findById({ _id: contentRef });
  if (docs) {
    return docs._id;
  }
  return { status: "not found" };
}

async function getQuizRef(contentRef) {
  const quiz = await Question.findById({ _id: contentRef });
  if (quiz) {
    return quiz._id;
  }
  return { status: "not found" };
}

export const getContentById = async (req, res) => {
  try {
    const { contentId } = req.params;

    const course = await Course.findOne({ "contents.contentId": contentId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const content = course.contents.find(item => item.contentId === contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    let populatedContent;

    if (content.contentType === "videos") {
      populatedContent = await Video.findById(content.contentRef);
    } else if (content.contentType === "exams") {
      populatedContent = await Exam.findById(content.contentRef);
    } else if (content.contentType === "docs") {
      populatedContent = await Docs.findById(content.contentRef);
    } else if (content.contentType === "questions") {
      populatedContent = await Question.findById(content.contentRef);
    }

    if (!populatedContent) {
      return res.status(404).json({ message: "Content reference not found" });
    }

    res.status(200).json({
      content: {
        ...content.toObject(),
        contentRef: populatedContent,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const createContent = async (req, res) => {
  try {
    const { contentName, contentType, contentRef, courseId } = req.body;

    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Kiểm tra trùng lặp contentId
    const contentId = generateId(contentName, courseId);
    const isContentIdExists = course.contents.some(
      (content) => content.contentId === contentId
    );
    if (isContentIdExists) {
      return res.status(400).json({ message: "Content ID already exists" });
    }

    // Kiểm tra trùng lặp contentRef
    const isContentRefExists = course.contents.some(
      (content) => content.contentRef.toString() === contentRef
    );
    if (isContentRefExists) {
      return res
        .status(400)
        .json({ message: "Content reference already exists" });
    }

    // Kiểm tra tham chiếu
    let refResult;
    if (contentType === "videos") {
      refResult = await getVideoRef(contentRef);
    } else if (contentType === "exams") {
      refResult = await getExamRef(contentRef);
    } else if (contentType === "docs") {
      refResult = await getDocsRef(contentRef);
    } else {
      refResult = await getQuizRef(contentRef);
    }

    if (refResult.status === "not found") {
      return res.status(404).json({ message: "Reference not found" });
    }

    const newContent = {
      contentId,
      contentName,
      contentType,
      contentRef: refResult, // Sử dụng refResult
    };

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

    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const content = course.contents.find(
      (item) => item.contentId === contentId
    );
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Kiểm tra trùng lặp contentRef
    const isContentRefExists = course.contents.some(
      (item) =>
        item.contentRef.toString() === contentRef &&
        item.contentId !== contentId
    );
    if (isContentRefExists) {
      return res
        .status(400)
        .json({ message: "Content reference already exists" });
    }

    // Xác thực tham chiếu
    let refResult;
    if (contentType === "videos") {
      refResult = await Video.findById(contentRef);
    } else if (contentType === "exams") {
      refResult = await Exam.findById(contentRef);
    } else if (contentType === "docs") {
      refResult = await Docs.findById(contentRef);
    } else {
      refResult = await Question.findById(contentRef);
    }

    if (!refResult) {
      return res.status(404).json({ message: "Reference not found" });
    }

    // Cập nhật nội dung
    content.contentName = contentName;
    content.contentRef = refResult;
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
