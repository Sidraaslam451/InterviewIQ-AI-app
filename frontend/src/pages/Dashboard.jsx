import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import StatCard from "../components/StatCard";
import Card from "../components/Card";

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

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-semibold mb-1">
        Welcome, {user?.fullName}
      </h1>
      <p className="text-text-secondary mb-6">{user?.email}</p>

      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Interviews" value={analytics.totalInterviews} />
            <StatCard label="Average Score" value={`${analytics.averageScore} / 10`} />
            <StatCard label="Best Score" value={`${analytics.bestScore} / 10`} />
          </div>

          <Card>
            <p className="text-text-primary font-medium mb-4">Score Trend</p>
            {analytics.scoreTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics.scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-secondary text-sm">
                Complete an interview to see your progress here.
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}