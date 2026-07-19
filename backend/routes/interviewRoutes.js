import express from "express";
import {
  generateInterview,
  getMyInterviews,
  getInterviewById,
  submitInterview,
  getAnalytics,
  getPublicStats,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route — protect middleware se PEHLE likhna zaroori hai
router.get("/public-stats", getPublicStats);

router.use(protect); // is line ke NEECHE ke saare routes protected hain

router.post("/generate", generateInterview);
router.get("/", getMyInterviews);
router.get("/analytics/summary", getAnalytics);
router.post("/:id/submit", submitInterview);
router.get("/:id", getInterviewById);

export default router;