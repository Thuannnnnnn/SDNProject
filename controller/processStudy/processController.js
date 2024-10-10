import Course from "../../model/course/courseModel.js";
import Process from "../../model/process/processModel.js";

export const createProcessForUser = async (req, res) => {
  try {
    const { courseId, userEmail } = req.body;
    const course = await Course.findOne({ courseId: courseId });

    if (!course) {
      return res.status(404).json({
        message: "Khóa học không tồn tại.",
      });
    }

    const courseContents = course.contents.map((content) => ({
      contentId: content._id,
      isComplete: false,
    }));

    const newProcess = new Process({
      processId: `${userEmail}_${courseId}`,
      courseId: course._id,
      email: userEmail,
      content: courseContents,
    });

    await newProcess.save();

    return res.status(201).json({
      message: "Tạo process thành công.",
      data: newProcess,
    });
  } catch (error) {
    console.error("Lỗi khi tạo process:", error.message);
    return res.status(500).json({
      message: "Lỗi khi tạo process.",
      error: error.message,
    });
  }
};

export const updateProcessContent = async (req, res) => {
  try {
    const { processId } = req.params;
    const { contentId, isComplete } = req.body;

    const updatedProcess = await Process.findOneAndUpdate(
      { processId: processId, "content.contentId": contentId },
      { $set: { "content.$.isComplete": isComplete } },
      { new: true }
    );

    if (!updatedProcess) {
      return res.status(404).json({
        message: "Không tìm thấy process hoặc content.",
      });
    }

    return res.status(200).json({
      message: "Cập nhật tiến trình học thành công.",
      data: updatedProcess,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật process:", error.message);
    return res.status(500).json({
      message: "Lỗi khi cập nhật tiến trình học.",
      error: error.message,
    });
  }
};

export const deleteProcess = async (req, res) => {
  try {
    const { processId } = req.params;

    const deletedProcess = await Process.findOneAndDelete({ processId: processId });

    if (!deletedProcess) {
      return res.status(404).json({
        message: "Không tìm thấy process để xóa.",
      });
    }

    return res.status(200).json({
      message: "Xóa process thành công.",
      data: deletedProcess,
    });
  } catch (error) {
    console.error("Lỗi khi xóa process:", error.message);
    return res.status(500).json({
      message: "Lỗi khi xóa process.",
      error: error.message,
    });
  }
};

