import express from "express";
import { uploadResume, getMyResume } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/", protect, getMyResume);

export default router;