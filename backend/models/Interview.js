import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  userAnswer: { type: String, default: "" },
  score: { type: Number, default: null },
  feedback: { type: String, default: "" },
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    questions: [questionSchema],
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    overallScore: { type: Number, default: null },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;