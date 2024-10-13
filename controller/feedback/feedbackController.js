import Feedback from "../../model/feedback/feedback.js";

// Create Feedback
export const createFeedback = async (req, res) => {
  try {
    const { courseId, userEmail,feedbackText } = req.body;

    // Validate required fields
    if (!courseId || !userEmail ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Additional validation to avoid saving duplicate null values for courseId
    if (courseId === null || courseId === undefined) {
      return res.status(400).json({ message: "courseId cannot be null or undefined" });
    }

    const feedback = new Feedback({
      courseId,
      userEmail,
      feedbackText,
    });

    const savedFeedback = await feedback.save();
    res.status(201).json({
      message: "Feedback created successfully!",
      feedback: savedFeedback,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate key error: " + error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get feedback for a course
export const getFeedbackByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const feedback = await Feedback.find({ courseId: courseId });

    if (!feedback || feedback.length === 0) {
      return res
        .status(404)
        .json({ message: "No feedback found for this course." });
    }

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Feedback by User Email
export const getFeedbackByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const feedback = await Feedback.find({ userEmail: email });

    if (!feedback || feedback.length === 0) {
      return res
        .status(404)
        .json({ message: "No feedback found for this email." });
    }

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Feedbacks
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedback found." });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Feedback
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, userEmail,feedbackText} = req.body;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.course_id = courseId || feedback.course_id;
    feedback.user_email = userEmail || feedback.user_email;
    feedback.feedback_text = feedbackText || feedback.feedback_text;

    const updatedFeedback = await feedback.save();
    res.status(200).json({
      message: "Feedback updated successfully!",
      feedback: updatedFeedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
