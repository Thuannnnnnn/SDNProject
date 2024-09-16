import Question from "../../model/quizz/question.js";
import Results from "../../model/quizz/answers.js";
import questions, {answers} from "../../datatest/data.js";

export async function getQuestions(req, res) {
    
    try {
        const q = await Question.find();
        res.status(200).json(q);
    } catch (error) {
        res.status(500).json({error: "Error"});
    }
}

export async function insertquestions(req, res) {
    const { questions, answers } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: "Questions are required" });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: "Answers are required" });
    }

    try {
        const insert = await Question.insertMany({ questions, answers });
        res.status(200).json({ msg: "Data saved successfully!", data: insert });
    } catch (error) {
        res.status(500).json({ error: "Error saving data", details: error });
    }
}

export async function dropquestion(req, res){
    try {
        const drop = await Question.deleteMany();
        res.status(200).json({ msg: "Question Deleted successfully!", deletedCount: drop.deletedCount });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Question", details: error.message });
    }
}

export async function getResult(req, res) {
    try {
        const r = await Result.find();
        res.json(r)
    } catch (error) {
        res.status(500).json({error: "Error"});
    }
}


export async function storeResult(req, res) {
    try {
        const { username, result, attempts, points, achieved } = req.body;

        if (!username || !result) {
            throw new Error('Username and result are required!');
        }

        const newResult = await Results.create({ username, result, attempts, points, achieved });

        res.status(200).json({ msg: "Result Saved Successfully!", data: newResult });
    } catch (error) {
        res.status(500).json({ error: "Error saving result", details: error.message });
    }
}


export async function dropresult(req, res) {
    try {
        const drop = await Results.deleteMany();
        res.status(200).json({ msg: "Answer Deleted successfully!", deletedCount: drop.deletedCount });
    } catch (error) {
        res.status(500).json({ error: "Error deleting answers", details: error.message });
    }
}


