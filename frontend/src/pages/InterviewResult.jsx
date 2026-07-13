import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Card from "../components/Card";

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

  if (!interview) return <p className="text-text-secondary">Loading result...</p>;

  const getScoreColor = (score) => {
    if (score >= 7) return "text-success";
    if (score >= 4) return "text-warning";
    return "text-danger";
  };

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-semibold mb-2">
        Interview Complete
      </h1>
      <p className="text-text-secondary mb-4">
        {interview.role} &middot; {interview.difficulty}
      </p>

      {interview.overallScore !== null && (
        <Card className="mb-6 max-w-xs">
          <p className="text-text-secondary text-sm mb-1">Overall Score</p>
          <p className={`text-4xl font-semibold ${getScoreColor(interview.overallScore)}`}>
            {interview.overallScore} / 10
          </p>
        </Card>
      )}

      {interview.questions.map((q, index) => (
        <Card key={index} className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-text-primary font-medium">
              {index + 1}. {q.question}
            </p>
            {q.score !== null && (
              <span className={`font-semibold ${getScoreColor(q.score)}`}>
                {q.score}/10
              </span>
            )}
          </div>
          <p className="text-text-secondary text-sm mb-2">
            <strong>Your answer:</strong> {q.userAnswer || "No answer given"}
          </p>
          {q.feedback && (
            <p className="text-text-secondary text-sm bg-bg border border-border rounded p-3">
              {q.feedback}
            </p>
          )}
        </Card>
      ))}

      <Link to="/interview/setup" className="text-primary text-sm">
        Start another interview
      </Link>
    </div>
  );
}