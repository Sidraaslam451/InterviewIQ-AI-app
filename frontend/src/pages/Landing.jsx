import { Link } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center pt-24 pb-16 px-6">
        <h1 className="text-text-primary text-4xl font-semibold mb-4">
          Ace your next technical interview with AI
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Upload your resume, get personalized interview questions, and receive
          instant AI feedback to improve — before the real interview.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register">
            <Button variant="primary">Get started free</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">Log in</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-text-primary text-2xl font-semibold text-center mb-10">
          Everything you need to prepare
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-border rounded p-6">
            <h3 className="text-text-primary font-medium mb-2">
              Resume-based questions
            </h3>
            <p className="text-text-secondary text-sm">
              AI reads your resume and generates questions tailored to your
              actual skills and experience.
            </p>
          </div>
          <div className="bg-surface border border-border rounded p-6">
            <h3 className="text-text-primary font-medium mb-2">
              Realistic mock interviews
            </h3>
            <p className="text-text-secondary text-sm">
              Practice with timed, role-specific interviews that feel like the
              real thing.
            </p>
          </div>
          <div className="bg-surface border border-border rounded p-6">
            <h3 className="text-text-primary font-medium mb-2">
              Instant AI feedback
            </h3>
            <p className="text-text-secondary text-sm">
              Get a score, strengths, weaknesses, and improvement tips after
              every answer.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-text-primary text-2xl font-semibold text-center mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Upload resume", desc: "PDF, takes seconds" },
            {
              step: "2",
              title: "Choose role & difficulty",
              desc: "Pick what fits you",
            },
            {
              step: "3",
              title: "Take the interview",
              desc: "Answer AI-generated questions",
            },
            {
              step: "4",
              title: "Get feedback",
              desc: "Score, tips, and progress tracking",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-medium">
                {item.step}
              </div>
              <h3 className="text-text-primary font-medium mb-1">
                {item.title}
              </h3>
              <p className="text-text-secondary text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
