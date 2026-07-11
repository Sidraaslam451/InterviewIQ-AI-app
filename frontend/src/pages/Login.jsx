import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded p-8 w-full max-w-sm"
      >
        <h1 className="text-text-primary text-2xl font-semibold mb-6">
          Log in to InterviewIQ
        </h1>

        {error && (
          <p className="text-danger text-sm mb-4">{error}</p>
        )}

        <label className="block text-text-secondary text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-border rounded px-3 py-2 mb-4 text-text-primary"
        />

        <label className="block text-text-secondary text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-border rounded px-3 py-2 mb-6 text-text-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-text-secondary text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}