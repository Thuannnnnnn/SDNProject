// controllers/examController.js
import Exam from "../../model/exams/examModel.js";
import Course from "../../model/course/courseModel.js";
import ExamResults from "../../model/exams/examResultsModel.js";

async function getQuestionsByCourseId(courseId) {
  const course = await Course.findById(courseId).populate({
    path: "contents",
    match: { contentType: "questions" },
    populate: { path: "contentRef", model: "Question" },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  let allQuestions = [];
  course.contents.forEach((content) => {
    // Ensure contentRef and questions are present
    if (
      content.contentType === "questions" &&
      content.contentRef &&
      content.contentRef.questions
    ) {
      content.contentRef.questions.forEach((question) => {
        allQuestions.push({
          questionId: question._id,
          question: question.question,
          options: question.options,
          answer: question.answer,
        });
      });
    }
  });

  if (allQuestions.length === 0) {
    throw new Error("No question content found for this course");
  }

  return allQuestions;
}

// Helper function to shuffle and select random questions
function getRandomQuestions(questions, number) {
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, number);
}

// Create or update an exam
export const createOrUpdateExam = async (req, res) => {
  const { courseId, questionNumber } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const allQuestions = await getQuestionsByCourseId(courseId);

    if (allQuestions.length < questionNumber) {
      return res.status(400).json({
        error: `The number of questions available (${allQuestions.length}) is less than the provided questionNumber (${questionNumber}).`,
      });
    }

    // Randomly select questions
    const questions = getRandomQuestions(allQuestions, questionNumber);

    let exam;
    if (course.exam) {
      exam = await Exam.findById(course.exam);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      exam.questions = questions;
      exam.questionNumber = questionNumber;
    } else {
      exam = new Exam({
        courseId,
        questions,
        questionNumber,
      });
      await exam.save();
      course.exam = exam._id;
    }

    await exam.save();
    await course.save();

    res
      .status(201)
      .json({ msg: "Exam created/updated successfully!", data: exam });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating/updating exam", details: error.message });
  }
};
// Get exam by courseId
export const getExamByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ courseId }).populate("exam");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!course.exam) {
      return res
        .status(404)
        .json({ message: "Exam not found for this course" });
    }

    res.status(200).json(course.exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exam details by examId (for users to take)
export const getExamById = async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const sanitizedExam = {
      _id: exam._id,
      courseId: exam.courseId,
      questionNumber: exam.questionNumber,
      questions: exam.questions.map((q) => ({
        questionId: q.questionId,
        question: q.question,
        options: q.options,
      })),
    };

    res.status(200).json({ data: sanitizedExam });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching exam", details: error.message });
  }
};

// Submit exam attempt
// backend/api/examRoutes.js

export const submitExam = async (req, res) => {
  const { courseId, examId, userEmail, answers } = req.body;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    if (answers.length !== exam.questions.length) {
      return res.status(400).json({
        error: "Number of answers does not match the number of questions",
      });
    }

    let score = 0;
    const review = [];

    exam.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.answer;

      review.push({
        questionId: question._id,
        selectedAnswer: userAnswer,
      });

      if (userAnswer === correctAnswer) {
        score += 1;
      }
    });

    const percentage = ((score / exam.questions.length) * 100).toFixed(2);
    const passed = percentage >= 80;
    const attemptDate = new Date();

    const existingAttempt = await ExamResults.findOne({
      courseId,
      examId,
      userEmail,
    });

    if (existingAttempt) {
      // Update the attempt with the new score, review, and attempt date
      existingAttempt.score = percentage;
      existingAttempt.passed = passed;
      existingAttempt.answers = review;
      existingAttempt.attemptDate = attemptDate;
      await existingAttempt.save();

      return res.status(200).json({
        msg: "Exam attempt updated successfully!",
        data: { score: percentage, passed, review, attemptDate },
      });
    }

    // Save new attempt if no existing attempt found
    const examAttempt = new ExamResults({
      courseId,
      examId,
      userEmail,
      answers: review,
      score: percentage,
      passed,
      attemptDate,
    });

    await examAttempt.save();
    res.status(200).json({
      msg: "Exam submitted successfully!",
      data: { score: percentage, passed, review, attemptDate },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error submitting exam", details: error.message });
  }
};

// Get all exam attempts by user
export const getExamAttemptsByUser = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const attempts = await ExamResults.find({ userEmail });
    if (!attempts || attempts.length === 0) {
      return res
        .status(404)
        .json({ error: "No exam attempts found for this user" });
    }

    res.status(200).json({ data: attempts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching exam attempts", details: error.message });
  }
};
// Get exam result by courseId and userEmail
export const getExamResultByUser = async (req, res) => {
  const { courseId, userEmail } = req.params;

  try {
    const attempt = await ExamResults.findOne({ courseId, userEmail });

    if (!attempt) {
      return res
        .status(404)
        .json({ error: "No exam result found for this course and user" });
    }

    res.status(200).json(attempt);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching exam result", details: error.message });
  }
};

export const getExamAll = async (req, res) => {
  try {
    const attempt = await ExamResults.find();

    if (!attempt) {
      return res.status(404).json({ error: "No exam result found" });
    }

    res.status(200).json(attempt);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching exam result", details: error.message });
  }
};

// Check if a user has already attempted an exam
export const hasUserAttemptedExam = async (req, res) => {
  const { examId, userEmail } = req.params;

  try {
    const attempt = await ExamResults.findOne({ examId, userEmail });
    if (attempt) {
      return res.status(200).json({ attempted: true, data: attempt });
    }
    return res.status(200).json({ attempted: false });
  } catch (error) {
    res.status(500).json({
      error: "Error checking exam attempt status",
      details: error.message,
    });
  }
};
