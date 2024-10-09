import Course from "../../model/course/courseModel.js";
import Docs from "../../model/docs/docsModel.js";
import Question from "../../model/quizz/question.js";
import Video from "../../model/video/videoModel.js";
import { dropQuestionId, updateQuestions } from "../quizz/quizzController.js";

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

    const content = course.contents.find(
      (item) => item.contentId === contentId
    );
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    let populatedContent;

    if (content.contentType === "videos") {
      populatedContent = await Video.findById(content.contentRef);
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
    const { contentId, courseId, contentName, contentType, updatedContent } =
      req.body;

    // Tìm khóa học theo courseId
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Tìm chỉ mục của nội dung trong mảng contents dựa trên contentId
    const contentIndex = course.contents.findIndex(
      (item) => item.contentId === contentId
    );

    if (contentIndex === -1) {
      return res.status(404).json({ message: "Content not found" });
    }
    let id;

    if (contentType === "questions") {
      const quizData = updatedContent.quizData;
      if (
        quizData &&
        Array.isArray(quizData.questions) &&
        quizData.questions.length > 0
      ) {
        quizData.questions.forEach((questionItem) => {
          const { _id, question, options, answer } = questionItem;

          updateQuestions(quizData._id, _id, question, options, answer);
        });

        id = quizData._id;
      }
    } else {
      const { idForData } = updatedContent;
      id = idForData;
    }

    const isContentRefExists = course.contents.some(
      (item) =>
        item.contentRef.toString() === id && item.contentId !== contentId
    );
    if (isContentRefExists) {
      return res
        .status(400)
        .json({ message: "Content reference already exists" });
    }

    // Xác thực tham chiếu
    let refResult;
    if (contentType === "videos") {
      refResult = await Video.findById(id);
    } else if (contentType === "docs") {
      refResult = await Docs.findById(id);
    } else {
      refResult = await Question.findById(id);
    }

    if (!refResult) {
      return res.status(404).json({ message: "Reference not found" });
    }

    // Cập nhật nội dung tại chỉ mục tương ứng
    course.contents[contentIndex].contentName =
      contentName || course.contents[contentIndex].contentName;
    course.contents[contentIndex].contentType =
      contentType || course.contents[contentIndex].contentType;
    course.contents[contentIndex].contentRef =
      id || course.contents[contentIndex].contentRef;

    // Lưu khóa học với nội dung đã được cập nhật
    await course.save();

    // Phản hồi kết quả thành công
    res.status(200).json({
      message: "Content updated successfully!",
      content: course.contents[contentIndex],
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
    const { contentId, courseId, contentRef, contentType } = req.body;
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
    let resultQuestions;
    if (contentType == "questions") {
      resultQuestions = dropQuestionId(contentRef);
    }

    if (resultQuestions == 404) {
      return res.status(404).json({ message: "Question not found" });
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
