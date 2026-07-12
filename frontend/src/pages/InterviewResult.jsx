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

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-semibold mb-2">
        Interview Complete
      </h1>
      <p className="text-text-secondary mb-6">
        {interview.role} &middot; {interview.difficulty}
      </p>

      {interview.questions.map((q, index) => (
        <Card key={index} className="mb-4">
          <p className="text-text-primary font-medium mb-2">
            {index + 1}. {q.question}
          </p>
          <p className="text-text-secondary text-sm">
            {q.userAnswer || "No answer given"}
          </p>
        </Card>
      ))}

      <Link to="/interview/setup" className="text-primary text-sm">
        Start another interview
      </Link>
    </div>
  );
}