import axios from "axios";
import Interview from "../models/Interview.js";
import {
  generateInterviewQuestions,
  evaluateAnswer,
} from "../services/aiService.js";

export const generateInterview = async (req, res) => {
  try {
    const { role, difficulty, questionCount } = req.body;

    if (!role || !difficulty || !questionCount) {
      return res
        .status(400)
        .json({ message: "role, difficulty, and questionCount are required" });
    }

    const aiQuestions = await generateInterviewQuestions({
      role,
      difficulty,
      questionCount,
    });

    const interview = await Interview.create({
      user: req.user._id,
      role,
      difficulty,
      questions: aiQuestions,
    });

    res.status(201).json({ message: "Interview generated", interview });
  } catch (err) {
    console.error("Generate interview error:", err);
    res
      .status(500)
      .json({ message: "Failed to generate interview", error: err.message });
  }
};

export const getMyInterviews = async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(interviews);
};

export const getInterviewById = async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }
  res.json(interview);
};

export const submitInterview = async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionIndex, userAnswer }]

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Pehle saare answers save karte hain
    answers.forEach(({ questionIndex, userAnswer }) => {
      if (interview.questions[questionIndex]) {
        interview.questions[questionIndex].userAnswer = userAnswer;
      }
    });

    // Ab har question ko AI se evaluate karte hain, ek ek karke
    for (const q of interview.questions) {
      try {
        const evaluation = await evaluateAnswer({
          question: q.question,
          userAnswer: q.userAnswer,
          role: interview.role,
        });

        q.score = evaluation.score;
        q.feedback = `Strength: ${evaluation.strength} | Weakness: ${evaluation.weakness} | Tip: ${evaluation.improvementTip}`;
      } catch (evalErr) {
        console.error(
          `Evaluation failed for question "${q.question}":`,
          evalErr.message,
        );
        q.score = null;
        q.feedback = "Evaluation pending — please check back shortly.";
      }
    }

    // Overall score: sirf un questions ka average jo evaluate ho paye
    const evaluatedQuestions = interview.questions.filter(
      (q) => q.score !== null,
    );
    interview.overallScore =
      evaluatedQuestions.length > 0
        ? Math.round(
            evaluatedQuestions.reduce((sum, q) => sum + q.score, 0) /
              evaluatedQuestions.length,
          )
        : null;
        interview.status = "completed";
    await interview.save();

    // n8n ko notify karte hain, taake woh email bhej sake
    // Agar yeh fail ho, interview submission fail nahi honi chahiye — isliye alag try/catch
    try {
      await axios.post(process.env.N8N_WEBHOOK_URL, {
        fullName: req.user.fullName,
        email: req.user.email,
        role: interview.role,
        difficulty: interview.difficulty,
        score: interview.overallScore,
      });
    } catch (webhookErr) {
      console.error("n8n webhook failed:", webhookErr.message);
      // Yahan koi error response nahi bhejte — email fail hona interview submission ko fail nahi karna chahiye
    }

    res.json({ message: "Interview submitted and evaluated", interview });
  } catch (err) {
    console.error("Submit interview error:", err);
    res
      .status(500)
      .json({ message: "Failed to submit interview", error: err.message });
  }
};
export const getAnalytics = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
      status: "completed",
    }).sort({ createdAt: 1 });

    const totalInterviews = interviews.length;

    const scoredInterviews = interviews.filter((i) => i.overallScore !== null);
    const averageScore =
      scoredInterviews.length > 0
        ? Math.round(
            scoredInterviews.reduce((sum, i) => sum + i.overallScore, 0) / scoredInterviews.length
          )
        : 0;

    const bestScore =
      scoredInterviews.length > 0
        ? Math.max(...scoredInterviews.map((i) => i.overallScore))
        : 0;

    // Chart ke liye: har interview ka date aur score
    const scoreTrend = scoredInterviews.map((i) => ({
      date: i.createdAt.toISOString().split("T")[0],
      score: i.overallScore,
      role: i.role,
    }));

    res.json({
      totalInterviews,
      averageScore,
      bestScore,
      scoreTrend,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Failed to load analytics", error: err.message });
  }
};
// Public endpoint — koi login zaroori nahi. Sirf aggregate counts, kisi user ka private data nahi.
export const getPublicStats = async (req, res) => {
  try {
    const totalInterviews = await Interview.countDocuments({ status: "completed" });

    const totalQuestionsAgg = await Interview.aggregate([
      { $match: { status: "completed" } },
      { $project: { questionCount: { $size: "$questions" } } },
      { $group: { _id: null, total: { $sum: "$questionCount" } } },
    ]);
    const totalQuestions = totalQuestionsAgg[0]?.total || 0;

    const avgScoreAgg = await Interview.aggregate([
      { $match: { status: "completed", overallScore: { $ne: null } } },
      { $group: { _id: null, avg: { $avg: "$overallScore" } } },
    ]);
    const averageScore = avgScoreAgg[0]?.avg ? Math.round(avgScoreAgg[0].avg * 10) / 10 : null;

    res.json({
      totalInterviews,
      totalQuestions,
      averageScore,
    });
  } catch (err) {
    console.error("Public stats error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
};