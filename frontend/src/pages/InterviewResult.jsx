import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import Card from "../components/Card";
import AnimatedNumber from "../components/AnimatedNumber";

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

  const scoreColor = getScoreColor(interview.overallScore);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 mb-1"
      >
        <CheckCircle2 size={22} className="text-success" />
        <h1 className="font-display text-2xl font-semibold text-text-primary">
          Interview Complete
        </h1>
      </motion.div>
      <p className="text-text-secondary mb-8">
        {interview.role} &middot; <span className="capitalize">{interview.difficulty}</span>
      </p>

      {interview.overallScore !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="mb-6 max-w-xs relative overflow-hidden text-center py-8">
            <div className={`absolute -top-8 -right-8 w-32 h-32 bg-${scoreColor}/10 rounded-full blur-2xl`} />
            <p className="text-text-secondary text-sm mb-2 relative z-10">Overall Score</p>
            <p className={`font-display text-5xl font-bold text-${scoreColor} relative z-10`}>
              <AnimatedNumber value={interview.overallScore} />
              <span className="text-2xl text-text-secondary"> / 10</span>
            </p>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4 max-w-xl">
        {interview.questions.map((q, index) => {
          const qColor = q.score !== null ? getScoreColor(q.score) : null;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.08 }}
            >
              <Card>
                <div className="flex justify-between items-start mb-2 gap-3">
                  <p className="text-text-primary font-medium text-sm">
                    {index + 1}. {q.question}
                  </p>
                  {q.score !== null && (
                    <span className={`shrink-0 bg-${qColor}/10 text-${qColor} text-xs font-semibold px-2.5 py-1 rounded-full`}>
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8">
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