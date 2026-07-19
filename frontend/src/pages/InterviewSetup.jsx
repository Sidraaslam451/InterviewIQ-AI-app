import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Gauge, ListOrdered, Sparkles } from "lucide-react";
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

  const difficulties = [
    { value: "easy", label: "Easy", color: "success" },
    { value: "medium", label: "Medium", color: "warning" },
    { value: "hard", label: "Hard", color: "danger" },
  ];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold text-text-primary mb-1"
      >
        Start a mock interview
      </motion.h1>
      <p className="text-text-secondary mb-8">Tell us what you're preparing for</p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="max-w-md relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

          <form onSubmit={handleGenerate} className="relative z-10">
            {error && (
              <p className="text-danger text-sm mb-4 bg-danger/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <div className="mb-5">
              <label className="flex items-center gap-1.5 text-text-secondary text-sm font-medium mb-2">
                <Briefcase size={14} />
                Role / Field
              </label>
              <input
                type="text"
                list="role-suggestions"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer, Chef, Teacher..."
                required
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <datalist id="role-suggestions">
                <option value="Frontend Developer" />
                <option value="Backend Developer" />
                <option value="Full Stack Developer" />
                <option value="Data Analyst" />
                <option value="Marketing Manager" />
                <option value="Product Manager" />
              </datalist>
            </div>

            <div className="mb-5">
              <label className="flex items-center gap-1.5 text-text-secondary text-sm font-medium mb-2">
                <Gauge size={14} />
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((d) => (
                  <motion.button
                    key={d.value}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setDifficulty(d.value)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                      difficulty === d.value
                        ? `bg-${d.color}/10 border-${d.color} text-${d.color}`
                        : "border-border text-text-secondary hover:border-text-secondary"
                    }`}
                  >
                    {d.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <label className="flex items-center gap-1.5 text-text-secondary text-sm font-medium mb-2">
                <ListOrdered size={14} />
                Number of questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value={5}>5 questions</option>
                <option value={10}>10 questions</option>
                <option value={15}>15 questions</option>
              </select>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              <Sparkles size={16} />
              {loading ? "Generating questions..." : "Start interview"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}