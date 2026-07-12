import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const fetchInterview = async () => {
      const res = await api.get(`/interview/${id}`);
      setInterview(res.data);
    };
    fetchInterview();
  }, [id]);

  if (!interview) return <p className="text-text-secondary">Loading interview...</p>;

  const currentQuestion = interview.questions[currentIndex];
  const isLastQuestion = currentIndex === interview.questions.length - 1;

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
    const answersPayload = Object.entries(answers).map(([questionIndex, userAnswer]) => ({
      questionIndex: Number(questionIndex),
      userAnswer,
    }));

    try {
      await api.post(`/interview/${id}/submit`, { answers: answersPayload });
      navigate(`/interview/${id}/result`);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-text-secondary text-sm mb-2">
        Question {currentIndex + 1} of {interview.questions.length}
      </p>

      <Card className="max-w-xl">
        <h2 className="text-text-primary text-lg font-medium mb-4">
          {currentQuestion.question}
        </h2>

        <textarea
          rows={6}
          value={answers[currentIndex] || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full border border-border rounded px-3 py-2 mb-4 text-text-primary"
        />

        <div className="flex justify-between">
          <Button variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
            Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleFinish} disabled={submitting}>
              {submitting ? "Submitting..." : "Finish"}
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </Card>
    </div>
  );
}