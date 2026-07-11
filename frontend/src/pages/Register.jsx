import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(fullName, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <h1 className="text-text-primary text-2xl font-semibold mb-6">
            Create your account
          </h1>

          {error && <p className="text-danger text-sm mb-4">{error}</p>}

          <label className="block text-text-secondary text-sm mb-1">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border border-border rounded px-3 py-2 mb-4 text-text-primary"
          />

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
            minLength={8}
            className="w-full border border-border rounded px-3 py-2 mb-6 text-text-primary"
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>

          <p className="text-text-secondary text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Log in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}