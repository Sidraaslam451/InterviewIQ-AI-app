import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import api from "../services/api";
import Card from "../components/Card";
import AnimatedNumber from "../components/AnimatedNumber";

function ScoreRing({ score }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const pct = (score / 10) * circumference;

  const color = score >= 7 ? "#16A34A" : score >= 4 ? "#D97706" : "#DC2626";

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg width="176" height="176" className="-rotate-90">
        <circle cx="88" cy="88" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
        <motion.circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - pct }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-4xl font-bold text-text-primary">
          <AnimatedNumber value={score} />
        </p>
        <p className="text-text-secondary text-xs">out of 10</p>
      </div>
    </div>
  );
}

export default function InterviewResult() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      const res = await api.get(`/interview/${id}`);
      setInterview(res.data);
    };
    fetchInterview();
  }, [id]);

  if (!interview) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 7) return "success";
    if (score >= 4) return "warning";
    return "danger";
  };

  const score = interview.overallScore;
  const message =
    score >= 8 ? "Outstanding performance!" : score >= 6 ? "Solid work, keep going!" : score >= 4 ? "Good start — room to grow." : "Let's keep practicing.";

  return (
    <div>
      {/* Hero score reveal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-b from-surface to-bg border border-border p-10 mb-8 text-center max-w-xl"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
          >
            <CheckCircle2 size={13} />
            Interview Complete
          </motion.div>

          {score !== null && <ScoreRing score={score} />}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="font-display text-xl font-semibold text-text-primary mt-6"
          >
            {message}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-text-secondary text-sm mt-1"
          >
            {interview.role} &middot; <span className="capitalize">{interview.difficulty}</span> &middot;{" "}
            {interview.questions.length} questions
          </motion.p>
        </div>
      </motion.div>

      {/* Question breakdown */}
      <p className="text-text-primary font-semibold mb-4">Question breakdown</p>
      <div className="space-y-4 max-w-xl">
        {interview.questions.map((q, index) => {
          const qColor = q.score !== null ? getScoreColor(q.score) : null;
          const TrendIcon = q.score !== null && q.score >= 6 ? TrendingUp : TrendingDown;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <Card className="border-l-4" style={{ borderLeftColor: `var(--color-${qColor || "border"})` }}>
                <div className="flex justify-between items-start mb-2 gap-3">
                  <p className="text-text-primary font-medium text-sm flex-1">
                    {index + 1}. {q.question}
                  </p>
                  {q.score !== null && (
                    <span className={`shrink-0 flex items-center gap-1 bg-${qColor}/10 text-${qColor} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                      <TrendIcon size={12} />
                      {q.score}/10
                    </span>
                  )}
                </div>
                <p className="text-text-secondary text-sm mb-3">
                  <span className="font-medium text-text-primary">Your answer: </span>
                  {q.userAnswer || "No answer given"}
                </p>
                {q.feedback && (
                  <p className="text-text-secondary text-xs bg-bg border border-border rounded-lg p-3 leading-relaxed">
                    {q.feedback}
                  </p>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 + interview.questions.length * 0.1 + 0.2 }}
        className="mt-8"
      >
        <Link
          to="/interview/setup"
          className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:gap-2.5 transition-all"
        >
          Start another interview
          <ArrowRight size={15} />
        </Link>
      </motion.div>
    </div>
  );
}