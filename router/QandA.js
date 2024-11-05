import express from "express";
import {
  createQandA,
  getQandAByUserEmail,
  getAllQandA,
  updateQandA,
  deleteQandA,
  getQandAByCourseId,
  replyToQandA, // Route mới cho reply
  deleteQandAReply, // Route mới để xóa reply
  updateQandAReply,
} from "../controller/QandA/QandAController.js";

const router = express.Router();

// Create QandA (with courseId in URL)
router.post("/createQandA", createQandA);

// Get QandA by user email for a specific course
router.get("/getQandAByUserEmail:email", getQandAByUserEmail);

// Get all QandAs
router.get("/getAllQandA", getAllQandA);

// Get QandA by courseId
router.get("/getQandAByCourseId/:courseId", getQandAByCourseId);

// Update QandA by ID
router.put("/update/:id", updateQandA);

// Delete QandA by ID
router.delete("/delete/:id", deleteQandA);

// Route để thêm reply cho QandA
router.post("/reply/:QandAId", replyToQandA);

router.put("/updateReply/:QandAId/:replyId", updateQandAReply);

// Route để xóa reply của QandA
router.delete("/deleteReply/:QandAId/:replyId", deleteQandAReply);

export default router;
