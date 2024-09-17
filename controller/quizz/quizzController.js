import Question from "../../model/quizz/question.js";
import Results from "../../model/quizz/answers.js";
import { questionsData } from '../../datatest/data.js';
import XLSX from 'xlsx';

export async function getQuestions(req, res) {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions", details: error.message });
  }
}

export async function insertQuestions(req, res) {
  try {
    if (questionsData.length === 0) {
      return res.status(400).json({ error: "No questions available to insert" });
    }

    await Question.deleteMany({});

    const insertedQuestions = await Question.insertMany(questionsData);

    res.status(200).json({ msg: "Questions inserted successfully!", data: insertedQuestions });
  } catch (error) {
    res.status(500).json({ error: "Error inserting questions", details: error.message });
  }
}

export async function dropQuestions(req, res) {
  try {
    const result = await Question.deleteMany();
    res.status(200).json({ msg: "Questions deleted successfully!", deletedCount: result.deletedCount });
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
    res.status(200).json({ msg: "Result saved successfully!", data: newResult });
  } catch (error) {
    res.status(500).json({ error: "Error saving result", details: error.message });
  }
}

export async function dropResults(req, res) {
  try {
    const result = await Results.deleteMany();
    res.status(200).json({ msg: "Results deleted successfully!", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Error deleting results", details: error.message });
  }
}

export async function importQuizz(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 400, success: false, msg: 'No file uploaded' });
    }

    const excelFile = req.file;

    if (excelFile.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return res.status(400).json({ status: 400, success: false, msg: 'Invalid file type. Please upload an .xlsx file.' });
    }

    const workbook = XLSX.read(excelFile.buffer);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of data) {
      const options = [
        row['Option 1'] || '',
        row['Option 2'] || '',
        row['Option 3'] || '',
        row['Option 4'] || ''
      ].filter(option => option.trim() !== '');

      const question = new Question({
        question: row.question || '',
        options: options,
        answer: row.Answer || 0,
        createdAt: new Date(),
      });

      await question.save();
    }

    res.status(200).json({ status: 200, success: true, msg: 'File processed and data saved successfully' });
  } catch (error) {
    console.error('Error processing file:', error.message);
    res.status(500).json({ status: 500, success: false, msg: 'Server error: ' + error.message });
  }
}