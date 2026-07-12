import Interview from "../models/Interview.js";
import { generateInterviewQuestions } from "../services/aiService.js";

export const generateInterview = async (req, res) => {
  try {
    const { role, difficulty, questionCount } = req.body;

    if (!role || !difficulty || !questionCount) {
      return res.status(400).json({ message: "role, difficulty, and questionCount are required" });
    }

    const aiQuestions = await generateInterviewQuestions({ role, difficulty, questionCount });

    const interview = await Interview.create({
      user: req.user._id,
      role,
      difficulty,
      questions: aiQuestions,
    });

    res.status(201).json({ message: "Interview generated", interview });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate interview", error: err.message });
  }
};

export const getMyInterviews = async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(interviews);
};

export const getInterviewById = async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }
  res.json(interview);
};

export const submitInterview = async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionIndex, userAnswer }]

    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    answers.forEach(({ questionIndex, userAnswer }) => {
      if (interview.questions[questionIndex]) {
        interview.questions[questionIndex].userAnswer = userAnswer;
      }
    });

    interview.status = "completed";
    await interview.save();

    res.json({ message: "Interview submitted", interview });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit interview", error: err.message });
  }
};