import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";

export default function MockInterview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  const currentQuestion = interview.questions[currentIndex];
  const isLastQuestion = currentIndex === interview.questions.length - 1;
  const progress = ((currentIndex + 1) / interview.questions.length) * 100;

  const handleAnswerChange = (text) => {
    setAnswers({ ...answers, [currentIndex]: text });
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    setSubmitError("");
    const answersPayload = Object.entries(answers).map(([questionIndex, userAnswer]) => ({
      questionIndex: Number(questionIndex),
      userAnswer,
    }));

    try {
      await api.post(`/interview/${id}/submit`, { answers: answersPayload });
      navigate(`/interview/${id}/result`);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Submission failed, please try again");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-text-secondary text-sm">
          Question {currentIndex + 1} of {interview.questions.length}
        </p>
        <p className="text-text-secondary text-xs">{interview.role}</p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-border rounded-full mb-6 max-w-xl overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-primary to-primary-dark rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      <Card className="max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-text-primary text-lg font-medium mb-4">
              {currentQuestion.question}
            </h2>

            <textarea
              rows={6}
              value={answers[currentIndex] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full border border-border rounded-lg px-3 py-2.5 mb-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />
          </motion.div>
        </AnimatePresence>

        {submitError && (
          <p className="text-danger text-sm mb-3 bg-danger/10 px-3 py-2 rounded-lg">{submitError}</p>
        )}

        <div className="flex justify-between">
          <Button variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft size={16} />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleFinish} loading={submitting}>
              <Sparkles size={16} />
              {submitting ? "Evaluating with AI..." : "Finish"}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}