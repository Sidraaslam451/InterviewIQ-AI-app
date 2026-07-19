import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import TypewriterText from "../components/TypewriterText";
import { Sparkles, FileText, MessageSquareText } from "lucide-react";

export default function Landing() {
  // eslint-disable-next-line no-unused-vars -- stats data fetch hota hai future/commercial use ke liye, display abhi comment mein hai
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/interview/public-stats");
        setStats(res.data);
      } catch {
        // Fail ho to bhi Landing page normally dikhti rahe, stats section bas skip ho
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative max-w-4xl mx-auto text-center pt-32 pb-20 px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
        >
          <Sparkles size={13} />
          AI-Powered Interview Prep
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl font-semibold text-text-primary mb-6 leading-[1.1] tracking-tight min-h-[2.2em] md:min-h-[1.1em]"
        >
          <TypewriterText
            text="Ace your next technical interview with AI"
            speed={70}
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-secondary text-lg mb-10 max-w-xl mx-auto"
        >
          Upload your resume, get personalized interview questions, and receive
          instant AI feedback to improve — before the real interview.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4 justify-center"
        >
          <Link to="/register">
            <Button variant="primary">Get started free</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">Log in</Button>
          </Link>
        </motion.div>

        {/* Floating decorative gradient orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-10 w-40 h-40 bg-primary-dark/15 rounded-full blur-3xl -z-10" />
      </section>
      {/* Floating Product Preview */}
      <section className="max-w-3xl mx-auto px-6 -mt-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ perspective: 1000 }}
          className="glass-card rounded-2xl shadow-[0_20px_70px_-15px_rgba(79,70,229,0.35)] p-6 border border-white/60"
        >
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <div className="bg-surface rounded-lg border border-border p-5">
            <p className="text-text-secondary text-xs mb-2">
              Question 3 of 5 · Frontend Developer
            </p>
            <p className="text-text-primary font-medium mb-4">
              What is the Virtual DOM, and why does React use it?
            </p>
            <div className="h-16 bg-bg rounded border border-border mb-3" />
            <div className="flex justify-end">
              <div className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg">
                Next Question
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Animated Stats Row */}

      {/*
        ============================================
        STATS SECTION — Static vs Dynamic Switch
        ============================================
        Abhi STATIC (fake/placeholder) numbers active hain, taako demo/portfolio
        ke liye page achi lage jab tak real users na hon.

        Jab app COMMERCIAL/LIVE ho jaye aur real data ho:
        1. Neeche wale STATIC block ko comment kar dein
        2. DYNAMIC block (jo already neeche comment mein hai) ko UNCOMMENT kar dein
        Bas itna hi karna hai — koi naya code likhne ki zaroorat nahi.
      */}

      {/* STATIC VERSION — ABHI ACTIVE */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { value: "10K+", label: "Questions generated" },
            { value: "95%", label: "Users report feeling more confident" },
            { value: "4.9/5", label: "Average rating" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="font-display text-3xl font-semibold gradient-text mb-1">
                {stat.value}
              </p>
              <p className="text-text-secondary text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DYNAMIC VERSION — REAL DATA SE. Commercial launch ke waqt yeh uncomment karein,
          upar wala STATIC section comment kar dein.

      {stats && stats.totalInterviews > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: stats.totalInterviews, label: "Interviews completed" },
              { value: stats.totalQuestions, label: "Questions generated" },
              { value: stats.averageScore ? `${stats.averageScore}/10` : "—", label: "Average score" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="font-display text-3xl font-semibold gradient-text mb-1">{stat.value}</p>
                <p className="text-text-secondary text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      */}

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl font-semibold text-text-primary text-center mb-14"
        >
          Everything you need to prepare
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              title: "Resume-based questions",
              desc: "AI reads your resume and generates questions tailored to your actual skills and experience.",
            },
            {
              icon: MessageSquareText,
              title: "Realistic mock interviews",
              desc: "Practice with timed, role-specific interviews that feel like the real thing.",
            },
            {
              icon: Sparkles,
              title: "Instant AI feedback",
              desc: "Get a score, strengths, weaknesses, and improvement tips after every answer.",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="bg-surface border border-border rounded-2xl p-7 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="text-text-primary font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl font-semibold text-text-primary text-center mb-14"
        >
          How it works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line behind the steps */}
          <div className="hidden md:block absolute top-5 left-[12%] right-[12%] h-0.5 bg-linear-to-r from-primary/10 via-primary/40 to-primary/10 -z-10" />

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
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-linear-to-br  from-primary to-primary-dark text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold shadow-md shadow-primary/30"
              >
                {item.step}
              </motion.div>
              <h3 className="text-text-primary font-semibold mb-1">
                {item.title}
              </h3>
              <p className="text-text-secondary text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
