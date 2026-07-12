import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";

export default function InterviewSetup() {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/interview/generate", {
        role,
        difficulty,
        questionCount: Number(questionCount),
      });
      navigate(`/interview/${res.data.interview._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-semibold mb-6">
        Start a mock interview
      </h1>

      <Card className="max-w-md">
        <form onSubmit={handleGenerate}>
          {error && <p className="text-danger text-sm mb-3">{error}</p>}

          <label className="block text-text-secondary text-sm mb-1">
            Role / Field
          </label>
          <input
            type="text"
            list="role-suggestions"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend Developer, Marketing Manager, Teacher..."
            required
            className="w-full border border-border rounded px-3 py-2 mb-4 text-text-primary"
          />
          <datalist id="role-suggestions">
            <option value="Frontend Developer" />
            <option value="Backend Developer" />
            <option value="Full Stack Developer" />
            <option value="Data Analyst" />
            <option value="Marketing Manager" />
            <option value="Product Manager" />
            <option value="HR Specialist" />
            <option value="Sales Executive" />
            <option value="Teacher" />
            <option value="Accountant" />
          </datalist>

          <label className="block text-text-secondary text-sm mb-1">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 mb-4 text-text-primary"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label className="block text-text-secondary text-sm mb-1">
            Number of questions
          </label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 mb-6 text-text-primary"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Generating questions..." : "Start interview"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
