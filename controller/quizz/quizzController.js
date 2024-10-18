import Question from "../../model/quizz/question.js";
import Results from "../../model/quizz/answers.js";
import XLSX from "xlsx";

export const getQuestions = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Question.findById(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const questions = quiz.questions;

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: "Questions not found" });
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions", details: error.message });
  }
};
export async function addQuestions(req, res) {
  const { questions } = req.body;

  if (!questions || !Array.isArray(questions)) {
    return res
      .status(400)
      .json({ error: "Questions must be provided as an array." });
  }

  try {
    const questionsDocument = new Question({
      questions: questions.map((question) => ({
        question: question.question || "",
        options: question.options || [],
        answer: question.answer || 0,
        createdAt: new Date(),
      })),
    });

    await questionsDocument.save();
    res
      .status(200)
      .json({ msg: "Questions added successfully!", data: questionsDocument });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding questions", details: error.message });
  }
}

export async function updateQuestion(req, res) {
  const { documentId, questionId } = req.params;

  const { question, options, answer } = req.body;

  if (!question || !options || answer === undefined) {
    return res
      .status(400)
      .json({ error: "Question, options, and answer must be provided." });
  }

  try {
    const questionsDocument = await Question.findById(documentId);
    if (!questionsDocument) {
      return res.status(404).json({ error: "No questions document found." });
    }

    const questionToUpdate = questionsDocument.questions.id(questionId);
    if (!questionToUpdate) {
      return res.status(404).json({ error: "Question not found." });
    }

    questionToUpdate.question = question;
    questionToUpdate.options = options;
    questionToUpdate.answer = answer;

    await questionsDocument.save();
    res
      .status(200)
      .json({ msg: "Question updated successfully!", data: questionToUpdate });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating question", details: error.message });
  }
}

export async function updateQuestions(
  documentId,
  questionId,
  question,
  options,
  answer
) {
  if (!question || !options || answer === undefined) {
    return 400;
  }

  try {
    const questionsDocument = await Question.findById(documentId);
    if (!questionsDocument) {
      return 404;
    }

    const questionToUpdate = questionsDocument.questions.id(questionId);
    if (!questionToUpdate) {
      return 404;
    }

    questionToUpdate.question = question;
    questionToUpdate.options = options;
    questionToUpdate.answer = answer;

    await questionsDocument.save();
    return 200;
  } catch (error) {
    return error;
  }
}

export async function importQuestions(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const excelFile = req.file;

    if (
      excelFile.mimetype !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return res
        .status(400)
        .json({ error: "Invalid file type. Please upload an .xlsx file." });
    }

    const workbook = XLSX.read(excelFile.buffer);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let questionsDocument = await Question.findOne();
    if (!questionsDocument) {
      questionsDocument = new Question();
    }

    data.forEach((row) => {
      const options = [
        row["Option 1"] || "",
        row["Option 2"] || "",
        row["Option 3"] || "",
        row["Option 4"] || "",
      ].filter((option) => option.trim() !== "");

      questionsDocument.questions.push({
        question: row.question || "",
        options,
        answer: row.Answer || 0,
        createdAt: new Date(),
      });
    });

    await questionsDocument.save();

    res.status(200).json({
      msg: "Questions imported successfully!",
      data: questionsDocument,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error importing questions", details: error.message });
  }
}

export async function dropQuestions(req, res) {
  try {
    const result = await Question.deleteMany();
    res.status(200).json({
      msg: "Questions deleted successfully!",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting questions", details: error.message });
  }
}

export async function dropQuestionId(Id) {
  try {
    const result = await Question.findByIdAndDelete(Id);
    return result;
  } catch (error) {
    return error;
  }
}

export async function getResult(req, res) {
  try {
    const results = await Results.find();
    res.status(200).json(results.map(result => ({
      ...result.toObject(),
      selectedItemId: result.selectedItemId,
    })));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching results", details: error.message });
  }
}


export async function storeResult(req, res) {
  const { result, attempts, points, achieved, selectedItemId } = req.body;

  try {
    const newResult = new Results({
      result,
      attempts,
      points,
      achieved,
      selectedItemId,
    });

    await newResult.save();
    res
      .status(200)
      .json({ msg: "Result saved successfully!", data: newResult });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving result", details: error.message });
  }
}

export async function dropResults(req, res) {
  try {
    const { id } = req.params;

    const result = await Results.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    res.status(200).json({
      msg: "Result deleted successfully!",
      deletedId: result._id,
    });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ error: "Error deleting result", details: error.message });
  }
}



