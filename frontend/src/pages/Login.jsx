import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary-dark/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl shadow-xl shadow-primary/10 p-8 w-full max-w-sm"
      >
        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center mb-5 shadow-md shadow-primary/30">
          <Sparkles size={20} className="text-white" />
        </div>

        <h1 className="font-display text-2xl font-semibold text-text-primary mb-1">
          Welcome back
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          Sign in to continue to InterviewIQ
        </p>

        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-danger text-sm mb-4 bg-danger/10 px-3 py-2 rounded-lg"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="new-password"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div className="relative mb-6">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-text-secondary text-sm mt-6 text-center">
          New here?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
