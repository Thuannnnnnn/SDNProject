import express from 'express';
import {
  createFeedback,
  getFeedbackByUserEmail,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByCourseId,
  replyToFeedback,  // Route mới cho reply
  deleteFeedbackReply // Route mới để xóa reply
} from '../controller/feedback/feedbackController.js';

const router = express.Router();

// Create feedback (with courseId in URL)
router.post('/createFeedback', createFeedback);

// Get feedback by user email for a specific course
router.get('/getFeedbackByUserEmail:email', getFeedbackByUserEmail);

// Get all feedbacks
router.get('/getAllFeedback', getAllFeedback);

// Get feedback by courseId
router.get('/getFeedbackByCourseId/:courseId', getFeedbackByCourseId);

// Update feedback by ID
router.put('/update/:id', updateFeedback);

// Delete feedback by ID
router.delete('/delete/:id', deleteFeedback);

// Route để thêm reply cho feedback
router.post('/reply/:feedbackId', replyToFeedback);

// Route để xóa reply của feedback
router.delete('/deleteReply/:feedbackId/:replyId', deleteFeedbackReply);

export default router;
