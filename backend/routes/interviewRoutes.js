import express from "express";
import {
  generateInterview,
  getMyInterviews,
  getInterviewById,
  submitInterview,
  getAnalytics,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // is line se neeche ke SAARE routes protected ho jate hain

router.post("/generate", generateInterview);
router.get("/", getMyInterviews);
router.get("/:id", getInterviewById);
router.post("/:id/submit", submitInterview);
router.get("/analytics/summary", getAnalytics);

export default router;