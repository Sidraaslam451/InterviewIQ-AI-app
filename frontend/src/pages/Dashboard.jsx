import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Award, ListChecks } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Card from "../components/Card";
import AnimatedNumber from "../components/AnimatedNumber";

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await api.get("/interview/analytics/summary");
      setAnalytics(res.data);
    };
    fetchAnalytics();
  }, []);

  const stats = analytics
    ? [
        { icon: ListChecks, label: "Total Interviews", value: analytics.totalInterviews },
        { icon: TrendingUp, label: "Average Score", value: `${analytics.averageScore} / 10` },
        { icon: Award, label: "Best Score", value: `${analytics.bestScore} / 10` },
      ]
    : [];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold text-text-primary mb-1"
      >
        Welcome back, {user?.fullName?.split(" ")[0]}
      </motion.h1>
      <p className="text-text-secondary mb-8">{user?.email}</p>

      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="relative overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/5 rounded-full" />
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon size={17} className="text-primary" />
                    </div>
                    <p className="text-text-secondary text-sm mb-1">{stat.label}</p>
                    <p className="font-display text-2xl font-semibold text-text-primary">
                      {typeof stat.value === "number" ? (
                        <AnimatedNumber value={stat.value} />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-between mb-1 relative z-10">
                <div>
                  <p className="text-text-primary font-semibold">Score Trend</p>
                  <p className="text-text-secondary text-xs">Your performance over time</p>
                </div>
                {analytics.scoreTrend.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-full">
                    <TrendingUp size={12} />
                    {analytics.scoreTrend[analytics.scoreTrend.length - 1].score}/10 latest
                  </div>
                )}
              </div>

              {analytics.scoreTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={260} className="relative z-10 mt-4">
                  <LineChart data={analytics.scoreTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <ReferenceLine
                      y={
                        analytics.scoreTrend.reduce((sum, d) => sum + d.score, 0) /
                        analytics.scoreTrend.length
                      }
                      stroke="#9CA3AF"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                    />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #E5E7EB",
                        boxShadow: "0 8px 24px rgba(79,70,229,0.15)",
                        fontSize: 13,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      dot={{ fill: "#6366F1", r: 4, strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 7, strokeWidth: 2, stroke: "#fff" }}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-14 relative z-10">
                  <p className="text-text-secondary text-sm">
                    Complete an interview to see your progress here.
                  </p>
                </div>
              )}

              {analytics.scoreTrend.length > 0 && (
                <div className="flex gap-3 mt-4 relative z-10">
                  <div className="flex-1 bg-bg rounded-lg px-3 py-2 text-center">
                    <p className="text-text-secondary text-xs mb-0.5">Best</p>
                    <p className="text-success font-semibold text-sm">
                      {Math.max(...analytics.scoreTrend.map((d) => d.score))}/10
                    </p>
                  </div>
                  <div className="flex-1 bg-bg rounded-lg px-3 py-2 text-center">
                    <p className="text-text-secondary text-xs mb-0.5">Average</p>
                    <p className="text-primary font-semibold text-sm">
                      {(
                        analytics.scoreTrend.reduce((sum, d) => sum + d.score, 0) /
                        analytics.scoreTrend.length
                      ).toFixed(1)}/10
                    </p>
                  </div>
                  <div className="flex-1 bg-bg rounded-lg px-3 py-2 text-center">
                    <p className="text-text-secondary text-xs mb-0.5">Interviews</p>
                    <p className="text-text-primary font-semibold text-sm">
                      {analytics.scoreTrend.length}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}