import Question from "../../model/quizz/question.js";
import Results from "../../model/quizz/answers.js";
import Content from '../../model/content/contentModel.js';
import XLSX from 'xlsx';

export async function getQuestions(req, res) {
  try {
    const { contentId } = req.query;

    const filter = contentId ? { contentId } : {};
    const questions = await Question.find(filter);

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions", details: error.message });
  }
}

export async function insertQuestions(req, res) {
  try {
    const { questions } = req.body;

    // Lấy contentId từ headers hoặc từ một nguồn khác
    const contentId = req.headers['x-content-id'] || req.body.contentId;

    if (!contentId) {
      return res.status(400).json({ error: "ContentId is required to insert questions." });
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: "No questions available to insert" });
    }

    const questionsWithContentId = questions.map(question => ({
      ...question,
      contentId
    }));

    await Question.deleteMany({ contentId });

    const insertedQuestions = await Question.insertMany(questionsWithContentId);

    res.status(200).json({ message: "Questions inserted successfully!", data: insertedQuestions });
  } catch (error) {
    res.status(500).json({ error: "Error inserting questions", details: error.message });
  }
}

export async function dropQuestions(req, res) {
  try {

    const { contentId } = req.body;

    if (!contentId) {
      return res.status(400).json({ error: "ContentId is required to delete questions." });
    }

    const result = await Question.deleteMany({ contentId });
    res.status(200).json({ message: "Questions deleted successfully!", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Error deleting questions", details: error.message });
  }
}

export async function getResult(req, res) {
  try {
    const results = await Results.find();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching results", details: error.message });
  }
}

export async function storeResult(req, res) {
  const { username, result, attempts, points, achieved } = req.body;

  if (!username || result === undefined) {
    return res.status(400).json({ error: "Username and result are required." });
  }

  try {
    const newResult = new Results({
      username,
      result,
      attempts,
      points,
      achieved
    });

    await newResult.save();
    res.status(200).json({ message : "Result saved successfully!", data: newResult });
  } catch (error) {
    res.status(500).json({ error: "Error saving result", details: error.message });
  }
}

export async function dropResults(req, res) {
  try {
    const result = await Results.deleteMany();
    res.status(200).json({ message : "Results deleted successfully!", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Error deleting results", details: error.message });
  }
}

export async function importQuizz(req, res) {
  try {
    const contentId = req.user ? req.user.contentId : req.body.contentId;

    if (!contentId) {
      return res.status(400).json({ status: 400, success: false, message: 'contentId is required' });
    }

    const content = await Content.findOne({ contentId });
    if (!content) {
      return res.status(400).json({ status: 400, success: false, message: 'Invalid contentId. Content does not exist.' });
    }

    if (!req.file) {
      return res.status(400).json({ status: 400, success: false, message: 'No file uploaded' });
    }

    const excelFile = req.file;

    if (excelFile.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return res.status(400).json({ status: 400, success: false, message: 'Invalid file type. Please upload an .xlsx file.' });
    }

    const workbook = XLSX.read(excelFile.buffer);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const questionsToSave = data.map(row => {
      const options = [
        row['Option 1'] || '',
        row['Option 2'] || '',
        row['Option 3'] || '',
        row['Option 4'] || ''
      ].filter(option => option.trim() !== '');

      return {
        contentId,
        question: row.question || '',
        options: options,
        answer: row.Answer || 0,
        createdAt: new Date(),
      };
    });

    await Question.insertMany(questionsToSave);

    res.status(200).json({ status: 200, success: true, message: 'File processed and data saved successfully' });
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).json({ status: 500, success: false, message: 'Server error: ' + error.message });
  }
}