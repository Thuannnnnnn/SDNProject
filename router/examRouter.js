import express from 'express';
import { getAllExams, createExam, deleteExam, updateExam } from '../controller/exam/examController.js';

const examRouter = express.Router();

// Tạo mới kỳ thi
examRouter.post('/create', createExam);

// Lấy tất cả các kỳ thi
examRouter.get('/getAll', getAllExams);

// Cập nhật kỳ thi
examRouter.put('/update', updateExam);

// Xóa kỳ thi
examRouter.delete('/delete', deleteExam);

export default examRouter;
